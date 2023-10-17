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

import {
  EMAIL_REGEX,
  OTP_REGEX,
  PHONE_NUMBER_REGEX,
  PWD_REGEX,
} from "@/constants/regex";

import { PROFILE_PIC_ROOT } from "@/constants/paths";
import { IUser } from "@/types/user";
import PhoneInput from "react-native-phone-number-input";
import { useUpdateUserMutation } from "../auth/userApiSlice";
import ConfirmPwd from "./ConfirmPwd";
import { AccountInputs } from "./AccountScreen";
import { useSafeAreaInsets } from "react-native-safe-area-context";



const SecurityScreen = () => {
const insets = useSafeAreaInsets();


  //dialogs
  const [openPwdD, setOpenPwdD] = useState(false);
  const handleTogglePwdD = () => setOpenPwdD((prev) => !prev);

  //pwd hook
  const {
    register: register,
    handleSubmit: handleSubmit,
    formState: { errors, isValid, submitCount },
    watch,
    reset: resetForm,
    control,
  } = useForm<AccountInputs>({ mode: "onChange" });

  const [updateUser, { data, error, isLoading, isError, isSuccess }] =
    useUpdateUserMutation();
  /**--------------------------------
   HANDLE PWD SUBMIT
 -------------------------------------*/
  const onSubmit: SubmitHandler<AccountInputs> = async (data) => {
    await updateUser({
      newPassword: data.newPassword,
      password: data.password,
    });
  };

  //close pass dialog if account inputs error
  useEffect(() => {
    if (errors.newPassword || errors.confirmPassword) {
      setOpenPwdD(false);
    }
  }, [Object.keys(errors).length, submitCount]); //1st submit try errors change coz mode= onSubmit//close d if err//2nd try if same err, errors does change, dialog not closed=> use submitCount/(can be enough alone)

  //feedback
  useEffect(() => {
    if (isSuccess) {
      resetForm({ newPassword: "", confirmPassword: "" });
    }

    if (isError) Toast.show({ type: "error", text1: error as string });

    if (isSuccess) Toast.show({ type: "success", text1: "Updated" });

    if (isSuccess) setOpenPwdD(false);

    return () => Toast.hide();
  }, [isError, isSuccess]);

  return (
    <KeyboardAwareScrollView
      className="flex-1 p-6 mt-4"
      style={{ paddingTop: insets.top }}
    >
      {openPwdD && (
        <ConfirmPwd
          control={control}
          errors={errors}
          register={register}
          isLoading={isLoading}
          handleSubmit={handleSubmit(onSubmit)} //pass the cb returned by handleSubmit(arg)
          open={openPwdD}
          handleClose={handleTogglePwdD}
        />
      )}
      <Text className="text-xl font-bold mb-3">Change Password</Text>
      <Controller
        name="newPassword"
        control={control}
        rules={{
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Enter at least 6 characters",
          },
          pattern: {
            value: PWD_REGEX,
            message: "Spaces not allowed",
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            clearButtonMode="while-editing"
            autoComplete="password" //Specifies autocomplete hints for the system, so it can provide autofill(off to disable). eg password|email|
            secureTextEntry //If true, the text input obscures the text entered so that sensitive text like passwords stay secure.
            mode="outlined"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={Boolean(errors.newPassword?.message)} //Whether to style the TextInput with error style.
            label="Password"
          />
        )}
      />
      <HelperText type="error" visible={Boolean(errors.newPassword?.message)}>
        {errors.newPassword?.message}
      </HelperText>

      <Controller
        name="confirmPassword"
        control={control}
        rules={{
          required: "Password is required",
          validate: (value, formValues) =>
            formValues.newPassword === value || "Passwords don't match",
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            clearButtonMode="while-editing"
            autoComplete="password" //Specifies autocomplete hints for the system, so it can provide autofill(off to disable). eg password|email|
            secureTextEntry //If true, the text input obscures the text entered so that sensitive text like passwords stay secure.
            mode="outlined"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={Boolean(errors.password?.message)} //Whether to style the TextInput with error style.
            label="Confirm password"
          />
        )}
      />
      <HelperText
        type="error"
        visible={Boolean(errors.confirmPassword?.message)}
      >
        {errors.confirmPassword?.message}
      </HelperText>

      <Button
        mode="contained"
        disabled={isLoading}
        loading={isLoading}
        onPress={handleTogglePwdD}
      >
        Change password
      </Button>
    </KeyboardAwareScrollView>
  );
};

export default SecurityScreen;
