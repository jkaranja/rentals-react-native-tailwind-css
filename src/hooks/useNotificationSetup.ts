import { useState, useEffect, useRef } from "react";
import { Text, View, Button, Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { useAppDispatch } from "@/hooks/useAppDispatch";

import { router } from "expo-router";
import { useAppSelector } from "./useAppSelector";

import * as SecureStore from "expo-secure-store";
import { selectPushToken, setPushToken } from "@/features/notifications/notificationsSlice";
import { useSavePushTokenMutation } from "@/features/notifications/notificationsApiSlice";
import { selectCurrentToken } from "@/features/auth/authSlice";

//handle the behavior when notifications are received when your app is foregrounded,
// First, set the handler that will cause the notification
// to show the alert
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;

  //must be a device:Push notifications don't work on emulators/simulators.
  if (Device.isDevice) {
    //Calling this function checks current permissions settings related to notifications. It lets you verify whether the app is currently allowed to display alerts, play sounds, etc.
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      //Prompts the user for notification permissions according to request.
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      // alert("Failed to get push token for push notification!");
      return;
    }
    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas.projectId,
    });
    // console.log(token);
  } else {
    //  alert("Must use physical device for Push Notifications");
  }

  //Starting in Android 8.0 (API level 26), all notifications must be assigned to a channel. For each channel, you can set the visual and auditory behavior that is applied to all notifications in that channel. Then, users can change these settings and decide which notification channels from your app should be intrusive or visible at all
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      // sound: 'mySoundFile.wav', // Provide ONLY the base filename
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

const useNotificationSetup = () => {
  const [expoPushToken, setExpoPushToken] =
    useState<Notifications.ExpoPushToken>();
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  const pushToken = useAppSelector(selectPushToken);
  const token = useAppSelector(selectCurrentToken);

  const [savePushToken, { isLoading, isSuccess }] = useSavePushTokenMutation();

  const dispatch = useAppDispatch();

  //load push token from secure store to redux store
  useEffect(() => {
    const getPushToken = async () => {
      try {
        const storedPushToken = await SecureStore.getItemAsync("pushToken");
        if (!storedPushToken)
          throw new Error("Push token not found in secure store");
        //save pushToken to store
        dispatch(setPushToken(storedPushToken as any));
      } catch (e) {
        //register for push notifications->check if app has permission nd if not prompt user to allow

        registerForPushNotificationsAsync().then(async (pToken) => {
          //save token to redux store + secure store
          try {
            //save token to secure store//size limit= 2kb//you will get a warning or error is limit is reached
            await SecureStore.setItemAsync("pushToken", pToken as any);
            // save to redux store
            dispatch(setPushToken(pToken as any));
            //navigate to profile//replace->can't navigate back to this page with the back btn/hides it
          } catch (error) {
            console.log;
          }
        });
      }
    };

    //retrieve token only when we don't have it in redux store
    if (!pushToken) getPushToken();

    //These listeners allow you to add behavior when notifications are received while your app is open and foregrounded and when your app is backgrounded or closed and the user taps on the notification.

    //Listeners registered by this method will be called whenever a notification is received while the app is running.
    //User interacted with notification: false
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
        //notification type: {date: Date, request: {content: {data: {}(no shown), body: string(main content), title: string(Notification title -), sound}, identifier: string, trigger: NotificationTrigger}}
      });
    //Listeners registered by this method will be called whenever a user interacts with a notification (for example, taps on it).
    //it is triggered both when app is foregrounded or in the background(Background event listeners are not supported in Expo Go.)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        //response =  {notification: Notification; actionIdentifier: string; userText?: string;}
        //Notification type = see above
        const url = response.notification.request.content.data?.url;
        if (url) {
          //This will use Expo Router's built-in deep linking to handle incoming URLs from push notifications.
          //It opens your app using the app scheme
          router.push(url);
        }
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current!
      );
      Notifications.removeNotificationSubscription(responseListener.current!);
    };
  }, []);

  //save pushToken to db->guest + update user when-> log in/signup
  useEffect(() => {
    if (!pushToken) return;
    //save to db
    (async () => {
      await savePushToken({ pushToken: pushToken as any });
    })();
  }, [token, pushToken]);
};

export default useNotificationSetup;
