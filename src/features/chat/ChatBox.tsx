import { useCallback, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { Avatar, Button, List } from "react-native-paper";
import Toast from "react-native-toast-message";

import { PROFILE_PIC_ROOT } from "@/constants/paths";
import { FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useClearInboxMutation } from "../notifications/notificationsApiSlice";
import { useGetMessagesQuery, usePostMessageMutation } from "./chatApiSlice";

const ChatBox = () => {
  const params = useLocalSearchParams<{ recipient: string; chat: string }>();

  const recipient = JSON.parse(params.recipient);

  const insets = useSafeAreaInsets();

  const chat = JSON.parse(params.chat);

  /* ----------------------------------------
   PAGINATION
   ----------------------------------------*/
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  const [messagesList, setMessagesList] = useState<IMessage[]>([]);

  /* -------------------------------------------------------------
    NOTIFICATIONS
   ----------------------------------------------------------------*/
  const [clearInbox, { isLoading: isClearing }] = useClearInboxMutation();

  /* -------------------------------------------------------------
   POST MESSAGE
   ----------------------------------------------------------------*/
  const [postMessage, { data, error, isLoading, isSuccess, isError }] =
    usePostMessageMutation();

  /* -------------------------------------------------------------
   DEL MESSAGE
   ----------------------------------------------------------------*/
  // const [deleteMessage, { data, isSuccess, isError, error, isLoading }] =
  //   useDeleteMessageMutation();

  /* -------------------------------------------------------------
   FETCH MESSAGES
   ----------------------------------------------------------------*/
  const { currentData: messagesData, isFetching } = useGetMessagesQuery(
    { itemsPerPage, page, id: chat._id },
    {
      skip: !chat,
      //pollingInterval: 1000,
      // refetchOnFocus: true,
      refetchOnMountOrArgChange: 50, //refetch if 5o secs have passed since last refresh
    }
  );

  useEffect(() => {
    setMessagesList((prev) => {
      //make sure no duplicate data
      const currentList = prev.map((item) => item._id);

      const newData =
        messagesData?.messages?.filter(
          (item) => !currentList.includes(item._id)
        ) ?? [];

      //format fetched messages properly
      const fetchedMessages = newData.map((message) => {
        return {
          _id: message._id,
          text: message.content,
          createdAt: new Date(message.createdAt),
          sent: true,
          // received: message.isRead,
          user: {
            _id: message.sender?._id,
            name: message.sender?.username,
            avatar: `${PROFILE_PIC_ROOT}/${message.sender?.profile?.profilePic?.filename}`,
          },
        } as IMessage;
      });

      return [...fetchedMessages, ...prev];
    });
  }, [messagesData]);

  //onSend will be called with all th messages arg->current one is in 0 index
  const onSend = useCallback(async (messages: IMessage[] = []) => {
    // setMessages((previousMessages) =>
    //   GiftedChat.append(previousMessages, messages)
    // );
    //our new message
    const { _id, createdAt, text, user } = messages[0];
    //save message to db

    //append chat files
    //Important: don't forget to check if file type in files is correct(eg format image/jpeg)//else Network error or nothing or multer will return files a stringified array
    //  chatFiles.forEach((img, i) => {
    //    formData.append("files", img as any); //if value is not a string | Blob/File, it will be converted to string
    //  });
    const formData = new FormData();

    formData.append("content", text);

    formData.append("recipient", recipient._id!);

    await postMessage(formData);
  }, []);

  /* -------------------------------------------------------------
   HANDLE LOAD EARLIER
   ----------------------------------------------------------------*/
  const loadEarlier = useCallback(() => {
    //prevent accidental re-fire/refetch if current page returned no records or is currently fetching
    if (isError || isFetching) return;
    setPage((prev) => prev + 1);
  }, [isError, isFetching]);

  //clear notification for current chat
  // useEffect(() => {
  //   if (chat) clearInbox(chat._id);
  // }, [chat]);

  //feedback
  useEffect(() => {
    if (isError) Toast.show({ type: "error", text1: error as string });

    //on success
    if (isSuccess)
      Toast.show({
        type: "success", // error || info
        text1: data?.message,
      });
  }, [isError, isSuccess, data]);

  return (
    <View className=" flex-1" style={{  paddingTop: insets.top }}>
      <List.Item
        className="border-b border-gray-light "
        style={{ paddingLeft: 15 }}
        //descriptionStyle={{}}
        // descriptionNumberOfLines={2} //default 2
        // onPress={() => {}}
        titleStyle={{ color: "#000" }}
        title={<Text className="text-gray">{recipient?.username}</Text>}
        left={() => (
          <Avatar.Icon
            size={40}
            icon={({ size, color }) => {
              size = size + 20;
              return recipient.profile?.profilePic ? (
                <Image
                  source={`${PROFILE_PIC_ROOT}/${recipient.profile.profilePic?.filename}`}
                  className="rounded-full"
                  style={{ width: size, height: size }}
                />
              ) : (
                <FontAwesome name="user-o" size={20} color="black" />
              );
            }}
            color="#10b981"
            style={{ backgroundColor: "#e2e8f0" }}
          />
        )}
        right={() => (
          <Button
            onPress={() => router.push("/(tabs)/inbox/")}
            className="rounded-md bg-gray-dark"
            icon="exit-to-app"
            mode="outlined"
            textColor="#fff"
            compact
            // onPress={() => handleSnapPress(filter)}
            //uppercase //boolean//Make the label text uppercased
            labelStyle={
              {
                fontSize: 13,
                marginVertical: 8,
              }
            } //Style for the button text.
            //style={{ width: "100%" }}
          >
            Exit
          </Button>
        )}
      />

      <GiftedChat
        messages={messagesList}
        onSend={onSend}
        // user={{
        //   _id: `${user?._id || Math.random() * 15}`, //can get userId from token->jwt-decode->_id
        //   name: user?.username || "Guest",
        //   avatar: `${PROFILE_PIC_ROOT}/${user?.profilePic?.filename}`,
        // }}
        messagesContainerStyle={{ backgroundColor: "#f7f4f2" }}
        isTyping // (Bool) - Typing Indicator state; default false
        //alwaysShowSend (Bool) - Always show send button in input text composer; default false, show only when text input is not empty
        //renderTicks (Function(message)) - Custom ticks indicator to display message status
        //bottomOffset={100} //(Integer) - Distance of the chat from the bottom of the screen (e.g. useful if you display a tab bar)
        scrollToBottom // (Bool) - Enables the scroll to bottom Component (Default is false)
        showUserAvatar // (Bool) - Whether to render an avatar for the current user; default is false, only show avatars for other users
        onLoadEarlier={loadEarlier} //(Function) - Callback when loading earlier messages
        isLoadingEarlier={isFetching} // (Bool) - Display an ActivityIndicator when loading earlier messages
        loadEarlier //(Bool) - Enables the "load earlier messages" button, required for infiniteScroll
        infiniteScroll //(Bool) - infinite scroll up when reach the top of messages container, automatically call onLoadEarlier function if exist (not yet supported for the web). You need to add loadEarlier prop too.
      />
    </View>
  );
};

export default ChatBox;
