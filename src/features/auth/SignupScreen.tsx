import { KeyboardAvoidingView, Pressable, Text, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { PHONE_NUMBER_REGEX, PWD_REGEX } from "../../constants/regex";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { setCredentials } from "./authSlice";
import { useRegisterUserMutation } from "./userApiSlice";
import RegisterForm from "./RegisterForm";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import { Link, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type TAuthInputs = {
  username: string;
  password: string;
  phoneNumber: string;
};

const SignupScreen = () => {

const insets = useSafeAreaInsets();

  const dispatch = useAppDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
    watch,
    register,
  } = useForm<TAuthInputs>();

  const [registerUser, { data, error, isLoading, isError, isSuccess }] =
    useRegisterUserMutation();

  /**--------------------------------
   HANDLE SIGN UP SUBMIT
 -------------------------------------*/
  const onSubmit: SubmitHandler<TAuthInputs> = async (data) => {
    await registerUser(data);
  };

  //feedback
  useEffect(() => {
    if (isError) {
      Toast.show({ type: "error", text1: error as string });
    }

    //save token to redux store + secure store
    const saveToken = async () => {
      try {
        //save token to secure store//size limit= 2kb//you will get a warning or error is limit is reached
        await SecureStore.setItemAsync("token", data!.accessToken);
        // save token->store//synchronously
        dispatch(setCredentials(data!.accessToken));
        //navigate to profile//replace->can't navigate back to this page with the back btn/hides it
        router.replace({
          pathname: "/profile",
        });
      } catch (error) {
        //  console.log;
      }
    };
    //on success & token is not null
    if (isSuccess && data?.accessToken) saveToken();

    return () => Toast.hide(); //To hide the current visible Toast//default is 4 secs
  }, [isError, isSuccess, data]);

  return (
    <View
      className="flex-1  p-6  justify-center"
      style={{ paddingTop: insets.top }}
    >
      <Text className="text-3xl font-semibold ">Create an account</Text>
      <Text className="text-gray-muted my-3">Please sign-up below</Text>

      <View>
        <RegisterForm
          handleSubmit={handleSubmit(onSubmit)}
          errors={errors}
          control={control}
          register={register}
          isLoading={isLoading}
        />
      </View>

      <View className="flex-row gap-x-2 items-center py-3">
        <Text className=" text-gray-muted  items-center">
          Already have an account?
        </Text>
        <Link href="/auth/login" className="text-emerald">
          Log in
        </Link>
      </View>
    </View>
  );
};

export default SignupScreen;
