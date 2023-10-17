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

import { selectCurrentToken } from "@/features/auth/authSlice";

import BedroomsBar from "@/components/BedroomsBar";
import BottomSheet from "@/components/BottomSheet";

import { IFavorite, useGetFavoritesQuery } from "../favorites/favoriteApiSlice";
import { AntDesign } from "@expo/vector-icons";
import FavoriteItem from "./FavoriteItem";
import { useFocusEffect } from "expo-router/src/useFocusEffect";

const FavoritesList = () => {
  const dispatch = useAppDispatch();

  const [favorites, setFavorites] = useState<IFavorite[]>([]);
  const listRef = useRef<FlatList>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  /* ----------------------------------------
   PAGINATION
   ----------------------------------------*/
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  /* -------------------------------------------------------------
   FETCH FAVORITE LISTINGS
   ----------------------------------------------------------------*/
  const {
    currentData: data,
    isFetching,
    isSuccess,
    isError,
    error,
    refetch,
  } = useGetFavoritesQuery(
    { itemsPerPage, page },
    {
      //pollingInterval: 15000,
      //refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );
  //PS: screens are never unmounted in RN once they mount
  useEffect(() => {
    //if filter change, req fires and status is isFetching. Then page state is reset to 1 while isFetching is still true
    //this will clear between both requests(due to page change and filter)
    //( req fires->isFetching) clear current items
    if (page === 1 && isFetching) {
      setFavorites([]);
      return; // EffectCallback | void
    }
    // //if filters change(page is reset to 1) and there are matches, set items = returned data
    if (page === 1 && data) {
      setFavorites(data.favorites);
      return;
    }

    //already in page one and load more fires(page += 1), page >= 2, append new items (or nothing) to current list
    setFavorites((prev) => [...prev, ...(data?.favorites || [])]);
  }, [data, isFetching]);

  /* ---------------------------------  /*----------------------------
   when filters change, reset page
   ----------------------------------------------------------------*/
  // useEffect(() => {
  //   //reset page to 1 when filters change
  //   //filters change will trigger a refetch but another one will fire when page changes to show data in page 1
  //   //This is important since current page could be 10 but records matching filters only has records in page 1 so returned results will be 0
  //   setPage(1);
  // }, [status]);

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

  return (
    <View className="flex-1 p-4 relative   ">
      {!favorites.length && !isFetching && (
        <View className="gap-y-4 py-10 items-center">
          <AntDesign name="exclamationcircleo" size={44} color="black" />

          <Text>No favorites found</Text>

          <Text>
            To add items to favorites, click the heart icon when browsing
            through listings
          </Text>

          <Button mode="outlined" onPress={() => router.push("/")}>
            Browse listings
          </Button>
        </View>
      )}

      <FlatList
        ref={listRef}
        onScroll={handleScroll} //Fires at most once per frame during scrolling.
        keyboardShouldPersistTaps={"handled"} //important for locationPicker else onPress gets no results//the keyboard will not dismiss automatically when the tap was handled by children
        //KeyboardAwareFlatList->handles keyboard appearance and automatically scrolls to focused TextInput->others KeyboardAwareSectionList | KeyboardAwareScrollView
        data={favorites}
        onRefresh={refetch} // standard RefreshControl will be added for "Pull to Refresh" functionality.
        refreshing={isFetching}
        showsVerticalScrollIndicator={false}
        initialNumToRender={9}
        onEndReached={loadMore} //update current page/fetch more//infinite scrolling
        // onEndReachedThreshold represents the number of screen lengths you should be from the bottom before it fires the event.
        // Thus, a value of 0.5 will trigger onEndReached when the end of the content is within half the screen/ visible length of the list.
        onEndReachedThreshold={2} //default 2//trigger after 2 screens
        ListHeaderComponent={<View></View>}
        renderItem={({ item }: { item: IFavorite }) => (
          <FavoriteItem favorite={item} />
        )}
        keyExtractor={(item) => item._id}
      />

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

export default FavoritesList;
