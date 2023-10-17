import React from "react";
import { Pressable, Text, View } from "react-native";

import { useState } from "react";

import { PROFILE_PIC_ROOT } from "@/constants/paths";
import { ITour } from "@/types/tour";
import { FontAwesome } from "@expo/vector-icons";
import { Avatar, Button, Card, IconButton } from "react-native-paper";

import ViewListing from "@/features/listings/view/ViewListing";
import { Image } from "expo-image";
import CancelTour from "./dialogs/CancelTour";
import ConfirmTour from "./dialogs/ConfirmTour";
import Profile from "./dialogs/Profile";
import colors from "@/constants/colors";

type RescheduledItemProps = {
  tour: ITour;
  status: string;
};

const RescheduledItem = ({ tour, status }: RescheduledItemProps) => {
  //dialogs
  const [openCancelD, setOpenCancelD] = useState(false);
  const [openViewD, setOpenViewD] = useState(false);
  const [openProfileD, setOpenProfileD] = useState(false);
  const [openConfirmD, setOpenConfirmD] = useState(false);

  const handleToggleCancelD = () => setOpenCancelD((prev) => !prev);
  const handleToggleViewD = () => setOpenViewD((prev) => !prev);
  const handleToggleProfileD = () => setOpenProfileD((prev) => !prev);
  const handleToggleConfirmD = () => setOpenConfirmD((prev) => !prev);

  return (
    <View>
      {openConfirmD && (
        <ConfirmTour
          open={openConfirmD}
          handleClose={handleToggleConfirmD}
          tour={tour}
        />
      )}

      {openCancelD && (
        <CancelTour
          open={openCancelD}
          handleClose={handleToggleCancelD}
          tour={tour}
        />
      )}

      {openViewD && (
        <ViewListing
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
                {tour.renter?.username}
              </Text>
            </Pressable>
          }
          // subtitle="Card Subtitle"
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
          <Button mode="outlined" onPress={handleToggleConfirmD}>
            Confirm Tour
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
};

export default RescheduledItem;
