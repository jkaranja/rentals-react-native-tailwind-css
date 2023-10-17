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
  List,
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
import {
  useCancelTourMutation,
  useRescheduleTourMutation,
} from "../tourApiSlice";
import { Controller, useForm } from "react-hook-form";
import DatePicker from "@/components/DatePicker";

type RescheduleTourProps = {
  open: boolean;
  handleClose: () => void;
  tour: ITour;
};

const RescheduleTour = ({ open, handleClose, tour }: RescheduleTourProps) => {
  const [datesPicked, setDatesPicked] = useState<Date[]>([]);

  const handleDateClick = (date: Date) => {
    if (datesPicked.includes(date))
      return setDatesPicked((prev) => prev.filter((elem) => elem !== date));

    return setDatesPicked((prev) => [...prev, date]);
  };

  const [rescheduleTour, { isLoading, isSuccess, isError, error, data }] =
    useRescheduleTourMutation();

  const [tourDate, setTourDate] = useState(new Date());

  const [showMore, setShowMore] = useState(false);

  const handleShowToggle = () => {
    setShowMore((prev) => !prev);
  };

  const handlePickDate = (date: Date) => {
    setTourDate(date);
  };

  const handleSubmit = async () => {
    await rescheduleTour({ id: tour._id, tourDates: datesPicked });
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
            <Text className="text-lg">Reschedule the tour</Text>
            <EvilIcons name="close" size={24} onPress={handleClose} />
          </View>

          <View className="p-5 pb-8">
            <Text className="mb-3">
              Please pick the date or multiple dates that you would wish to
              reschedule the tour to.
            </Text>

            <Text className="mb-3">
              The client will be abe to pick a date from the ones you suggest
              below.
            </Text>

            <List.Item
              title="Pick a few dates below"
              left={(props) => (
                <List.Icon {...props} icon="calendar-multiselect" />
              )}
            />

            <DatePicker
              datesPicked={datesPicked}
              handleDateClick={handleDateClick}
            />
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            mode="contained"
            disabled={isLoading || !datesPicked.length}
            loading={isLoading}
            onPress={handleSubmit}
          >
            Reschedule Tour
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default RescheduleTour;
