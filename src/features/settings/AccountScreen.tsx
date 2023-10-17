import {
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  Pressable,
} from "react-native";
import { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Avatar,
  Button,
  Divider,
  HelperText,
  IconButton,
  TextInput,
} from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";

import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import colors from "@/constants/colors";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { EMAIL_REGEX, OTP_REGEX, PHONE_NUMBER_REGEX } from "@/constants/regex";

import { PROFILE_PIC_ROOT } from "@/constants/paths";
import { IUser } from "@/types/user";
import PhoneInput from "react-native-phone-number-input";
import { useGetUserQuery, useUpdateUserMutation } from "../auth/userApiSlice";
import ConfirmPwd from "./ConfirmPwd";
import PhoneNumberInput from "@/components/PhoneInput";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type AccountInputs = {
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  newPassword: string;
  confirmPassword: string;
};

const AccountScreen = () => {

 const insets = useSafeAreaInsets();

  const [updateUser, { data, error, isLoading, isError, isSuccess }] =
    useUpdateUserMutation();

  //dialogs
  const [openPwdD, setOpenPwdD] = useState(false);
  const handleTogglePwdD = () => setOpenPwdD((prev) => !prev);

  /**--------------------------------
   FETCH USER
 -------------------------------------*/
  const { data: user, isFetching } = useGetUserQuery(undefined, {
    // pollingInterval: 15000,
    // refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  

  //r-hook-from
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, submitCount },
    reset: resetForm,
    control,
    watch,
    getValues,
    setValue,
  } = useForm<AccountInputs>({mode: "onChange"});

  const onSubmit: SubmitHandler<AccountInputs> = async (data) => {
    await updateUser({
      username: data.username,
      phoneNumber: data.phoneNumber,
      email: data.email,
      password: data.password,
    });
  };
  //set defaults
  useEffect(() => {
    resetForm({
      username: user?.username || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
    });
  }, [user]);

  //close pass dialog if account inputs error
  useEffect(() => {
    if (errors.username || errors.phoneNumber || errors.email) {
      setOpenPwdD(false);
    }
  }, [Object.keys(errors).length, submitCount]); //note: passing errors won;t work => errors holds a reference to errors object/won't change

  //feedback
  useEffect(() => {
    if (isError) Toast.show({ type: "error", text1: error as string });

    if (isSuccess) Toast.show({ type: "success", text1: data?.message });

    if (isSuccess) setOpenPwdD(false);

    return () => Toast.hide();
  }, [isError, isSuccess]);


  if (!user) return (
    <View className="flex-1 p-6 mt-4">
      <ActivityIndicator color={colors.gray.light} size={35} />
    </View>
  );

  return (
    <KeyboardAwareScrollView className="flex-1 p-6 mt-4" style={{ paddingTop: insets.top }}>
      {openPwdD && (
        <ConfirmPwd
          errors={errors}
          control={control}
          register={register}
          isLoading={isLoading}
          handleSubmit={handleSubmit(onSubmit)} //pass the cb returned by handleSubmit(arg)
          open={openPwdD}
          handleClose={handleTogglePwdD}
        />
      )}

      <Text className="text-xl font-bold mb-3">Account details</Text>

      <Controller
        name="username"
        control={control}
        rules={{
          required: "Username is required",
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            autoComplete="username" //Specifies autocomplete hints for the system, so it can provide autofill(off to disable). eg username|email|
            //secureTextEntry//If true, the text input obscures the text entered so that sensitive text like passwords stay secure.
            mode="outlined"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={Boolean(errors.username?.message)} //Whether to style the TextInput with error style.
            label="Username"
          />
        )}
      />
      <HelperText type="error" visible={Boolean(errors.username?.message)}>
        {errors.username?.message}
      </HelperText>

      <Controller
        name="phoneNumber"
        control={control}
        rules={{
          required: "Phone number is required",
          pattern: {
            value: PHONE_NUMBER_REGEX,
            message: "Please match the format: +254XXXXXXXXX ",
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <PhoneNumberInput
            value={value} //string
            onChangeFormattedText={onChange}
          />
        )}
      />

      <HelperText type="error" visible={Boolean(errors.phoneNumber?.message)}>
        {errors.phoneNumber?.message}
      </HelperText>

      <Controller
        name="email"
        control={control}
        rules={{
          required: "Email is required",
          pattern: {
            value: EMAIL_REGEX,
            message: "Enter an email address",
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            clearButtonMode="while-editing"
            autoComplete="email" //Specifies autocomplete hints for the system, so it can provide autofill(off to disable). eg username|email|
            //secureTextEntry//If true, the text input obscures the text entered so that sensitive text like passwords stay secure.
            mode="outlined"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={Boolean(errors.email?.message)} //Whether to style the TextInput with error style.
            label="Email"
          />
        )}
      />
      <HelperText type="error" visible={Boolean(errors.email?.message)}>
        {errors.email?.message}
      </HelperText>

      <Button
        mode="contained"
        disabled={isLoading}
        loading={isLoading}
        onPress={handleTogglePwdD}
      >
        Save changes
      </Button>
    </KeyboardAwareScrollView>
  );
};

export default AccountScreen;
