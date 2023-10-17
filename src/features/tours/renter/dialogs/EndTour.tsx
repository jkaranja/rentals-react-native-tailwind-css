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
  const dispatch = useAppDispatch();

  const [endTour, { isLoading, isSuccess, isError, error, data }] =
    useEndTourMutation();

  const [hover, setHover] = useState(-1);

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
    await endTour({ id: tour._id, ...inputs });
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
          {" "}
        </Dialog.Title>
        <Dialog.Content className="rounded-xl  p-0 ">
          <View className="flex-row justify-between text-right items-center  p-4">
            <Text className="text-lg">Rate guide and end tour</Text>
            <EvilIcons name="close" size={24} onPress={handleClose} />
          </View>

          <View className="p-5 pb-8">
            <Text className="mb-3">
              Please leave a comment and a rating for the tour guide. This will
              help others when choosing tour guides.
            </Text>

            <Text className="mb-3">Rate tour guide </Text>

            {watch("rating") && (
              <Text className="text-gray-dark font-medium mx-3">
                ({watch("rating")})
              </Text>
            )}

            <Controller
              name="rating"
              control={control}
              rules={{
                required: "Rating is required",
              }}
              render={({ field: { value, onChange, ...field } }) => (
                <View className="flex-row items-center">
                  {[...Array(5)].map((_, i) => (
                    <IconButton
                      icon={watch("rating") === i + 1 ? "star" : "star-outline"}
                      iconColor={
                        watch("rating") === i + 1
                          ? colors.orange.DEFAULT
                          : colors.gray.dark
                      }
                      size={20}
                      onPress={() => onChange(i + 1)}
                    />
                  ))}
                </View>
              )}
            />

            <HelperText type="error" visible={Boolean(errors.comment?.message)}>
              {errors.rating?.message}
            </HelperText>

            <Text className="mb-3">How was the tour guide?</Text>

            <Controller
              name="comment"
              control={control}
              rules={{
                required: "Comment is required",
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
            End Tour
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default EndTour;
