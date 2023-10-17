import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { Link, router } from "expo-router";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useLoginMutation } from "./authApiSlice";
import { setCredentials } from "./authSlice";
import SignInForm from "./SignInForm";
import { TAuthInputs } from "./SignupScreen";

import * as SecureStore from "expo-secure-store";
import { Text, View } from "react-native";

import Toast from "react-native-toast-message";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const LoginScreen = () => {
  const dispatch = useAppDispatch();

    const insets = useSafeAreaInsets();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
    watch,
    register,
  } = useForm<TAuthInputs>();

  const [login, { data, error, isLoading, isError, isSuccess }] =
    useLoginMutation();

  /**--------------------------------
   HANDLE SIGN UP SUBMIT
 -------------------------------------*/
  const onSubmit: SubmitHandler<Omit<TAuthInputs, "username">> = async (
    data
  ) => {
    await login(data);
  };

  //login/verify feedback
  useEffect(() => {
    if (isError) {
      Toast.show({ type: "error", text1: error as string });
    }
    // //on success & token is not null
    // if (isSuccess) {
    //   Toast.show({
    //     type: "success", // error || info
    //     text1: data?.message,
    //     //text2: "Second line of text"
    //     //position: "top", //or bottom//default: bottom
    //     //visibilityTime:{4000}//default = 4000ms
    //     //autoHide:{true}//default: true
    //     //onPress: ()=> void //Called on Toast press
    //     //bottomOffset={40} //Offset from the bottom of the screen (in px). Has effect only when position is bottom
    //     //topOffset={40}//Offset from the top of the screen
    //   });
    // }

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
        console.log;
      }
    };
    //on success & token is not null
    if (isSuccess && data?.accessToken) saveToken();

    return () => Toast.hide(); //To hide the current visible Toast//default is 4 secs
  }, [isError, isSuccess, data]);

  return (
    <View
      className="flex-1 p-6     justify-center "
      style={{ paddingTop: insets.top }}
    >
      <Text className="text-3xl font-semibold ">Welcome back</Text>

      <Text className="text-gray-muted my-3">
        Please sign-in to your account below
      </Text>

      <View>
        <SignInForm
          handleSubmit={handleSubmit(onSubmit)}
          errors={errors}
          control={control}
          register={register}
          isLoading={isLoading}
        />
      </View>

      <View className="flex-row gap-x-2 items-center">
        <Text className=" text-gray-muted  items-center">
          Don't have an account yet?
        </Text>
        <Link href="/auth/signup" className="text-emerald">
          Sign up
        </Link>
      </View>
    </View>
  );
};

export default LoginScreen;
