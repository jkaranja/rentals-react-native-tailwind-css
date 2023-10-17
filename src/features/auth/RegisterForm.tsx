import React, { useState } from "react";

import PhoneInput from "react-native-phone-number-input";
import { Button, HelperText, TextInput } from "react-native-paper";

import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import { PHONE_NUMBER_REGEX, PWD_REGEX } from "../../constants/regex";
import { TAuthInputs } from "./SignupScreen";
import { KeyboardAvoidingView, Pressable, Text, View } from "react-native";
import { Link } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import PhoneNumberInput from "@/components/PhoneInput";

type RegisterFormProps = {
  register: UseFormRegister<TAuthInputs>;
  errors: FieldErrors<TAuthInputs>;
  handleSubmit: () => Promise<void>;
  isLoading: boolean;
  control: Control<TAuthInputs>;
};

const RegisterForm = ({
  handleSubmit,
  register,
  errors,
  isLoading,
  control,
}: RegisterFormProps) => {
  return (
    <KeyboardAwareScrollView>
      <Controller
        name="username"
        control={control}
        rules={{
          required: "Username is required",
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            clearButtonMode="while-editing"
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
        name="password"
        control={control}
        rules={{
          required: "Password is required",
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

      <Button
       // icon="arrow-right" //any MaterialCommunityIcons icon name//see https://icons.expo.fyi/Index
        mode="contained"
        onPress={handleSubmit}
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
        Sign up
      </Button>
    </KeyboardAwareScrollView>
  );
};

export default RegisterForm;
