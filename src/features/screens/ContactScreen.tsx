import { View, Text } from "react-native";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { Toast } from "react-native-toast-message/lib/src/Toast";
import { Button, HelperText, TextInput } from "react-native-paper";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { EMAIL_REGEX } from "@/constants/regex";
import { useSendContactMessageMutation } from "./contactApiSlice";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ContactScreen = () => {
  const insets = useSafeAreaInsets();

  const [sendMessage, { data, error, isLoading, isError, isSuccess }] =
    useSendContactMessageMutation();

  type ForgotInputs = {
    name: string;
    message: string;
    email: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ForgotInputs>();

  const onSubmit = async (inputs: ForgotInputs) => {
    await sendMessage({
      data: inputs,
    });
  };

  //feedback
  useEffect(() => {
    if (isError) {
      Toast.show({ type: "error", text1: error as string });
    }

    //on success
    if (isSuccess) {
      Toast.show({
        type: "success", // error || info
        text1: data?.message,
      });
    }
    return () => Toast.hide();
  }, [isError, isSuccess]);

  return (
    <KeyboardAwareScrollView
      className="flex-1  p-4 mt-4"
      style={{ paddingTop: insets.top }}
    >
      <Text className="text-xl font-bold mb-3">Get in touch with us</Text>
      <Text className=" py-2">
        Let us know how we can help. We will get in touch soon.
      </Text>
      <Controller
        name="name"
        control={control}
        rules={{
          required: "Name is required",
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            autoComplete="name" //Specifies autocomplete hints for the system, so it can provide autofill(off to disable). eg name|email|
            //secureTextEntry//If true, the text input obscures the text entered so that sensitive text like passwords stay secure.
            mode="outlined"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={Boolean(errors.name?.message)} //Whether to style the TextInput with error style.
            label="Name"
          />
        )}
      />
      <HelperText type="error" visible={Boolean(errors.name?.message)}>
        {errors.name?.message}
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

      <Controller
        name="message"
        control={control}
        rules={{
          required: "Message is required",
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            multiline //=boolean//whether the input can have multiple lines.
            numberOfLines={4}
            //also inherits react native TextInput props
            //keyboardType="number-pad" //or numeric
            clearButtonMode="while-editing"
            // autoComplete="tel" //Specifies autocomplete hints for the system, so it can provide autofill(off to disable). eg username|email|
            //secureTextEntry//If true, the text input obscures the text entered so that sensitive text like passwords stay secure.
            mode="outlined"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            //left={<TextInput.Affix text="+254" />}
            error={Boolean(errors.message?.message)} //Whether to style the TextInput with error style.
            label="Message"
          />
        )}
      />
      <HelperText type="error" visible={Boolean(errors.message?.message)}>
        {errors.message?.message}
      </HelperText>

      <View>
        <Button
          onPress={handleSubmit(onSubmit)}
          className="rounded-md"
          mode="contained"
          loading={isLoading}
          labelStyle={
            {
              //fontSize: 13,
              // marginVertical: 8,
            }
          } //Style for the button text.
          //style={{ width: "100%" }}
          //textColor={colors.gray.dark}
        >
          Submit
        </Button>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default ContactScreen;
