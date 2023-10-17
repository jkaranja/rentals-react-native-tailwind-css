import "expo-dev-client"; //or better err reporting
import store from "@/redux/store";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

import { useFonts } from "expo-font";
import { SplashScreen, Stack, router } from "expo-router";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { Provider } from "react-redux";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import Toast from "react-native-toast-message";
import { PaperProvider, MD3LightTheme, Button } from "react-native-paper";
import useNotificationSetup from "@/hooks/useNotificationSetup";
import usePersistAuth from "@/hooks/usePersistAuth";
import colors from "@/constants/colors";
import useNeedUpdate from "@/hooks/useNeedUpdate";

import { navThemeSettings, paperThemeSettings } from "@/config/themes";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

//The default behavior is to hide the splash screen when the first route is rendered
//with preventAutoHideAsync is called, then the splash screen will remain visible until the SplashScreen.hideAsync() function has been invoked
SplashScreen.preventAutoHideAsync();


//PS: screens are never unmounted in RN once they mount

export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootLayoutNav />
    </Provider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  const paperTheme = paperThemeSettings();
  const navTheme = navThemeSettings();

  //check for updates and force user to update app
  const { isChecking, isUpdateAvailable, result } = useNeedUpdate();

  //handle notifications
  useNotificationSetup();

  //load token from secure store to redux store
  usePersistAuth();

  //show update app or continue to app
  useEffect(() => {
    // has finished checking and no update
    if (!isChecking && !isUpdateAvailable) {
      SplashScreen.hideAsync();
    } else if (!isChecking && isUpdateAvailable) {
      SplashScreen.hideAsync();
      //we have a new version, show update modal
      router.push({ pathname: "/(tabs)/auth/update-app", params: result! });
    }
  }, [isChecking, isUpdateAvailable]);

  //prevent app from loading when checking
  if (isChecking) {
    return null;
  }

  return (
    <ThemeProvider value={navTheme}>
      <BottomSheetModalProvider>
        <PaperProvider theme={paperTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </PaperProvider>
      </BottomSheetModalProvider>

      <Toast
        //position="bottom" //top or bottom//default: top
        bottomOffset={20} //Offset from the bottom of the screen (in px)
        //visibilityTime={4000}//default = 4000ms
        //autoHide={true}//default: true
        //type="success|| error || info"//default: success
      />
    </ThemeProvider>
  );
}
