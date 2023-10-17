import { useCallback, useEffect, useRef, useState } from "react";
import {
  Pressable,
  Text,
  View,
  useWindowDimensions,
  FlatList,
} from "react-native";
import { Avatar, Button, Divider, IconButton, List } from "react-native-paper";
import Toast from "react-native-toast-message";

import { useAppSelector } from "@/hooks/useAppSelector";

import { IListing } from "@/types/listing";
import { router, usePathname } from "expo-router";
import colors from "@/constants/colors";
import { Image } from "expo-image";
import { PROFILE_PIC_ROOT } from "@/constants/paths";
import { FontAwesome } from "@expo/vector-icons";
import useAuth from "@/hooks/useAuth";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { IChat, useGetChatsQuery } from "./chatApiSlice";
import { useGetNotificationsQuery } from "../notifications/notificationsApiSlice";

type ChatsListProps = {};

const ChatsList = () => {
  const dispatch = useAppDispatch();

  const [chatsList, setChatsList] = useState<IChat[]>([]);
  const listRef = useRef<FlatList>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const [_, _id] = useAuth();

  /* -------------------------------------------------------------
    NOTIFICATIONS
   ----------------------------------------------------------------*/
  const { data: notifications } = useGetNotificationsQuery(undefined, {
    pollingInterval: 60000 * 5, //in ms//fire every 5 mins
    // refetchOnFocus: true,
    refetchOnMountOrArgChange: true, //in secs
  });

  /* ----------------------------------------
   PAGINATION
   ----------------------------------------*/
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(9);

  /* -------------------------------------------------------------
   FETCH CHATS
   ----------------------------------------------------------------*/
  const { data, isFetching, isSuccess, isError, error, refetch } =
    useGetChatsQuery(
      { itemsPerPage, page },
      {
        // skip: !token,
        //pollingInterval: 15000,
        //refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
      }
    );

  useEffect(() => {
    //if filter change, req fires and status is isFetching. Then page state is reset to 1 while isFetching is still true
    //this will clear between both requests(due to page change and filter)
    //( req fires->isFetching) clear current items
    if (page === 1 && isFetching) {
      setChatsList([]);
      return; // EffectCallback | void
    }
    // //if filters change(page is reset to 1) and there are matches, set items = returned data
    if (page === 1 && data) {
      setChatsList(data.chats);
      return;
    }

    //already in page one and load more fires(page += 1), page >= 2, append new items (or nothing) to current list
    setChatsList((prev) => [...prev, ...(data?.chats || [])]);
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
    <View className=" ">
      {!chatsList.length && !isFetching && (
        <Text className="m-4 text-gray-muted">No messages</Text>
      )}

      <FlatList
        ref={listRef}
        onScroll={handleScroll} //Fires at most once per frame during scrolling.
        keyboardShouldPersistTaps={"handled"} //important for locationPicker else onPress gets no results//the keyboard will not dismiss automatically when the tap was handled by children
        //KeyboardAwareFlatList->handles keyboard appearance and automatically scrolls to focused TextInput->others KeyboardAwareSectionList | KeyboardAwareScrollView
        data={chatsList}
        onRefresh={refetch} // standard RefreshControl will be added for "Pull to Refresh" functionality.
        refreshing={isFetching}
        showsVerticalScrollIndicator={false}
        initialNumToRender={9}
        onEndReached={loadMore} //update current page/fetch more//infinite scrolling
        onEndReachedThreshold={2}
        ListHeaderComponent={<View></View>}
        renderItem={({ item: chat }: { item: IChat }) => (
          <Pressable
            key={chat._id}
            onPress={() => {
              router.push({
                pathname: "/(tabs)/inbox/chat",
                params: {
                  chat: JSON.stringify(chat),
                  recipient: JSON.stringify(
                    chat.participants.find((elem) => elem._id !== _id)!
                  ),
                },
              });
            }}
          >
            <List.Item
              className="px-4 "
              title={
                <Text className="text-lg  font-semibold dark:text-gray-light">
                  {chat.latestMessage.sender?.username}
                </Text>
              }
              description={
                chat.latestMessage.content.length > 30
                  ? `${chat.latestMessage.content.slice(0, 30)}...`
                  : chat.latestMessage.content
              }
              left={(props) => (
                <Avatar.Icon
                  size={40}
                  icon={({ size, color }) => {
                    size = size + 20;
                    return chat.latestMessage.sender?.profile?.profilePic ? (
                      <Image
                        source={`${PROFILE_PIC_ROOT}/${chat.latestMessage.sender?.profile?.profilePic?.filename}`}
                        className="rounded-full"
                        style={{ width: size, height: size }}
                      />
                    ) : (
                      <FontAwesome name="user-o" size={20} color="black" />
                    );
                  }}
                  color={colors.gray.muted}
                  style={{ backgroundColor: "#e2e8f0" }}
                />
              )}
              right={(props) => (
                <Text className="text-emerald">
                  ({" "}
                  {notifications?.inbox?.filter(
                    (mess) => mess.chat === chat._id
                  )?.length || ""}
                  )
                </Text>
              )}
            />
            <Divider />
          </Pressable>
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

export default ChatsList;
