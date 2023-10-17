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
  Divider,
  IconButton,
  Menu,
} from "react-native-paper";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { IMAGE_ROOT, PROFILE_PIC_ROOT } from "@/constants/paths";
import { ITour } from "@/types/tour";
import RequestTour from "./dialogs/RequestTour";
import CancelTour from "./dialogs/CancelTour";
import ViewLive from "@/features/listings/view/ViewLive";
import Profile from "./dialogs/Profile";
import { Image } from "expo-image";
import colors from "@/constants/colors";

type UnconfirmedItemProps = {
  tour: ITour;
  status: string;
};

const UnconfirmedItem = ({ tour, status }: UnconfirmedItemProps) => {
  //dialogs

  const [openCancelD, setOpenCancelD] = useState(false);
  const [openViewD, setOpenViewD] = useState(false);
  const [openProfileD, setOpenProfileD] = useState(false);

  const handleToggleCancelD = () => setOpenCancelD((prev) => !prev);
  const handleToggleViewD = () => setOpenViewD((prev) => !prev);
  const handleToggleProfileD = () => setOpenProfileD((prev) => !prev);

  return (
    <View>
      {openCancelD && (
        <CancelTour
          open={openCancelD}
          handleClose={handleToggleCancelD}
          tour={tour}
        />
      )}

      {openViewD && (
        <ViewLive
          open={openViewD}
          handleClose={handleToggleViewD}
          id={tour.listing._id}
        />
      )}

      {openProfileD && (
        <Profile
          open={openProfileD}
          handleClose={handleToggleProfileD}
          tour={tour}
        />
      )}

      <Card className="mb-4 bg-white p-3  rounded-md " mode="contained">
        <Card.Title
          title={
            <Pressable onPress={handleToggleProfileD}>
              <Text className="text-gray-darker text-lg font-bold pt-1">
                {tour.agent?.username}
              </Text>
            </Pressable>
          }
          // subtitle="Card Subtitle"
          left={() => (
            <Avatar.Icon
              size={40}
              icon={({ size, color }) => {
                size = size + 20;
                return tour.agent?.profile?.profilePic?.filename ? (
                  <Image
                    source={`${PROFILE_PIC_ROOT}/${tour.agent?.profile?.profilePic?.filename}`}
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
          right={() => (
            <IconButton
              icon="phone"
              className="bg-gray/10"
              iconColor={colors.emerald.DEFAULT}
              size={20}
              onPress={handleToggleProfileD}
            />
          )}
        />
        <Card.Content>
          <Pressable onPress={handleToggleViewD}>
            <Text
              className="text-gray-darker  text-md font-medium mb-2"
              style={{ textDecorationLine: "underline" }}
            >
              {tour.listing.bedrooms}
            </Text>
          </Pressable>

          <Text className="mb-2">
            Tour fee: Ksh {tour.agent?.profile?.tourFee}
          </Text>
        </Card.Content>

        <Card.Actions>
          <Button mode="outlined" onPress={handleToggleCancelD}>
            Cancel
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
};

export default UnconfirmedItem;
