import { useEffect } from "react";

import PhoneInput from "react-native-phone-number-input";

import { Button, HelperText, TextInput } from "react-native-paper";

import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { PHONE_NUMBER_REGEX } from "../../constants/regex";
import { useForgotPwdMutation } from "./authApiSlice";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import PhoneNumberInput from "@/components/PhoneInput";

const ForgotScreen = () => {
  const insets = useSafeAreaInsets();

  const [forgotPwd, { data, error, isLoading, isError, isSuccess }] =
    useForgotPwdMutation();

  type ForgotInputs = {
    email: string;
    phoneNumber: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ForgotInputs>();

  const onSubmit = async (inputs: ForgotInputs) => {
    await forgotPwd(inputs);
  };

  //feedback
  useEffect(() => {
    if (isError) Toast.show({ type: "error", text1: error as string });

    if (isSuccess) Toast.show({ type: "success", text1: data?.message });

    return () => Toast.hide();
  }, [isError, isSuccess]);

  return (
    <KeyboardAwareScrollView
      className="flex-1 p-5   mt-4"
      style={{ paddingTop: insets.top }}
    >
      <View className="py-5">
        <Text className="text-3xl font-semibold my-3 ">Forgot Password?</Text>
        <Text className="text-gray-muted ">
          Enter your account phone number and we′ll send you a link the provided
          email to reset your password
        </Text>
      </View>

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
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            clearButtonMode="while-editing"
            autoComplete="email" //Specifies autocomplete hints for the system, so it can provide autofill(off to disable). eg email|password|
            // secureTextEntry //If true, the text input obscures the text entered so that sensitive text like password stay secure.
            mode="outlined"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={Boolean(errors.email?.message)} //Whether to style the TextInput with error style.
            label="email"
          />
        )}
      />
      <HelperText type="error" visible={Boolean(errors.email?.message)}>
        {errors.email?.message}
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
        Send reset link
      </Button>
    </KeyboardAwareScrollView>
  );
};

export default ForgotScreen;
