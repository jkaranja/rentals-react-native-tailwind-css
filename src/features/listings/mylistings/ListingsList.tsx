import SwipeableViews from "@/components/SwipeableViews";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";

import { IListing } from "@/types/listing";
import formatListingDate from "@/utils/formatListingDate";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Link, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { FlatList, Pressable, Text, View, ScrollView } from "react-native";
import { Button, IconButton, SegmentedButtons } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { selectCurrentToken } from "@/features/auth/authSlice";

import BedroomsBar from "@/components/BedroomsBar";
import BottomSheet from "@/components/BottomSheet";

import { IFavorite, useGetFavoritesQuery } from "../favorites/favoriteApiSlice";
import useAuth from "@/hooks/useAuth";
import { useGetListingsQuery } from "./listingApiSlice";
import { AccountStatus } from "@/types/user";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import colors from "@/constants/colors";
import PostNew from "./post/PostNew";
import Onboard from "@/features/onboarding/Onboard";
import ListingItem from "./ListingItem";
import usePaymentNotification from "@/hooks/usePaymentNotification";

const STATUS = ["Available", "Unavailable", "Draft"];

const BEDROOMS = [
  "",
  "Single",
  "Bedsitter",
  "1 Bedroom",
  "2 Bedrooms",
  "3 Bedrooms",
  "4+ Bedrooms",
];

