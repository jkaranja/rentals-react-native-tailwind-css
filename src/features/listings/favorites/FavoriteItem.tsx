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
import { BASE_URL } from "@/api/constants";

type FavoriteItemProps = {
  favorite: { _id: string; listing: IListing };
};

const FavoriteItem = ({ favorite }: FavoriteItemProps) => {
  const [removeFavorite, { isLoading }] = useRemoveFavoriteMutation();

  //dialogs
  const [openViewD, setOpenViewD] = useState(false);
  const handleToggleViewD = () => setOpenViewD((prev) => !prev);

  //handle share
  const handleShare = useCallback(() => {
    const bedrooms =
      favorite.listing?.bedrooms === "Single"
        ? "Single room"
        : favorite.listing?.bedrooms;
    const onShare = async () => {
      try {
        const result = await Share.share(
          {
            message: `${bedrooms}, Rent Ksh ${favorite.listing.price}, in ${favorite.listing.location?.description}. ${BASE_URL}/?id=${favorite.listing._id}  `, //Message sent to the share activity
            title: `${bedrooms} for rent`, //string	//Title sent to the share activity
          },
          { dialogTitle: "Share" }
        );
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            // shared with activity type of result.activityType eg fb
          } else {
            // shared
          }
        } else if (result.action === Share.dismissedAction) {
          // dismissed
        }
      } catch (error: any) {
        //Alert.alert(error.message);
      }
    };
    onShare();
  }, []);

  return (
    <View>
      {openViewD && (
        <ViewLive
          open={openViewD}
          handleClose={handleToggleViewD}
          id={favorite.listing?._id}
        />
      )}

      <Pressable
        className="mb-4 bg-white p-3  rounded-md"
        onPress={
          () => handleToggleViewD()
          // router.push({
          //   pathname: "/view",
          //   params: { id: favorite.listing?._id },
          // })
        }
      >
        <SwipeableViews
          images={favorite.listing?.listingImages}
          imageStyle={{ borderRadius: 4 }}
          offset={50}
          startIcon="remove"
          endIcon="share-alt"
          endIconColor="#eee"
          startIconColor={isLoading ? "gray" : "red"}
          handlePress={handleToggleViewD}
          endButtonPress={handleShare}
          startButtonPress={() => removeFavorite(favorite._id)}
        />

        <View className="gap-y-1">
          <Text className="text-gray-darker text-lg font-bold pt-1 ">
            {favorite.listing?.bedrooms}
          </Text>
          <Text className="text-gray-muted text-sm  ">
            {favorite.listing.location?.description}
          </Text>
          <Text className="text-gray-darker  text-md font-medium  ">
            Ksh {favorite.listing.price}/mo
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

export default FavoriteItem;
