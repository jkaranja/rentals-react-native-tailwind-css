import React, { useEffect, useState } from "react";

import { Button, HelperText, TextInput } from "react-native-paper";

import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
  useForm,
} from "react-hook-form";

import Toast from "react-native-toast-message";
import { KeyboardAvoidingView, Pressable, Text, View } from "react-native";
import { PWD_REGEX } from "../../constants/regex";
import { useResetPwdMutation } from "./authApiSlice";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const ResetScreen = () => {

const insets = useSafeAreaInsets();


  const [resetPwd, { data, error, isLoading, isError, isSuccess }] =
    useResetPwdMutation();

  type ResetInputs = {
    confirmPassword: string;
    password: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = useForm<ResetInputs>();

  const onSubmit = async (inputs: ResetInputs) => {
    await resetPwd({
      password: inputs.password,
      resetPwdToken: "",
    });
  };

  //feedback
  useEffect(() => {
    if (isError) Toast.show({ type: "error", text1: error as string });

    if (isSuccess) Toast.show({ type: "success", text1: data?.message });

    return () => Toast.hide();
  }, [isError, isSuccess]);

  return (
    <KeyboardAwareScrollView className="flex-1 p-5  gap-y-5 " style={{ paddingTop: insets.top }}>
      <View>
        <Text className="text-3xl font-semibold ">Reset password</Text>
        <Text className="text-gray-muted ">Enter your new password</Text>
      </View>
      <Controller
        name="password"
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
            error={Boolean(errors.password?.message)} //Whether to style the TextInput with error style.
            label="password"
          />
        )}
      />
      <HelperText type="error" visible={Boolean(errors.password?.message)}>
        {errors.password?.message}
      </HelperText>

      <Controller
        name="confirmPassword"
        control={control}
        rules={{
          required: "Password is required",
          validate: (value, formValues) =>
            formValues.password === value || "Passwords don't match",
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
        icon="arrow-right" //any MaterialCommunityIcons icon name//see https://icons.expo.fyi/Index
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        //uppercase//boolean//Make the label text uppercased
        // icon={({ size, color }) => (
        //   <Image
        //     source={require("../assets/chameleon.jpg")}
        //     style={{ width: size, height: size, tintColor: color }}
        //   />
        // )}//custom icon component
        //icon={require('../assets/chameleon.jpg')}//load img as icon
        //icon={{ uri: 'https://avatars0.githubusercontent.com/u/17571969?v=3&s=400' }}//remote img
        //mode='text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal'//Default value: 'text'
        //dark= false// boolean//Whether the color is a dark color///only when mode= contained, contained-tonal and elevated modes
        //buttonColor=""
        //textColor=""
        //compact
        //rippleColor=""//Color of the ripple effect.
        loading={isLoading} //boolean //Whether to show a loading indicator
        //disabled //boolean
        //onPressIn
        //style
        //labelStyle={{fontSize: 20}}////Style for the button text.
      >
        Set new password
      </Button>
    </KeyboardAwareScrollView>
  );
};

export default ResetScreen;
