import { FontAwesome5 } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DefaultTheme } from "@react-navigation/native";
import { Link, Tabs, router } from "expo-router";
import { usePathname } from "expo-router";
import { Pressable, useColorScheme, View } from "react-native";
import { Button } from "react-native-paper";
import colors from "../../constants/colors";
import { selectCurrentToken } from "@/features/auth/authSlice";
import { useAppSelector } from "@/hooks/useAppSelector";
import AuthDialog from "@/features/auth/AuthDialog";
import { useEffect, useState } from "react";
import { useFocusEffect } from "expo-router/src/useFocusEffect";
import { useGetNotificationsQuery } from "@/features/notifications/notificationsApiSlice";




export default function TabLayout() {
  const pathname = usePathname();

  const token = useAppSelector(selectCurrentToken);
  //dialogs
  const [openAuthD, setOpenAuthD] = useState(false);
  //if user closes auth dialog, route to home
  const handleClose = () => {
    setOpenAuthD(false);
    router.replace("/");
  };
  //auth
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  //protected routes
  const protectedRoutes = ["/favorites", "/tours", "/inbox"];

  //if protected route and no token, ask for auth
  useFocusEffect(() => {
    if (!token && !openAuthD && protectedRoutes.includes(pathname)) {
      setOpenAuthD(true);
    }
  });

  //in case user navigates to unprotected route and auth dialog is open
  //sol: prevent dialog from being dismissable ->when open, disable clicking other tabs 
  // useFocusEffect(() => {
  //   if (openAuthD && !protectedRoutes.includes(pathname)) {
  //     setOpenAuthD(false);
  //   }
  // });

  // //auth & retry
  useEffect(() => {
    if (token && isAuthenticated) {
      setOpenAuthD(false);
      router.replace(pathname as any);
    }
  }, [token, isAuthenticated]);

  /* -------------------------------------------------------------
    NOTIFICATIONS
   ----------------------------------------------------------------*/
  const { data: notifications } = useGetNotificationsQuery(undefined, {
    pollingInterval: 60000 * 5, //in ms//fire every 5 mins
    // refetchOnFocus: true,
    refetchOnMountOrArgChange: true, //in secs
  });

  return (
    <View className="flex-1">
      {openAuthD && (
        <AuthDialog
          open={openAuthD}
          handleClose={handleClose}
          setIsAuthenticated={setIsAuthenticated}
        />
      )}

      <Tabs
        //screenOptions= {} | ()=> ({})
        screenOptions={({ route, navigation }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "(home)") {
              iconName = focused ? "home" : "home";
            } else if (route.name === "favorites") {
              iconName = focused ? "heart" : "heart";
            } else if (route.name === "inbox") {
              iconName = focused ? "comment-alt" : "comment-alt";
            } else if (route.name === "profile") {
              iconName = focused ? "user" : "user";
            } else if (route.name === "tours") {
              iconName = focused ? "calendar" : "calendar";
            }

            // You can return any component that you like here!
            return (
              <FontAwesome5
                name={iconName}
                size={18} //size
                color={focused ? colors.emerald.DEFAULT : colors.gray.DEFAULT}
              />
            );
          },
          tabBarActiveTintColor: colors.emerald.DEFAULT, //Color for the icon and label in the active tab.
          tabBarInactiveTintColor: colors.gray.DEFAULT, //Color for the icon and label in the inactive tabs.
          //tabBarActiveBackgroundColor: "",//Background color for the active tab
          //tabBarInactiveBackgroundColor:"",//
          //tabBarLabelStyle: { fontFamily: "SpaceMono" }, //{ fontSize: 13, fontFamily: "SpaceMono" },
          //tabBarBadge: 'string/number',
          //tabBarBadgeStyle
          //tabBarLabelPosition: below-icon || beside-icon
          //tabBarBackground: ()=> React.Element
          // tabBarIconStyle: { fontSize: 10 },
          tabBarStyle: {
            backgroundColor: DefaultTheme.colors.card,
            // display: matches ? "none" : "flex",
            //height: 50,
            paddingBottom: 2,
            paddingTop: 2,
          }, //or add custom height: 50,
          //headerShown: false
          // headerTitleStyle: {color: "#fff"},//must use this to set header title color
          // headerStyle: { backgroundColor: "#10b981" }, //custom  height: 80 of header etc//color won't work
        })}
      >
        {/*Instead of configuring options within the route, you can configure static options outside the route i.e like below:
      This will also order tabs in the order below instead of how the pages are ordered in directory + configure common options here and use Tab.Screen in routes for specific options */}
        <Tabs.Screen
          name="(home)" //must be provided when used as child of layout
          options={{
            title: "Home",
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="favorites" //if layout present name must be name of folder(no path to child). Load index or first route in folder
          options={{
            title: "Favorites",
          }}
        />
        <Tabs.Screen
          name="tours"
          options={{
            // headerShown: false,
            title: "Tours",
            tabBarBadge: notifications?.tours?.length || undefined, //'string/number',
            //tabBarBadgeStyle
          }}
          //initialParams={{ notifications: 3 }} //only working with useGlobalSearchParams()/not good causes all screens subscribed to it to re-renders whenever any route params updates//added// can cause performance issues if overused.
        />
        <Tabs.Screen
          name="inbox" //if no layout, name can be a path to a specific route/page eg 'inbox/index'
          options={{
            title: "Inbox",
            headerShown: false,
            tabBarBadge: notifications?.tours?.length || undefined, //'string/number',
            //tabBarBadgeStyle
          }}
          //initialParams={{ notifications }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            headerShown: false,
            title: "Profile",
          }}
        />
        <Tabs.Screen
          name="listings"
          options={{
            href: null,
            headerShown: false,
          }}
        />

        <Tabs.Screen
          name="auth"
          options={{
            href: null,
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            href: null,
            headerShown: false,
          }}
        />
      </Tabs>
    </View>
  );
}
