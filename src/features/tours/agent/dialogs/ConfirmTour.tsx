import { View, Text, Pressable, Share, Alert, FlatList } from "react-native";
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
import { useCancelTourMutation, useConfirmTourMutation } from "../tourApiSlice";
import { Controller, useForm } from "react-hook-form";
import { format } from "date-fns";
import clsx from "clsx";

type ConfirmTourProps = {
  open: boolean;
  handleClose: () => void;
  tour: ITour;
};

const ConfirmTour = ({ open, handleClose, tour }: ConfirmTourProps) => {
  const [confirmTour, { isLoading, isSuccess, isError, error, data }] =
    useConfirmTourMutation();

  const [tourDate, setTourDate] = useState<Date | null>(null);

  const handlePickDate = (date: Date) => {
    setTourDate(date);
  };

  const handleSubmit = async () => {
    await confirmTour({ id: tour._id, tourDate: tourDate! });
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
            <Text className="text-lg">Pick a date for the tour</Text>
            <EvilIcons name="close" size={24} onPress={handleClose} />
          </View>

          <View className="p-5 pb-8">
            <Text className="mb-3">
              If you are not available on any of the dates given below, you can
              send a message to the client asking them to reschedule to a later
              date.
            </Text>

            <FlatList
              horizontal
              data={tour.tourDates || []}
              //showsHorizontalScrollIndicator={}
              // ListHeaderComponent={<View></View>}
              renderItem={({ item, index }: { item: Date; index: number }) => (
                <View className="py-4 px-1 ">
                <Card
                  mode="outlined"
                  //className="mx-1"
                  onPress={() => handlePickDate(new Date(item))}
                  style={{
                    backgroundColor:
                      tourDate?.getTime() === new Date(item).getTime()
                        ? "#000"
                        : "#fff",
                  }}
                >
                  <Card.Title
                    title={
                      <Text
                        className={clsx({
                          "text-white":
                            tourDate?.getTime() === new Date(item).getTime(),
                        }, "text-lg")}
                      >
                        {format(new Date(item), "dd MMM")}
                      </Text>
                    }
                    subtitle={
                      <Text
                        className={clsx({
                          "text-white":
                            tourDate?.getTime() === new Date(item).getTime(),
                        })}
                      >
                        {format(new Date(item), "hh:mm a")}
                      </Text>
                    }
                  />
                </Card>
                </View>
              )}
              keyExtractor={(item, index) => String(index)}
              // ListFooterComponent={<View></View>}
            />
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            mode="contained"
            disabled={isLoading || !tourDate}
            loading={isLoading}
            onPress={handleSubmit}
          >
            Confirm Tour
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default ConfirmTour;
