import { View, Text } from "react-native";
import React from "react";
import { Slot, Stack } from "expo-router";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectCurrentToken } from "@/features/auth/authSlice";

const _layout = () => {
  const token = useAppSelector(selectCurrentToken);

  return (
    token && (
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Inbox",
            // headerStyle: {
            //   //style object that will be applied to the View that wraps the header
            //   backgroundColor: "#fff",
            // },
            // headerTitleStyle: {
            //   //style properties for the title
            //   color: colors.gray.darker,
            // },
          }}
        />

        <Stack.Screen
          name="chat"
          options={{ title: "Gifted chat", headerShown: false }}
        />
      </Stack>
    )
  );

};

export default _layout;
