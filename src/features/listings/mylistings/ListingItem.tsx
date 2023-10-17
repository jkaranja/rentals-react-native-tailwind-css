import { View, Text, Pressable, Share, Alert } from "react-native";
import React, { useCallback } from "react";
import { IListing } from "@/types/listing";

import {
  IFavorite,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} from "../favorites/favoriteApiSlice";
import formatListingDate from "@/utils/formatListingDate";
import { router } from "expo-router";
import SwipeableViews from "@/components/SwipeableViews";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectCurrentToken } from "@/features/auth/authSlice";
import AuthDialog from "@/features/auth/AuthDialog";
import ViewLive from "../view/ViewLive";
import Toast from "react-native-toast-message";

import {
  useDeleteListingMutation,
  useUpdateStatusMutation,
} from "./listingApiSlice";
import ViewListing from "../view/ViewListing";
import UpdateListing from "./update/UpdateListing";
import {
  ActivityIndicator,
  Button,
  Card,
  Divider,
  IconButton,
  Menu,
} from "react-native-paper";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { IMAGE_ROOT } from "@/constants/paths";

type ListingItemProps = {
  listing: IListing;
  listingStatus: string;
};

const ListingItem = ({ listing, listingStatus }: ListingItemProps) => {
  const [deleteListing, { isLoading: isDeleting }] = useDeleteListingMutation();

  const [
    updateStatus,
    { data, isLoading: isUpdating, isSuccess, isError, error },
  ] = useUpdateStatusMutation();

  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  //dialogs
  const [openViewD, setOpenViewD] = useState(false);
  const [openUpdateD, setOpenUpdateD] = useState(false);
  const handleToggleViewD = () => setOpenViewD((prev) => !prev);
  const handleToggleUpdateD = () => setOpenUpdateD((prev) => !prev);

  //status feedback
  useEffect(() => {
    if (isError) Toast.show({ type: "error", text1: error as string });

    if (isSuccess) Toast.show({ type: "success", text1: data?.message });
  }, [isError, isSuccess]);

  return (
    <View>
      {openViewD && (
        <ViewListing
          open={openViewD}
          handleClose={handleToggleViewD}
          id={listing._id}
        />
      )}

      {openUpdateD && (
        <UpdateListing
          open={openUpdateD}
          handleClose={handleToggleUpdateD}
          id={listing._id}
        />
      )}

      <Card className="mb-4 bg-white p-3  rounded-md " mode="contained">
        <Card.Cover
          source={{
            uri: `${IMAGE_ROOT}/${listing.listingImages?.[0]?.filename}`,
          }}
        />
        <Card.Title
          title={
            <Text className="text-gray-darker text-lg font-bold pt-1 ">
              {listing.bedrooms}
            </Text>
          }
          subtitle={
            <Text className="text-gray-muted text-sm">
              {listing.location?.description}
            </Text>
          }
          right={() => (
            <Menu
              visible={visible}
              onDismiss={closeMenu}
              anchor={
                <IconButton
                  icon={({ color, size }) => (
                    <MaterialIcons name="more-vert" size={24} color="black" />
                  )}
                  //iconColor={MD3Colors.error50}
                  className="bg-gray-lighter"
                  size={20}
                  onPress={openMenu}
                />
              }
              contentStyle={{ backgroundColor: "#fff" }}
            >
              <Menu.Item
                onPress={() =>
                  updateStatus({
                    id: listing._id,
                    listingStatus:
                      listingStatus === "Draft" ||
                      listingStatus === "Unavailable"
                        ? "Available"
                        : "Unavailable",
                  })
                }
                title={
                  <Text>
                    {listingStatus === "Draft" && "Publish"}
                    {listingStatus === "Available" && "Mark as unavailable"}
                    {listingStatus === "Unavailable" && "Mark as available"}
                  </Text>
                }
                trailingIcon={() =>
                  isUpdating && <ActivityIndicator size={20} color="inherit" />
                }
              />
              <Divider />

              <Menu.Item onPress={handleToggleUpdateD} title="Edit" />
              <Divider />
              <Menu.Item
                onPress={() => deleteListing(listing._id)}
                title="Delete"
                trailingIcon={() =>
                  isDeleting && <ActivityIndicator size={20} color="inherit" />
                }
              />
            </Menu>
          )}
        />
        <Card.Content>
          <View className="flex-row justify-between">
            <Text className="text-gray-darker  text-md font-medium">
              Ksh {listing.price}/mo
            </Text>
            <Text className="text-gray-muted text-sm">
              {formatListingDate(new Date(listing.updatedAt))}
            </Text>
          </View>
        </Card.Content>

        <Card.Actions>
          <Pressable onPress={handleToggleViewD}>
            <MaterialCommunityIcons name="launch" size={24} color="black" />
          </Pressable>
        </Card.Actions>
      </Card>
    </View>
  );
};

export default ListingItem;
