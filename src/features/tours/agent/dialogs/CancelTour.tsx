import { View, Text, Pressable, Share, Alert } from "react-native";
import React, { useCallback } from "react";
import { IListing } from "@/types/listing";

import formatListingDate from "@/utils/formatListingDate";
import { router } from "expo-router";
import SwipeableViews from "@/components/SwipeableViews";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectCurrentToken } from "@/features/auth/authSlice";
import AuthDialog from "@/features/auth/AuthDialog";

import Toast from "react-native-toast-message";

import {
  ActivityIndicator,
  Avatar,
  Button,
  Card,
  Dialog,
  Divider,
  HelperText,
  IconButton,
  Menu,
  Portal,
  TextInput,
} from "react-native-paper";
import { EvilIcons, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { IMAGE_ROOT, PROFILE_PIC_ROOT } from "@/constants/paths";
import { ITour } from "@/types/tour";

import ViewLive from "@/features/listings/view/ViewLive";

import { Image } from "expo-image";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useCancelTourMutation } from "../tourApiSlice";
import { Controller, useForm } from "react-hook-form";

type CancelTourProps = {
  open: boolean;
  handleClose: () => void;
  tour: ITour;
};

const CancelTour = ({ open, handleClose, tour }: CancelTourProps) => {
  const [cancelTour, { isLoading, isSuccess, isError, error, data }] =
    useCancelTourMutation();

  type Inputs = {
    comment: string;
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
    await cancelTour({ ...data, id: tour._id });
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
            <Text className="text-lg">Cancel tour</Text>
            <EvilIcons name="close" size={24} onPress={handleClose} />
          </View>

          <View className="p-5 pb-8">
            <Text className="mb-3">
              We don't recommend cancelling tours unless it is really necessary.
            </Text>

            <Text className="mb-3">
              If you aren't available on the date agreed, you could send the
              client a message asking them to reschedule to a later date.
            </Text>

            <Text className="mb-3">Enter reason for cancelling the tour</Text>

            <Controller
              name="comment"
              control={control}
              rules={{
                required: "Please enter a reason",
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
                  error={Boolean(errors.comment?.message)} //Whether to style the TextInput with error style.
                  //label="Message"
                />
              )}
            />

            <HelperText type="error" visible={Boolean(errors.comment?.message)}>
              {errors.comment?.message}
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
            Cancel tour
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default CancelTour;
