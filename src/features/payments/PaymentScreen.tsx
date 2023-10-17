
import React from "react";



import { useWindowDimensions } from "react-native";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import Activity from "./Activity";
import CommissionsList from "./CommissionsList";
import { useSafeAreaInsets } from "react-native-safe-area-context";


const renderTabBar = (props: any) => (
  <TabBar
    {...props}
    indicatorStyle={{ backgroundColor: "#10b981" }}
    style={{ backgroundColor: "#fff", paddingTop: 20 }}
    // renderIcon={({ route, focused, color }) => {
    //   let iconName: any = "directions-car";
    //   if (route.key === "login") {
    //     iconName = focused ? "directions-car" : "directions-car";
    //   } else if (route.key === "register") {
    //     iconName = focused ? "delivery-dining" : "delivery-dining";
    //   }

    //   return <MaterialIcons name={iconName} color={color} size={24} />;
    // }}
    //renderBadge//Function which takes an object with the current route and returns a custom React Element to be used as a badge.
    activeColor="#10b981" //Custom color for icon and label in the active tab
    inactiveColor="#667085" //Custom color for icon and label in the inactive tab
    //tabStyle//tyle to apply to the individual tab items in the tab bar.
    //indicatorStyle= "#fff" //Style to apply to the active indicator.
    labelStyle={{ textTransform: "none", fontWeight: 500 }} //Style to apply to the tab item label.
    //style//Style to apply to the tab bar container
    //gap//Define a spacing between tabs
  />
);
const PaymentScreen = () => {

  const insets = useSafeAreaInsets();

  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "commissions", title: "Commissions", icon: "account" },
    { key: "activity", title: "Activity" },
  ]);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={SceneMap({
        commissions: CommissionsList,
        activity: Activity,
      })}
      renderTabBar={renderTabBar} //used to customize tabs
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      //sceneContainerStyle={{ backgroundColor: "#fff" }} //Style to apply to the view wrapping each screen/scene
      style={{ paddingTop: insets.top }} //Style to apply to the tab view container eg backgroundColor: "red",
    />
  );
};

export default PaymentScreen;
