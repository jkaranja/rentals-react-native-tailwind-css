
import { FontAwesome5 } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DefaultTheme } from "@react-navigation/native";
import { Link, Slot, Stack, Tabs } from "expo-router";
import { Pressable, useColorScheme } from "react-native";

export default function ProfileLayout() {
  return (<Slot />
    // <Stack>
    //   <Stack.Screen
    //     name="index"
    //     options={{
    //       title: "Your profile",
    //       //headerShown: false,
    //       // headerStyle: {
    //       //   //style object that will be applied to the View that wraps the header
    //       //   backgroundColor: "#fff",
    //       // },
    //       // headerTitleStyle: {
    //       //   //style properties for the title
    //       //   color: colors.gray.darker,
    //       // },
    //     }}
    //   />

    //   <Stack.Screen name="signup" options={{ title: "Create an account" }} />

    //   <Stack.Screen
    //     name="login"
    //     options={{ title: "Log in" }} //presentation: "modal"
    //   />
    //   <Stack.Screen name="contact" options={{ title: "Contact us" }} />
    //   <Stack.Screen name="privacy" options={{ title: "Privacy policy" }} />
    //   <Stack.Screen name="terms" options={{ title: "Terms of service" }} />
    // </Stack>
  );
}
