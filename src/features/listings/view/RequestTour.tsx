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
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useGetListingQuery } from "./viewApiSlice";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetProfileQuery } from "@/features/auth/userApiSlice";
import { IListing } from "@/types/listing";
import SwipeableViews from "@/components/SwipeableViews";
import { router } from "expo-router";
import { PROFILE_PIC_ROOT } from "@/constants/paths";

import DatePicker from "../../../components/DatePicker";

import {
  logOut,
  selectCurrentToken,
  setCredentials,
} from "../../auth/authSlice";
import { useAppSelector } from "../../../hooks/useAppSelector";
import AuthDialog from "../../auth/AuthDialog";
import { useRequestTourMutation } from "../../tours/renter/tourApiSlice";

type ViewListingProps = {
  open: boolean;
  handleClose: () => void;
  listing: IListing;
};

const RequestTour = ({ open, handleClose, listing }: ViewListingProps) => {
  const dispatch = useAppDispatch();

  const token = useAppSelector(selectCurrentToken);

  //auth
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [datesPicked, setDatesPicked] = useState<Date[]>([]);

  //dialogs
  const [openAuthD, setOpenAuthD] = useState(false);
  const handleToggleAuthD = () => setOpenAuthD((prev) => !prev);

  const [requestTour, { isLoading, isSuccess, isError, error, data }] =
    useRequestTourMutation();

  const handleDateClick = (date: Date) => {
    if (datesPicked.includes(date))
      return setDatesPicked((prev) => prev.filter((elem) => elem !== date));

    return setDatesPicked((prev) => [...prev, date]);
  };

  const handleSubmit = async () => {
    await requestTour({
      tourDates: datesPicked,
      listing: listing._id,
    });
  };

  //auth & retry
  useEffect(() => {
    if (token && isAuthenticated) {
      handleToggleAuthD();
      handleSubmit();
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
              <Text className="text-lg"> Pick a date for the tour</Text>
              <EvilIcons name="close" size={24} onPress={handleClose} />
            </View>

            <View className="p-5 pb-8">
              <Text className="mb-2">
                Please select a few dates you are available for a tour.
              </Text>

              <Text className="mb-3">
                The agent will be abe to pick a date from the ones you suggest.
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
              onPress={!token ? handleToggleAuthD : handleSubmit}
            >
              Send request
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default RequestTour;
