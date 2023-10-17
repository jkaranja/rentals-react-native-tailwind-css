import { View, Text, Linking, BackHandler, Pressable } from "react-native";
import React from "react";

import { NeedUpdateResult } from "@/hooks/useNeedUpdate";
import { Button, List, Modal, Portal } from "react-native-paper";
import { Image } from "expo-image";

import { BASE_URL } from "@/api/constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import colors from "@/constants/colors";

const UpdateApp = () => {
  const params = useLocalSearchParams<{
    latestVersion: string;
    storeUrl: string;
  }>();

  return (
    <Portal>
      <Modal
        visible={true}
        onDismiss={() => BackHandler.exitApp()}
        //dismissable //Determines whether clicking outside the dialog dismiss it.
        style={{
          justifyContent: "flex-start",
          borderRadius: 12,
          backgroundColor: "#fff",
          padding: 20,
          paddingTop: 5,
        }} //Style for the wrapper of the modal. Use this prop to change the default wrapper style or to override safe area insets with marginTop and marginBottom.
        //contentContainerStyle//Style for the content of the modal
        //dismissableBackButton //Determines whether clicking Android hardware back button dismiss dialog.
      >
        <View className=" flex-row justify-between items-center py-4 ">
          <Image
            source={require("../../../assets/images/google-play-logo.png")}
            className="h-10 w-[50%]"
            priority="high"
            //style={{ borderRadius: 10 }}
            alt="Google Play"
            contentFit="cover"
            transition={1000}
          />
          <Pressable onPress={() => BackHandler.exitApp()} className="py-3">
            <MaterialCommunityIcons
              name="close"
              size={24}
              color={colors.gray.muted}
            />
          </Pressable>
        </View>

        <Text className="text-xl font-semibold mb-3">Update available</Text>
        <Text className=" ">
          To use this app, please update to the latest version.
        </Text>

        <List.Item
          //descriptionStyle={{}}
          // descriptionNumberOfLines={2} //default 2
          //onPress={() => router.push("/profile/view")}
          titleStyle={{}}
          title={<Text className="text-lg ">Atwelia </Text>}
          description={
            <Text className="text-sm text-gray-muted ">
              Version: {params?.latestVersion || "1.0.0"}
            </Text>
          }
          left={() => (
            <Image
              source={require("../../../assets/images/icon.png")}
              className="h-10 w-[40]"
              priority="high"
              //style={{ borderRadius: 10 }}
              alt="Atwelia"
              contentFit="contain"
              transition={1000}
            />
          )}
          className="my-3"
        />

        <View className="py-4 flex-row justify-between">
          <Button
            mode="contained"
            onPress={() => Linking.openURL(params?.storeUrl)}
          >
            Update
          </Button>
          <Button
            icon="exit-to-app"
            mode="outlined"
            onPress={() => Linking.openURL(BASE_URL)}
          >
             Atwelia.com
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

export default UpdateApp;
