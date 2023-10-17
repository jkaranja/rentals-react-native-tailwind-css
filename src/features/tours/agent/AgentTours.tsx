import SwipeableViews from "@/components/SwipeableViews";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";

import { IListing } from "@/types/listing";
import formatListingDate from "@/utils/formatListingDate";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { FlatList, Pressable, Text, View, ScrollView } from "react-native";
import {
  Badge,
  Button,
  IconButton,
  RadioButton,
  SegmentedButtons,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  selectCurrentRole,
  selectCurrentToken,
  setRole,
} from "@/features/auth/authSlice";

import BedroomsBar from "@/components/BedroomsBar";
import BottomSheet from "@/components/BottomSheet";
import {
  INotificationResult,
  useClearToursMutation,
} from "@/features/notifications/notificationsApiSlice";
import { ITour, TourStatus } from "@/types/tour";

import { Role } from "@/types/user";
import { AntDesign } from "@expo/vector-icons";
import UpcomingItem from "./UpcomingItem";
import UnconfirmedItem from "./UnconfirmedItem";
import RescheduledItem from "./RescheduledItem";
import CompletedItem from "./CompletedItem";
import colors from "@/constants/colors";
import { useGetAgentToursQuery } from "./tourApiSlice";

const STATUS = ["Upcoming", "Unconfirmed", "Rescheduled", "Completed"];

type AgentToursProps = {
  notifications: INotificationResult;
};

