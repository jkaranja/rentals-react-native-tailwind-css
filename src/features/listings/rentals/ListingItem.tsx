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

type ListingItemProps = {
  listing: IListing;
  favorites: IFavorite[];
};

const ListingItem = ({ listing, favorites }: ListingItemProps) => {
  const token = useAppSelector(selectCurrentToken);

  //auth
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  //dialogs
  const [openViewD, setOpenViewD] = useState(false);
  const [openAuthD, setOpenAuthD] = useState(false);
  const handleToggleAuthD = () => setOpenAuthD((prev) => !prev);
  const handleToggleViewD = () => setOpenViewD((prev) => !prev);

  //is listing in favorites
  const isInFavorites = () => {
    return favorites?.some((item) => item.listing?._id === listing._id);
  };

  //favorite Id of the current listing
  const extractFavoriteId = () => {
    const favorite = favorites?.find(
      (item) => item.listing?._id === listing._id
    );
    return favorite?._id;
  };

  /* -------------------------------------------------------------
   ADD TO FAVORITES
  ----------------------------------------------------------------*/
  const [addFavorite, { isLoading: isAdding }] = useAddFavoriteMutation();
  /* -------------------------------------------------------------
   REMOVE FROM FAVORITE
  ----------------------------------------------------------------*/
  const [removeFavorite, { isLoading: isRemoving }] =
    useRemoveFavoriteMutation();

  const handleFavoriteClick = () => {
    if (isInFavorites()) return removeFavorite(extractFavoriteId()!);
    return addFavorite(listing._id);
  };

  //handle share
  const handleShare = useCallback(() => {
    const bedrooms =
      listing?.bedrooms === "Single" ? "Single room" : listing?.bedrooms;
    const onShare = async () => {
      try {
        const result = await Share.share(
          {
            message: `${bedrooms}, Rent Ksh ${listing.price}, in ${listing.location?.description}. ${BASE_URL}/?id=${listing._id} `, //Message sent to the share activity
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

  //auth & retry add to favorites
  useEffect(() => {
    if (token && isAuthenticated) {
      handleToggleAuthD();
      handleFavoriteClick();
    }
  }, [token, isAuthenticated]);

  return (
    <View>
      {openViewD && (
        <ViewLive
          open={openViewD}
          handleClose={handleToggleViewD}
          id={listing._id}
        />
      )}

      {openAuthD && (
        <AuthDialog
          open={openAuthD}
          handleClose={handleToggleAuthD}
          setIsAuthenticated={setIsAuthenticated}
        />
      )}

      <Pressable
        className="mb-4 bg-white p-3  rounded-md"
        onPress={handleToggleViewD}
      >
        {/* {isAlertVisible && (
        <LoginAlert visible={isAlertVisible} handleClose={handleLoginAlert} />
      )} */}

        <SwipeableViews
          images={listing.listingImages}
          imageStyle={{ borderRadius: 4 }}
          offset={50}
          startIcon="heart"
          endIcon="share-alt"
          endIconColor="#eee"
          startIconColor={
            isAdding || isRemoving ? "gray" : isInFavorites() ? "red" : "white"
          }
          handlePress={handleToggleViewD}
          endButtonPress={handleShare}
          startButtonPress={!token ? handleToggleAuthD : handleFavoriteClick}
        />

        <View className="gap-y-1">
          <Text className="text-gray-darker text-lg font-bold pt-1">
            {listing.bedrooms}
          </Text>
          <Text className="text-gray-muted text-sm">
            {listing.location?.description}
          </Text>
          <View className="flex-row justify-between">
            <Text className="text-gray-darker  text-md font-medium">
              Ksh {listing.price}/mo
            </Text>
            <Text className="text-gray-muted text-sm">
              {formatListingDate(new Date(listing.updatedAt))}
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

export default ListingItem;
