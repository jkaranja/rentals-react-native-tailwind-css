import { selectCurrentToken } from "@/features/auth/authSlice";
import { useAppSelector } from "@/hooks/useAppSelector";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DefaultTheme } from "@react-navigation/native";
import { Link, Stack, Tabs, useFocusEffect, useRouter } from "expo-router";
import { Pressable, useColorScheme } from "react-native";

export default function ProfileLayout() {
  const token = useAppSelector(selectCurrentToken);

  const router = useRouter();

  useFocusEffect(() => {
    // Call the replace method to redirect to a new route without adding to the history.
    // We do this in a useFocusEffect to ensure the redirect happens every time the screen
    // is focused.
    //redirect to auth if token is not set yet//with replace, you can come back to login screen with back btn
    if (!token) {
      router.replace("/auth"); //change to replace->test later
    }
  });

  //auth
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Profile",
          // headerTitle: (props) => (
          //   <Ionicons name="menu-outline" size={24} color="black" />
          // ),
          //headerShown: false,
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
      <Stack.Screen name="view" options={{ title: "Your profile" }} />
    </Stack>
  );
}
