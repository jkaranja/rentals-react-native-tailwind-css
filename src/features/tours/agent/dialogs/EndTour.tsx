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
  SegmentedButtons,
  TextInput,
} from "react-native-paper";
import {
  EvilIcons,
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { IMAGE_ROOT, PROFILE_PIC_ROOT } from "@/constants/paths";
import { ITour } from "@/types/tour";

import ViewLive from "@/features/listings/view/ViewLive";

import { Image } from "expo-image";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useCancelTourMutation, useEndTourMutation } from "../tourApiSlice";
import { Controller, useForm } from "react-hook-form";
import colors from "@/constants/colors";

type ViewListingProps = {
  open: boolean;
  handleClose: () => void;
  tour: ITour;
};

const EndTour = ({ open, handleClose, tour }: ViewListingProps) => {
  const [endTour, { isLoading, isSuccess, isError, error, data }] =
    useEndTourMutation();

  type Inputs = {
    comment: string;
    rating: number;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetForm,
    watch,
    control,
    getValues,
  } = useForm<Inputs>();

  const onSubmit = async (inputs: Inputs) => {
    await endTour({ id: tour._id });
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
            <Text className="text-lg">Tour completed</Text>
            <EvilIcons name="close" size={24} onPress={handleClose} />
          </View>

          <View className="p-5 pb-8">
            <Text className="mb-3">
              We recommend asking clients to end tour on their ends so they can
              leave a review and rating of your service.
            </Text>

            <Text className="mb-3">
              This will help you gain trust from users when they view your
              profile and consequently get more tour requests.
            </Text>

            <Text className="mb-3">
              However, if that is not possible, you can go ahead and end the
              tour.
            </Text>
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            mode="contained"
            disabled={isLoading}
            loading={isLoading}
            onPress={handleSubmit(onSubmit)}
          >
            End Tour
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default EndTour;
