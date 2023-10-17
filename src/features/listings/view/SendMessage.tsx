import { useEffect, useState, useRef } from "react";
import { Controller, useForm } from "react-hook-form";

import {
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  Pressable,
  SectionList,
} from "react-native";
import { Image } from "expo-image";

import Toast from "react-native-toast-message";
import {
  EvilIcons,
  FontAwesome,
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { IImage } from "@/types/file";
import * as ImagePicker from "expo-image-picker";
import {
  ActivityIndicator,
  Avatar,
  Button,
  Divider,
  HelperText,
  IconButton,
  TextInput,
  Dialog,
  Portal,
  List,
  DataTable,
} from "react-native-paper";
import colors from "@/constants/colors";

import { useGetListingQuery } from "./viewApiSlice";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetProfileQuery } from "@/features/auth/userApiSlice";

import SwipeableViews from "@/components/SwipeableViews";
import { router } from "expo-router";
import { PROFILE_PIC_ROOT } from "@/constants/paths";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { IListing } from "../../../types/listing";
import AuthDialog from "../../auth/AuthDialog";
import { selectCurrentToken } from "../../auth/authSlice";
import { usePostMessageMutation } from "../../chat/chatApiSlice";

type SendMessageProps = {
  open: boolean;
  handleClose: () => void;
  listing: IListing;
};

const SendMessage = ({ open, handleClose, listing }: SendMessageProps) => {
  const dispatch = useAppDispatch();

  const token = useAppSelector(selectCurrentToken);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  //dialogs
  const [openAuthD, setOpenAuthD] = useState(false);
  const handleToggleAuthD = () => setOpenAuthD((prev) => !prev);

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
    formData.append("recipient", listing.user._id!);
    await postMessage(formData);
  };

  //auth & retry
  useEffect(() => {
    if (token && isAuthenticated) {
      handleToggleAuthD();
      handleSubmit(onSubmit)();
    }
  }, [token, isAuthenticated]);

  //feedback
  useEffect(() => {
    if (isError) Toast.show({ type: "error", text1: error as string });

    if (isSuccess) Toast.show({ type: "success", text1: data?.message });

    const timerId = setTimeout(() => {
      if (isSuccess) handleClose();
    }, 2000);

    return () => clearTimeout(timerId);
  }, [isError, isSuccess]);

  return (
    <View>
      {openAuthD && (
        <AuthDialog
          open={openAuthD}
          handleClose={handleToggleAuthD}
          setIsAuthenticated={setIsAuthenticated}
        />
      )}

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
              <Text className="text-lg">Fill the form below</Text>
              <EvilIcons name="close" size={24} onPress={handleClose} />
            </View>

            <View className="p-5 pb-8">
              <Text className="pb-2">
                You will be able to view agent replies under inbox
              </Text>

              <Controller
                name="message"
                control={control}
                rules={{
                  required: "Message is required",
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    multiline //=boolean//whether the input can have multiple lines.
                    numberOfLines={5}
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

              <HelperText
                type="error"
                visible={Boolean(errors.message?.message)}
              >
                {errors.message?.message}
              </HelperText>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              mode="contained"
              disabled={isLoading}
              loading={isLoading}
              onPress={!token ? handleToggleAuthD : handleSubmit(onSubmit)}
            >
              Send Message
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default SendMessage;
