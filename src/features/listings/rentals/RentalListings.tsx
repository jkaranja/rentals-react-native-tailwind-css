import SwipeableViews from "@/components/SwipeableViews";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";

import { IListing } from "@/types/listing";
import formatListingDate from "@/utils/formatListingDate";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { FlatList, Pressable, Text, View } from "react-native";
import { Button, IconButton } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { addToFilters, resetFilters, selectSearchFilters } from "./rentalSlice";
import { selectCurrentToken } from "@/features/auth/authSlice";
import { useGetAllListingsQuery } from "./rentalApiSlice";
import SearchBar from "./SearchBar";
import BedroomsBar from "@/components/BedroomsBar";
import BottomSheet from "@/components/BottomSheet";
import Filters from "./filters/Filters";
import { IFavorite, useGetFavoritesQuery } from "../favorites/favoriteApiSlice";
import ListingItem from "./ListingItem";

const RentalListings = () => {
  const insets = useSafeAreaInsets();
  const filters = useAppSelector(selectSearchFilters);

  const token = useAppSelector(selectCurrentToken);

  const [listings, setListings] = useState<IListing[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);

  const [favorites, setFavorites] = useState<IFavorite[]>([]);

  const [bedrooms, setBedrooms] = useState<string>(filters?.bedrooms || "");

  const dispatch = useAppDispatch();

  const listRef = useRef<FlatList>(null);

  // variables//possible snap points/height of sheet can be: ["25%", "50%","95%"]
  const snapPoints = useMemo(() => ["95%"], []);

  //dialogs
  const [openFilterD, setOpenFilterD] = useState(false);
  const handleToggleFilterD = () => setOpenFilterD((prev) => !prev);

  /* ----------------------------------------
   PAGINATION
   ----------------------------------------*/
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  /* -------------------------------------------------------------
   FETCH FAVORITE->when token is valid
   ----------------------------------------------------------------*/
  const { currentData: favoriteData } = useGetFavoritesQuery(undefined, {
    skip: !token,
    // pollingInterval: 1000 * 5,//in ms
    // refetchOnFocus: true,
    //last fetched time > 10 secs, refetch//use true |10
    refetchOnMountOrArgChange: true, //in secs
  });
  useEffect(() => {
    //update the other states
    setFavorites(favoriteData?.favorites || []);
  }, [favoriteData]);

  /* -------------------------------------------------------------
   FETCH LISTINGS
   ----------------------------------------------------------------*/
  const {
    // data, //The latest returned result regardless of hook arg, if present.
    currentData: data, ////The latest returned result for the current hook arg, if present.
    isFetching,
    isSuccess,
    isError,
    error,
    refetch,
    isLoading,
  } = useGetAllListingsQuery(
    { itemsPerPage, page, filters },
    {
      // pollingInterval: 1000 * 5,
      // refetchOnFocus: true,
      //last fetched time > 10 secs, refetch//use true |10
      refetchOnMountOrArgChange: true, //if false, serve cached results if available or fetch(on mount + arg change). If true, force refetch-> refetch()
    }
  );

  useEffect(() => {
    //if filter change, req fires and status is isFetching. Then page state is reset to 1 while isFetching is still true
    //this will clear between both requests(due to page change and filter)
    //( req fires->isFetching) clear current items
    // if (page === 1 && isFetching) {
    //   setListings([]);
    //   return; // EffectCallback | void
    // }
    // //if filters change(page is reset to 1) and there are matches, set items = returned data
    if (page === 1 && data) {
      setListings(data.listings);
      return;
    }

    //already in page one and load more fires(page += 1), page >= 2, append new items (or nothing) to current list
    setListings((prev) => [...prev, ...(data?.listings || [])]);
  }, [data, isFetching]);

  /* ---------------------------------  /*----------------------------
   when filters change, reset page
   ----------------------------------------------------------------*/
  useEffect(() => {
    //reset page to 1 when filters change
    //filters change will trigger a refetch but another one will fire when page changes to show data in page 1
    //This is important since current page could be 10 but records matching filters only has records in page 1 so returned results will be 0
    setPage(1);
    setBedrooms(filters?.bedrooms || ""); //update bedrooms bar state with selected bedrooms from filter
  }, [filters]);

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
    //all values are numbers
    //     {
    //   nativeEvent: {
    //     contentInset: {bottom, left, right, top},
    //     contentOffset: {x, y},
    //     contentSize: {height, width},
    //     layoutMeasurement: {height, width},
    //     zoomScale
    //   }
    // }
    const scrollOffset = nativeEvent.contentOffset.y;
    setScrollPosition(scrollOffset);
  };

  /* -------------------------------------------------------------
   HANDLE CLEAR FILTERS
   ----------------------------------------------------------------*/
  const handleClearFilters = useCallback(() => {
    dispatch(resetFilters());
    setBedrooms("");
  }, []);

  //update bedroom filter in store
  useEffect(() => {
    dispatch(
      addToFilters({
        bedrooms,
      })
    );
  }, [bedrooms]);

  return (
    <View
      style={{ paddingTop: insets.top + 15 }}
      className="pt-4 relative  flex-1"
    >
      {/**'auto', 'inverted', 'light', 'dark' */}
      <StatusBar style="auto" backgroundColor="#fff" />

      {openFilterD && (
        <Filters
          open={openFilterD}
          handleClose={handleToggleFilterD}
          total={listings.length}
          isFetching={isFetching}
        />
      )}

      <View className="px-3">
        <SearchBar handleOpen={handleToggleFilterD} />
      </View>

      <View className="pt-4 px-3">
        <BedroomsBar bedrooms={bedrooms} setBedrooms={setBedrooms} />
      </View>

      {Object.keys(filters).length > 2 && (
        <View className="flex-row justify-between items-center px-4 py-2">
          <Text className="">Results {listings.length}</Text>
          <Pressable onPress={handleClearFilters}>
            <Text className="text-red underline">Clear filters</Text>
          </Pressable>
        </View>
      )}

      <View className="p-4  pb-[90]">
        <FlatList
          ref={listRef}
          onScroll={handleScroll} //Fires at most once per frame during scrolling.
          keyboardShouldPersistTaps={"handled"} //important for locationPicker else onPress gets no results//the keyboard will not dismiss automatically when the tap was handled by children
          //KeyboardAwareFlatList->handles keyboard appearance and automatically scrolls to focused TextInput->others KeyboardAwareSectionList | KeyboardAwareScrollView
          data={listings}
          onRefresh={refetch} // standard RefreshControl will be added for "Pull to Refresh" functionality.
          refreshing={isFetching}
          showsVerticalScrollIndicator={false}
          initialNumToRender={9} //default 10
          onEndReached={loadMore} //update current page/fetch more//infinite scrolling//param = (info: {distanceFromEnd: number})
          // onEndReachedThreshold represents the number of screen lengths you should be from the bottom before it fires the event.
          // Thus, a value of 0.5 will trigger onEndReached when the end of the content is within half the screen/ visible length of the list.
          onEndReachedThreshold={2} //default 2//trigger after 2 screens
          //onStartReached//Called once when the scroll position gets within within onStartReachedThreshold from the logical start of the list.
          //onStartReachedThreshold//How far from the start (in units of visible length of the list) the leading edge of the list must be from the start of the content to trigger the onStartReached callback.
          //Rendered in between each item, but not at the top or bottom. Type: component | JSX.Element
          //@ts-ignore//accept
          // ItemSeparatorComponent={<List.Subheader>Some title</List.Subheader>}
          ////function/component or React.ReactNode//Rendered at the top of all the items
          ListHeaderComponent={<View></View>}
          renderItem={({ item }: { item: IListing }) => (
            <ListingItem favorites={favorites!} listing={item} />
          )}
          keyExtractor={(item) => item._id}
          // ListFooterComponent={
          //   <View className="flex-row justify-center py-2">
          //     {isFetching && (
          //       <ActivityIndicator size="large" color={colors.gray.DEFAULT} />
          //     )}
          //   </View>
          // } //function/component or React.ReactNode//rendered bottom of list
        />
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

export default RentalListings;
