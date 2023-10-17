import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  SectionList,
} from "react-native";
import React from "react";
import { Avatar, Button, Divider, List, MD3Colors } from "react-native-paper";
import { Link, router } from "expo-router";
import clsx from "clsx";
import { FontAwesome } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const screens = [
  {
    path: "contact",
    label: "Contact us",
  },

  {
    path: "terms",
    label: "Terms of service",
  },
  {
    path: "privacy",
    label: "Privacy policy",
  },
];

const GuestProfileNav = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top }} className="flex-1 p-4 mt-4">
      <List.Section className="  ">
        <FlatList
          data={screens}
          //showsVerticalScrollIndicator={false} or horiz
          //stickyHeaderIndices={[0]}//make first component eg ListHeaderCompo.. sticky //An array of child indices determining which children get docked to the top of the screen when scrolling.
          //StickyHeaderComponent//must use stickyHeaderIndices={[0]}// + other scrollView props eg contentContainerStyle
          //Rendered in between each item, but not at the top or bottom. Type: component | JSX.Element
          // ItemSeparatorComponent={<List.Subheader>Some title</List.Subheader>}
          ////function/component or React.ReactNode//Rendered at the top of all the items
          ListHeaderComponent={
            <View>
              <Text className="text-lg text-gray-muted mb-6">
                Log in to your account to request tour requests, manage listings
                and messages, and more.
              </Text>
              <Button
                className="bg-emerald"
                // icon="google" //any MaterialCommunityIcons icon name//see https://icons.expo.fyi/Index
                mode="contained"
                onPress={() => router.push("/auth/login")}
                uppercase //boolean//Make the label text uppercased
                //compact//false//a compact look, useful for text buttons in a row.
                // icon={({ size, color }) => (
                //   <Image
                //     source={require("../assets/chameleon.jpg")}
                //     style={{ width: size, height: size, tintColor: color }}
                //   />
                // )}//custom icon component
                //icon={require('../assets/chameleon.jpg')}//load img as icon
                //icon={{ uri: 'https://avatars0.githubusercontent.com/u/17571969?v=3&s=400' }}//remote img
                //mode='text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal'//Default value: 'text'
                //dark= false// boolean//Whether the color is a dark color///only when mode= contained, contained-tonal and elevated modes
                //buttonColor=""
                //textColor=""
                //rippleColor=""//Color of the ripple effect.
                //loading=false //boolean //Whether to show a loading indicator//on the right(replace right icon)
                //disabled //boolean
                //onPressIn
                //labelStyle={{fontSize: 20}}  //Style for the button text.
                // style={{backgroundColor}}//not fontSize
                //contentStyle//Style of inner content.//set the icon on the right with flexDirection: 'row-reverse'
              >
                Log in
              </Button>
              <Text className="text-sm text-gray mt-3">
                Don't have an account?{" "}
                <Link className="underline" href="/auth/signup">
                  Sign up
                </Link>
              </Text>
            </View>
          }
          ListFooterComponent={<View></View>} //function/component or React.ReactNode//rendered bottom of list
          keyExtractor={(item) => item.path}
          renderItem={({ item }) => (
            <View>
              <List.Item
                onPress={() => router.push(`/auth/${item.path}`)}
                title={
                  <Text className="text-md text-md  dark:text-gray-light">
                    {item.label}
                  </Text>
                }
                left={() => (
                  <List.Icon
                    //color//color for the icon
                    //style
                    // {...props}//inherit styling props from list.item
                    icon={({ size, color }) => {
                      let icon: any;
                      if (item.path === "contact") icon = "envelope-o";
                      if (item.path === "privacy") icon = "list-ul";
                      if (item.path === "terms") icon = "list-alt";
                      if (item.path === "settings") icon = "gear";

                      return (
                        <FontAwesome name={icon} size={20} color="black" />
                      );
                    }}
                  />
                )}
                right={() => (
                  <List.Icon
                    icon={() => (
                      <FontAwesome name="angle-right" size={24} color="black" />
                    )}
                  />
                )}
              />
              <Divider className="dark:bg-gray-muted" />
            </View>
          )}
        />
      </List.Section>

      {/* <List.Section className={clsx("bg-white  my-0 dark:bg-gray-dark")}>
          <List.Item
            //descriptionStyle={{}}
            // descriptionNumberOfLines={2} //default 2
            // onPress={() => {}}
            titleStyle={{}}
            //style={{}}
            title={
              <Text className="text-lg font-semibold dark:text-gray-light">
                Mark Walter
              </Text>
            }
            description={
              <Text className="text-sm text-gray-muted dark:text-gray-muted">
                Active
              </Text>
            } // string | React.ReactNode
            left={() => (
              <Avatar.Icon
                size={44}
                icon="account"
                color="#10b981"
                style={{ backgroundColor: "#e2e8f0" }}
              />
            )}
            //right = {() => React.ReactNode}
          />
             {/* <List.Subheader>Some title</List.Subheader> */}

      {/* <View
            style={{
              height: 1,
              borderWidth: StyleSheet.hairlineWidth,
              width: "100%",
              borderColor: "#00000020",
            }}
          /> </List.Section> */}
    </View>
  );
};

export default GuestProfileNav;
