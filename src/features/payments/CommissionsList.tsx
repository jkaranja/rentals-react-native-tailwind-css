import {
  ActivityIndicator,
  Avatar,
  Button,
  Divider,
  HelperText,
  IconButton,
  TextInput,
  Dialog,
  Portal,
  List,
  Chip,
} from "react-native-paper";
import {
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  Pressable,
  FlatList,
} from "react-native";
import useDebounce from "../../hooks/useDebounce";
import {
  IActivity,
  ICommission,
  useGetActivitiesQuery,
  useGetCommissionsQuery,
} from "./paymentApiSlice";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import colors from "@/constants/colors";
import { format } from "date-fns";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { Link } from "expo-router";
import { PROFILE_PIC_ROOT } from "@/constants/paths";
import { Image } from "expo-image";
import PayNow from "./PayNow";

const CommissionsList = () => {
  const [commissionList, setCommissionList] = useState<ICommission[]>([]);
  const listRef = useRef<FlatList>(null);

  const [scrollPosition, setScrollPosition] = useState(0);
  //dialogs
  const [openPayD, setOpenPayD] = useState(false);
  const handleTogglePayD = () => setOpenPayD((prev) => !prev);

  /* ----------------------------------------
   PAGINATION
   ----------------------------------------*/
  //const currentPage = searchParams.get("page") || 1; //for mui render//changes on url change
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const {
    currentData: data,
    isFetching,
    isSuccess,
    isError,
    error,
    refetch,
  } = useGetCommissionsQuery(
    { itemsPerPage, page },
    {
      pollingInterval: 60000 * 5, //in ms//fire every 5 mins
      // refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    //if filter change, req fires and status is isFetching. Then page state is reset to 1 while isFetching is still true
    //this will clear between both requests(due to page change and filter)
    //( req fires->isFetching) clear current items
    if (page === 1 && isFetching) {
      setCommissionList([]);
      return; // EffectCallback | void
    }
    // //if filters change(page is reset to 1) and there are matches, set items = returned data
    if (page === 1 && data) {
      setCommissionList(data.commissions);
      return;
    }

    //already in page one and load more fires(page += 1), page >= 2, append new items (or nothing) to current list
    setCommissionList((prev) => [...prev, ...(data?.commissions || [])]);
  }, [data, isFetching]);

  /* ---------------------------------  /*----------------------------
   when filters change, reset page
   ----------------------------------------------------------------*/
  //  useEffect(() => {
  //    //reset page to 1 when filters change
  //    //filters change will trigger a refetch but another one will fire when page changes to show data in page 1
  //    //This is important since current page could be 10 but records matching filters only has records in page 1 so returned results will be 0
  //    setPage(1);
  //  }, [status]);

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
    <View className="p-4">
      {openPayD && data?.balance && (
        <PayNow
          open={openPayD}
          handleClose={handleTogglePayD}
          balance={data.balance}
        />
      )}
      <View
        className="bg-gray-dull p-2 mb-3 rounded-md"
        style={{ elevation: 2 }}
      >
        <Text>
          As an agent offering rental services, you're required to pay a
          commission of Ksh 100 for every successful tour. This fee should be
          included in your tour fee. Please pay any balance below to avoid
          account deactivation.
        </Text>
      </View>

      <View className="flex-row justify-between items-center mb-3">
        <Text> Balance: Ksh {data?.balance || 0}</Text>

        <Button
          disabled={!data?.balance}
          mode="contained"
          onPress={handleTogglePayD}
        >
          Pay balance
        </Button>
      </View>

      <View className="px-4 pb-4">
        <Text>
          {!!commissionList.length && `${commissionList.length} results`}
        </Text>
      </View>

      <FlatList
        ref={listRef}
        onScroll={handleScroll} //Fires at most once per frame during scrolling.
        onRefresh={refetch} // standard RefreshControl will be added for "Pull to Refresh" functionality.
        data={commissionList}
        refreshing={isFetching}
        showsVerticalScrollIndicator={false}
        initialNumToRender={9}
        onEndReached={loadMore} //update current page/fetch more//infinite scrolling
        onEndReachedThreshold={2}
        ListHeaderComponent={<View></View>}
        renderItem={({ item, index }: { item: ICommission; index: number }) => (
          <View key={item._id}>
            <List.Item
              //descriptionStyle={{}}
              // descriptionNumberOfLines={2} //default 2
              //onPress={() => router.push("/profile/view")}
              titleStyle={{}}
              title={
                <View className="gap-y-2">
                  <Text className="text-gray-muted">
                    {item.renter?.username}
                  </Text>
                  <Text>{item.listing?.bedrooms}</Text>
                  <View className="flex-row items-center gap-x-2">
                    <FontAwesome name="map-marker" size={15} color="black" />
                    <Text>{item.listing?.location?.description}</Text>
                  </View>
                </View>
              }
              description={
                <View className="gap-y-2">
                  <Text className="text-sm text-gray-muted">
                    Ended on:{" "}
                    {format(
                      new Date(item?.updatedAt || Date.now()),
                      "dd MMM, yyyy"
                    )}
                  </Text>
                </View>
              } // string | React.ReactNode
              left={() => (
                <Avatar.Icon
                  size={40}
                  icon={({ size, color }) => {
                    size = size + 20;
                    return item.renter?.profile?.profilePic?.filename ? (
                      <Image
                        source={`${PROFILE_PIC_ROOT}/${item.renter?.profile?.profilePic?.filename}`}
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
              right={() => <Chip className="h-8">{`Ksh ${item.amount}`}</Chip>}
            />
          </View>
        )}
        keyExtractor={(item) => item._id}
        // ListFooterComponent={<View></View>}
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

export default CommissionsList;