const ListingsList = () => {
  const [roles, _id, accountStatus] = useAuth();
  const isExceeded = usePaymentNotification();

  const insets = useSafeAreaInsets();

  const [bedrooms, setBedrooms] = useState<string>("");

  const [scrollPosition, setScrollPosition] = useState(0);
  const listRef = useRef<FlatList>(null);
  //dialogs
  const [openPostNewD, setOpenPostNewD] = useState(false);
  const handleTogglePostNewD = () => setOpenPostNewD((prev) => !prev);
  const [openOnboardD, setOpenOnboardD] = useState(false);
  const handleToggleOnboardD = () => setOpenOnboardD((prev) => !prev);

  const [listingStatus, setListingStatus] = useState("Available");

  const dispatch = useAppDispatch();

  const [listingsData, setListingsData] = useState<IListing[]>([]);

  /* ----------------------------------------
   PAGINATION
   ----------------------------------------*/
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(9);

  /* -------------------------------------------------------------
   FETCH LISTINGS
   ----------------------------------------------------------------*/
  const {
    currentData: data, //The latest returned result regardless of hook arg, if present.
    //currentData////The latest returned result for the current hook arg, if present.
    isFetching,
    isSuccess,
    isError,
    error,
    refetch,
    isLoading,
  } = useGetListingsQuery(
    { itemsPerPage, page, filters: { bedrooms, listingStatus } },
    {
      // pollingInterval: 1000 * 5,//in ms
      // refetchOnFocus: true,
      //last fetched time > 10 secs, refetch//use true |10
      refetchOnMountOrArgChange: true, //in secs
    }
  );

  useEffect(() => {
    //if filter change, req fires and status is isFetching. Then page state is reset to 1 while isFetching is still true
    //this will clear between both requests(due to page change and filter)
    //( req fires->isFetching) clear current items
    if (page === 1 && isFetching) {
      setListingsData([]);
      return; // EffectCallback | void
    }
    // //if filters change(page is reset to 1) and there are matches, set items = returned data
    if (page === 1 && data) {
      setListingsData(data.listings);
      return;
    }

    //already in page one and load more fires(page += 1), page >= 2, append new items (or nothing) to current list
    setListingsData((prev) => [...prev, ...(data?.listings || [])]);
  }, [data, isFetching]);

  /* ---------------------------------  /*----------------------------
   when filters change, reset page
   ----------------------------------------------------------------*/
  useEffect(() => {
    //reset page to 1 when filters change
    //filters change will trigger a refetch but another one will fire when page changes to show data in page 1
    //This is important since current page could be 10 but records matching filters only has records in page 1 so returned results will be 0
    setPage(1);
  }, [listingStatus, bedrooms]);

  /* -------------------------------------------------------------
   HANDLE ON END REACHED
   ----------------------------------------------------------------*/
  const loadMore = useCallback(() => {
    //prevent accidental re-fire/refetch if current page returned no records or is currently fetching
    if (isError || isFetching) return;
    setPage((prev) => prev + 1);
  }, [isError, isFetching]);

  /* -------------------------------------------------------------
   HANDLE SCROLL TO TOP
   ----------------------------------------------------------------*/
  const scrollToTop = useCallback(() => {
    //Scroll to a specific content pixel offset in the list.
    listRef.current?.scrollToOffset({ animated: true, offset: 0 });
  }, []);

  /* -------------------------------------------------------------
   HANDLE ON SCROLL->GET POSITION
   ----------------------------------------------------------------*/
  //use this to show top btn at certain position from top of list = y
  const handleScroll = ({ nativeEvent }: { nativeEvent: any }) => {
    const scrollOffset = nativeEvent.contentOffset.y;
    setScrollPosition(scrollOffset);
  };

  /* ----------------------------------------
   RESET FILTERS
   ----------------------------------------*/
  const handleResetFilters = () => {
    setPage(1);
    setBedrooms("");
    setListingStatus("Available");
  };

  return (
    <View className="flex-1  p-4 mt-4" style={{ paddingTop: insets.top }}>
      {openOnboardD && (
        <Onboard open={openOnboardD} handleClose={handleToggleOnboardD} />
      )}

      {isExceeded && (
        <View className="flex-row bg-gray-dark p-3 rounded-md">
          <View className="flex-row">
            <Text className="text-white">
              You have exceeded the allowed outstanding balance limit. Please
              press{" "}
              <Link href="/(tabs)/settings/payments" className="text-emerald">
                here
              </Link>{" "}
              to pay the balance to continue using our services.
            </Text>
          </View>
        </View>
      )}

      {openPostNewD && (
        <PostNew open={openPostNewD} handleClose={handleTogglePostNewD} />
      )}

      {accountStatus === AccountStatus.Approved && (
        <View className="flex-row justify-end mb-3">
          <Button icon="plus" compact onPress={handleTogglePostNewD}>
            Post New
          </Button>
        </View>
      )}

      {accountStatus === AccountStatus.Approved && (
        <View className="mb-3">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <SegmentedButtons
              //style
              value={listingStatus}
              onValueChange={(value) => setListingStatus(value)}
              buttons={STATUS.map((value) => ({
                value,
                label: value === "Unavailable" ? "Not available" : value,
                checkedColor: "#fff",
                style: {
                  backgroundColor:
                    value === listingStatus ? colors.emerald.DEFAULT : "#fff",
                },
                //uncheckedColor
                //icon
                //onPress
              }))}
            />
          </ScrollView>
        </View>
      )}

      {accountStatus === AccountStatus.Approved && (
        <View className="py-4 px-3">
          <BedroomsBar bedrooms={bedrooms} setBedrooms={setBedrooms} />
        </View>
      )}

      <View className="px-4 pb-4">
        <Text>{!!listingsData.length && `${listingsData.length} results`}</Text>
      </View>

      <View className="">
        <FlatList
          ref={listRef}
          onScroll={handleScroll} //Fires at most once per frame during scrolling.
          keyboardShouldPersistTaps={"handled"} //important for locationPicker else onPress gets no results//the keyboard will not dismiss automatically when the tap was handled by children
          data={listingsData}
          onRefresh={refetch} // standard RefreshControl will be added for "Pull to Refresh" functionality.
          refreshing={isFetching}
          showsVerticalScrollIndicator={false}
          initialNumToRender={9}
          onEndReached={loadMore} //update current page/fetch more//infinite scrolling
          // onEndReachedThreshold represents the number of screen lengths you should be from the bottom before it fires the event.
          // Thus, a value of 0.5 will trigger onEndReached when the end of the content is within half the screen/ visible length of the list.
          onEndReachedThreshold={2} //default 2//trigger after 2 screens
          ListHeaderComponent={<View></View>}
          renderItem={({ item }: { item: IListing }) => (
            <ListingItem listing={item} listingStatus={listingStatus} />
          )}
          keyExtractor={(item) => item._id}
        />

        {!listingsData.length && !isFetching && (
          <View className="gap-y-4 py-10 items-center">
            {accountStatus === AccountStatus.Pending && (
              <>
                <IconButton
                  icon={({ size, color }) => (
                    <AntDesign name="plus" size={44} color="black" />
                  )}
                  // iconColor={MD3Colors.error50}
                  size={20}
                  onPress={handleToggleOnboardD}
                />

                <Text className="text-gray-muted mb-3">
                  Post rentals and earn as an agent
                </Text>

                <Text className="text-gray-muted mb-3">
                  To get started, press the button below and follow the steps
                </Text>

                <Button mode="outlined" onPress={handleToggleOnboardD}>
                  Get started
                </Button>
              </>
            )}

            {accountStatus === AccountStatus.Approved && (
              <>
                <AntDesign name="exclamationcircleo" size={44} color="black" />

                <Text className="text-gray-muted my-3">No listings found</Text>

                <Text className="text-gray-muted mb-3">
                  You can reset active filters in case listings aren't showing
                </Text>

                <Button mode="outlined" onPress={handleResetFilters}>
                  Reset filters
                </Button>
              </>
            )}
          </View>
        )}
      </View>

      {scrollPosition > 200 && (
        <IconButton
          className="bg-gray/30 absolute bottom-2 right-0"
          mode="contained-tonal"
          size={20}
          //labelStyle={{ fontSize: 30 }}
          //containerColor
          icon="chevron-up"
          iconColor="#fff"
          onPress={scrollToTop}
        />
      )}
    </View>
  );
};

export default ListingsList;