const AgentTours = ({ notifications }: AgentToursProps) => {
  const [status, setStatus] = useState("Upcoming");

  const role = useAppSelector(selectCurrentRole);
  const listRef = useRef<FlatList>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const dispatch = useAppDispatch();

  const [toursData, setToursData] = useState<ITour[]>([]);

  /* ----------------------------------------
   PAGINATION
   ----------------------------------------*/
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(9);

  const [clearTours, { isLoading: isClearing }] = useClearToursMutation();

  /* -------------------------------------------------------------
   FETCH TOURS
   ----------------------------------------------------------------*/
  const {
    currentData: data, //The latest returned result for the current hook arg, if present. 
    //data////The latest returned result regardless of hook arg, if present.
    isFetching,
    isSuccess,
    isError,
    error,
    refetch,
    isLoading,
  } = useGetAgentToursQuery(
    { itemsPerPage, page, filters: { status } },
    {
      // pollingInterval: 1000 * 5,
      // refetchOnFocus: true,
      //last fetched time > 10 secs, refetch//use true |10
      refetchOnMountOrArgChange: true,
    }
  );

 useEffect(() => {
   //if filter change, req fires and status is isFetching. Then page state is reset to 1 while isFetching is still true
   //this will clear between both requests(due to page change and filter)
   //( req fires->isFetching) clear current items
   if (page === 1 && isFetching) {
     setToursData([]);
     return; // EffectCallback | void
   }
   // //if filters change(page is reset to 1) and there are matches, set items = returned data
   if (page === 1 && data) {
     setToursData(data.tours);
     return;
   }

   //already in page one and load more fires(page += 1), page >= 2, append new items (or nothing) to current list
   setToursData((prev) => [...prev, ...(data?.tours || [])]);
 }, [data, isFetching]);

 /* ---------------------------------  /*----------------------------
   when filters change, reset page
   ----------------------------------------------------------------*/
 useEffect(() => {
   //reset page to 1 when filters change
   //filters change will trigger a refetch but another one will fire when page changes to show data in page 1
   //This is important since current page could be 10 but records matching filters only has records in page 1 so returned results will be 0
   setPage(1);
 }, [status]);

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
    setStatus("Upcoming");
  };

  /**------------------------------
   * Handle ROLE SWITCH
   -------------------------------------*/
  const handleRoleSwitch = () => {
    dispatch(setRole(role === Role.Agent ? Role.Renter : Role.Agent));
  };
  /* ----------------------------------------
   CLEAR NOTIFICATIONS PER STATUS
   ----------------------------------------*/
  useEffect(() => {
    if (!status) return;

    //as agent, notifications are only Unconfirmed & rescheduled
    //will only show these notifications
    if (status === "Unconfirmed") {
      clearTours({ tourStatus: status });
    }

    if (status === "Rescheduled") {
      clearTours({ tourStatus: status });
    }
  }, [status]);

  //count notifications
  const notification = useMemo(() => {
    return notifications?.tours?.reduce(
      (acc, current) => {
        if (current.tourStatus === TourStatus.Unconfirmed) {
          acc.unconfirmed += 1;
        }
        if (current.tourStatus === TourStatus.Rescheduled) {
          acc.rescheduled += 1;
        }
        return acc;
      },
      { unconfirmed: 0, rescheduled: 0 }
    );
  }, [notifications]);

  return (
    <View className="flex-1 p-3">
      <View className="my-3">
        <RadioButton.Group onValueChange={handleRoleSwitch} value={role}>
          <View className="flex-row justify-between ">
            <View className="flex-row items-center">
              <RadioButton
                //disabled
                //uncheckedColor
                //color//Custom color for radio.
                // status={checked === "first" ? "checked" : "unchecked"}
                // onPress={() => setChecked("first")}
                value={Role.Renter}
              />
              <Text>My tours as a renter</Text>
            </View>
            <View className="flex-row items-center">
              <RadioButton value={Role.Agent} />
              <Text>My tours as an agent</Text>
            </View>
          </View>
        </RadioButton.Group>
      </View>

      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <SegmentedButtons
            //style
            value={status}
            onValueChange={(value) => setStatus(value)}
            buttons={STATUS.map((value) => ({
              value,
              label: value,
              checkedColor: "#fff",
              style: {
                backgroundColor:
                  value === status ? colors.emerald.DEFAULT : "#fff",
              },
              icon: ({ size, color }) => (
                <Badge
                  size={20}
                  visible={
                    value === TourStatus.Unconfirmed
                      ? !!notification?.unconfirmed
                      : value === TourStatus.Rescheduled
                      ? !!notification?.rescheduled
                      : false
                  }
                  style={{}}
                >
                  {value === TourStatus.Unconfirmed
                    ? notification?.unconfirmed
                    : value === TourStatus.Rescheduled
                    ? notification?.rescheduled
                    : 0}
                </Badge>
              ),
            }))}
          />
        </ScrollView>
      </View>

      {!!toursData.length && (
        <View className="mt-3">
          <Text className="text-gray-muted">
            {status === TourStatus.Upcoming &&
              "Tour requests confirmed. Below are your upcoming tours"}
            {status === TourStatus.Unconfirmed &&
              "Please confirm tour requests below"}
            {status === TourStatus.Rescheduled &&
              "Please confirm the rescheduled tours below"}
            {status === TourStatus.Completed &&
              "Good job on completing the tours below"}
          </Text>
        </View>
      )}

      <View className="py-4">
        <Text>{!!toursData.length && `${toursData.length} results`}</Text>
      </View>

      {!toursData.length && !isFetching && (
        <View className="gap-y-4 py-10 items-center">
          <AntDesign name="exclamationcircleo" size={44} color="black" />

          <Text>No tours found</Text>

          <Text>
            When you receive tour requests for your listings, they will appear
            here.
          </Text>

          <Text>
            You can reset active filters or switch roles in case tours aren't
            showing
          </Text>

          <View className="flex-row gap-x-3">
            <Button mode="outlined" onPress={handleResetFilters}>
              Reset filters
            </Button>
            <Button mode="outlined" onPress={handleRoleSwitch}>
              Switch to {role === Role.Agent ? Role.Renter : Role.Agent}
            </Button>
          </View>
        </View>
      )}

      <FlatList
        ref={listRef}
        onScroll={handleScroll} //Fires at most once per frame during scrolling.
        keyboardShouldPersistTaps={"handled"} //important for locationPicker else onPress gets no results//the keyboard will not dismiss automatically when the tap was handled by children
        //KeyboardAwareFlatList->handles keyboard appearance and automatically scrolls to focused TextInput->others KeyboardAwareSectionList | KeyboardAwareScrollView
        data={toursData}
        onRefresh={refetch} // standard RefreshControl will be added for "Pull to Refresh" functionality.
        refreshing={isFetching}
        showsVerticalScrollIndicator={false}
        initialNumToRender={9}
        onEndReached={loadMore} //update current page/fetch more//infinite scrolling
        // onEndReachedThreshold represents the number of screen lengths you should be from the bottom before it fires the event.
        // Thus, a value of 0.5 will trigger onEndReached when the end of the content is within half the screen/ visible length of the list.
        onEndReachedThreshold={2} //default 2//trigger after 2 screens
        ListHeaderComponent={<View></View>}
        renderItem={({ item }: { item: ITour }) => (
          <View>
            {status === TourStatus.Upcoming && (
              <UpcomingItem status={status} tour={item} />
            )}
            {status === TourStatus.Unconfirmed && (
              <UnconfirmedItem status={status} tour={item} />
            )}
            {status === TourStatus.Rescheduled && (
              <RescheduledItem status={status} tour={item} />
            )}
            {status === TourStatus.Completed && (
              <CompletedItem status={status} tour={item} />
            )}
          </View>
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

export default AgentTours;
