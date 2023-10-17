import {
  View,
  Text,
  Pressable,
  GestureResponderEvent,
  ScrollView,
} from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import clsx from "clsx";
import colors from "@/constants/colors";

type TabsProps = {
  tabs: (string | JSX.Element)[];
  icon?: JSX.Element | string;
  activeTab: JSX.Element | string;
  handleTabChange: (tab: JSX.Element | string) => void; //
} & View["props"];

const CustomTabBar = ({
  tabs,
  icon,
  activeTab,
  handleTabChange,
  ...props
}: TabsProps) => {
  return (
    <View
      className=" bg-white flex-row grow max-h-[55]"
      style={{ elevation: 1 }}
      {...props}
    >
      <ScrollView
        centerContent={true}
        //indicatorStyle='default', 'black', 'white'
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        contentContainerStyle={{
          height: 55,
          paddingHorizontal: 15,
          minWidth: "100%",
          justifyContent: "space-evenly",
        }}
      >
        {tabs.map((tab, index) => (
          <Pressable
            onPress={(e: GestureResponderEvent) => handleTabChange(tab)}
            key={index}
            className={clsx(
              "justify-center ",
              tab === activeTab && "border-b-2 border-emerald"
            )}
          >
            <View className="items-center justify-center">
              {typeof icon === "string" && (
                <MaterialCommunityIcons
                  name={icon as any}
                  size={20}
                  color={colors.gray.muted}
                />
              )}
              {typeof icon !== "string" && icon}
              <Text className="px-2 text-gray">{tab}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

export default CustomTabBar;
