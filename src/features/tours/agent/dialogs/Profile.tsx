import { useEffect, useState } from "react";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { format } from "date-fns";
import { Image } from "expo-image";

import { FlatList, Text, View, Linking } from "react-native";

import Toast from "react-native-toast-message";
import { EvilIcons, FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Avatar,
  Button,
  Card,
  Dialog,
  Divider,
  HelperText,
  IconButton,
  List,
  Portal,
  TextInput,
} from "react-native-paper";
import { IProfile, IReview } from "@/types/user";

import { IMAGE_ROOT, PROFILE_PIC_ROOT } from "@/constants/paths";
import { ITour } from "@/types/tour";
import { usePostMessageMutation } from "@/features/chat/chatApiSlice";
import { Controller, useForm } from "react-hook-form";
import colors from "@/constants/colors";

type ProfileProps = {
  open: boolean;
  handleClose: () => void;
  tour: ITour;
};

const Profile = ({ open, handleClose, tour }: ProfileProps) => {
  const [postMessage, { isLoading, isSuccess, isError, error, data }] =
    usePostMessageMutation();

  type Inputs = {
    message: string;
  };
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, submitCount },
    reset: resetForm,
    control,
    watch,
    getValues,
    setValue,
  } = useForm<Inputs>();

  const onSubmit = async (data: Inputs) => {
    const formData = new FormData();
    formData.append("content", data.message);
    formData.append("recipient", tour.renter._id!);
    await postMessage(formData);
  };

  //feedback
  useEffect(() => {
    if (isError) Toast.show({ type: "error", text1: error as string });

    if (isSuccess) Toast.show({ type: "success", text1: data?.message });

    if (isSuccess) handleClose();

    //return () => toast.dismiss();//don't dismiss
  }, [isError, isSuccess]);

  return (
    <Portal>
      <Dialog
        visible={open}
        onDismiss={handleClose}
        dismissable //Determines whether clicking outside the dialog dismiss it.
        style={{
          borderRadius: 12,
          backgroundColor: "#fff",
          paddingTop: 0,
          paddingVertical: 0,
        }}
        // dismissableBackButton//Determines whether clicking Android hardware back button dismiss dialog.
      >
        <Dialog.Title
          className=""
          style={{
            marginTop: 0,
            marginBottom: 0,
            marginLeft: 0,
            marginRight: 0,
            height: 0,
          }}
        >
          {""}
        </Dialog.Title>
        <Dialog.Content className="rounded-xl  p-0 ">
          <View className="flex-row justify-between text-right items-center  p-4">
            <Text className="text-lg">
              Get in touch with {tour.renter?.username.split(" ").shift()}{" "}
            </Text>
            <EvilIcons name="close" size={24} onPress={handleClose} />
          </View>

          <View className="px-5 pb-8">
            <List.Item
              titleStyle={{}}
              title={
                <Text className="text-lg font-semibold">
                  {tour.renter?.username}
                </Text>
              }
              left={() => (
                <Avatar.Icon
                  size={40}
                  icon={({ size, color }) => {
                    size = size + 20;
                    return tour.renter?.profile?.profilePic?.filename ? (
                      <Image
                        source={`${PROFILE_PIC_ROOT}/${tour.renter?.profile?.profilePic?.filename}`}
                        className="rounded-full"
                        style={{ width: size, height: size }}
                      />
                    ) : (
                      <FontAwesome name="user-o" size={24} color="black" />
                    );
                  }}
                  color="#10b981"
                  style={{ backgroundColor: "#e2e8f0" }}
                />
              )}
            />

            <Text className="mt-3  font-medium">Call or WhatsApp</Text>

            <View className="flex-row">
              {[...Array(2)].map((_, i) => {
                const icon = i === 0 ? "phone" : "whatsapp";
                return (
                  <IconButton
                    icon={icon}
                    iconColor={colors.emerald.DEFAULT}
                    size={30}
                    onPress={() =>
                      i === 0
                        ? Linking.openURL(`tel:${tour.renter?.phoneNumber}`)
                        : Linking.openURL(
                            `whatsapp://send?phone=${tour.renter?.phoneNumber}`
                          )
                    } //open installed app based on url scheme
                  />
                );
              })}
            </View>

            <Text className="mt-3  font-medium">Send message</Text>

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
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            mode="contained"
            disabled={isLoading}
            loading={isLoading}
            onPress={handleSubmit(onSubmit)}
          >
            Send Message
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default Profile;
