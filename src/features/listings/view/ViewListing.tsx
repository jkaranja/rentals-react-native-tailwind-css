import { useEffect, useState, useRef } from "react";
import { Controller, useForm } from "react-hook-form";

import {
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  Pressable,
  SectionList,
  useWindowDimensions,
} from "react-native";
import { Image } from "expo-image";

import Toast from "react-native-toast-message";
import {
  EvilIcons,
  FontAwesome,
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { IImage } from "@/types/file";
import * as ImagePicker from "expo-image-picker";
import {
  ActivityIndicator,
  Avatar,
  Button,
  Divider,
  HelperText,
  IconButton,
  TextInput,
  Dialog,
  Portal,
  List,
  DataTable,
} from "react-native-paper";
import colors from "@/constants/colors";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useGetListingQuery } from "./viewApiSlice";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetProfileQuery } from "@/features/auth/userApiSlice";
import { IListing } from "@/types/listing";
import SwipeableViews from "@/components/SwipeableViews";
import { router } from "expo-router";
import { PROFILE_PIC_ROOT } from "@/constants/paths";
import CustomTabBar from "@/components/CustomTabBar";
import RequestTour from "./RequestTour";
import SendMessage from "./SendMessage";
import Profile from "./Profile";
import Modal from "@/components/Modal";

type ViewListingProps = {
  open: boolean;
  handleClose: () => void;
  id: string;
};

const ViewListing = ({ open, handleClose, id }: ViewListingProps) => {
  const dispatch = useAppDispatch();

  const dimensions = useWindowDimensions();

  // const scrollIntoView = useScrollIntoView();
  const scrollRef = useRef<SectionList>(null);

  const [activeTab, setActiveTab] = useState<string | JSX.Element>(
    "Main specs"
  );

  const [listing, setListing] = useState<IListing>({} as IListing);

  const [scrollPosition, setScrollPosition] = useState(0);

  /* ----------------------------------------
   FETCH LISTING
   ----------------------------------------*/

  const { data, isFetching, isSuccess, isError, error } = useGetListingQuery(
    id ?? skipToken,
    {
      //pollingInterval: 15000,
      //refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );
  useEffect(() => {
    setListing(data || ({} as IListing));
  }, [data]);

  /* ----------------------------------------
   FETCH profile
   ----------------------------------------*/
  const {
    data: profile,
    // isFetching,
    // isSuccess,
    // isError,
    // error,
  } = useGetProfileQuery(listing?.user?._id ?? skipToken, {
    // pollingInterval: 15000,
    // refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  /* -------------------------------------------------------------
    HANDLE TAB CHANGE
   ----------------------------------------------------------------*/
  const handleTabChange = (tab: string | JSX.Element) => {
    if (tab === "Directions") {
      router.push({
        pathname: "/view/direction",
        params: { location: JSON.stringify(listing.location || "") },
      });
      return setActiveTab("Basic");
    }

    setActiveTab(tab);

    let sectionIndex = 0;
    if (tab === "Amenities") sectionIndex = 1;
    if (tab === "Policies") sectionIndex = 2;
    //scroll to section
    scrollRef.current?.scrollToLocation({
      sectionIndex,
      itemIndex: 0,
      //viewOffset: 140,
      //animated: true,//Defaults to true.
    });
  };

  /* -------------------------------------------------------------
   HANDLE ON SCROLL->GET POSITION
   ----------------------------------------------------------------*/
  const handleScroll = ({ nativeEvent }: { nativeEvent: any }) => {
    const scrollOffset = nativeEvent.contentOffset.y;
    setScrollPosition(scrollOffset);
  };

  const DATA = [
    { title: "Overview", data: [{ key: "overview", value: listing.overview }] },

    {
      title: "Facts",
      data: [
        {
          key: "Bedroom",
          value: listing.bedrooms,
        },
        {
          key: "Bathroom",
          value: listing.bathrooms,
        },

        {
          key: "Rent",
          value: `Ksh ${listing.price}`,
        },
      ],
    },
    {
      title: "Amenities",
      data: [
        {
          key: "Water 7days/week",
          value: listing.amenities?.water ? "✔️" : "❌",
        },
        {
          key: "Borehole",
          value: listing.amenities?.borehole ? "✔️" : "❌",
        },
        {
          key: "Parking",
          value: listing.amenities?.parking ? "✔️" : "❌",
        },
        {
          key: "Wifi",
          value: listing.amenities?.wifi ? "✔️" : "❌",
        },
        {
          key: "Pool",
          value: listing.amenities?.pool ? "✔️" : "❌",
        },
        {
          key: "cctv",
          value: listing.amenities?.cctv ? "✔️" : "❌",
        },
        {
          key: "Watchman",
          value: listing.amenities?.watchman ? "✔️" : "❌",
        },
        {
          key: "Gym",
          value: listing.amenities?.gym ? "✔️" : "❌",
        },
        {
          key: "securityLights",
          value: listing.amenities?.securityLights ? "✔️" : "❌",
        },
      ],
    },
    {
      title: "Policies",
      data:
        listing.policies?.map((policy, i) => ({
          key: i + 1,
          value: <Text className="text-lg font-semibold">{policy}</Text>,
        })) || [],
    },
  ];

  if (!listing)
    return (
      <Modal visible={open} onDismiss={handleClose}>
        <ActivityIndicator color={colors.gray.light} size={35} />
      </Modal>
    );

  return (
    <Modal visible={open} onDismiss={handleClose} style={{ padding: 20 }}>
      <View className="relative pb-10">
        <SectionList
          ListHeaderComponent={
            <View>
              <SwipeableViews
                images={listing.listingImages! || []}
                imageStyle={{ height: 200 }}
                //className="h-[200]"
                // offset={50}
                //startIcon="angle-left"
                // endIcon="share-alt"
                //endIconColor="#eee"
                //startIconColor="#fff"
                //startButtonPress={() => router.push( "/")}
              />
              <Text className="text-lg font-semibold py-2">
                {listing.bedrooms}
              </Text>
              <Text className="text-md text-gray-muted ">
                {listing.location?.description}
              </Text>

              <View className="flex-row py-2 gap-x-2">
                <FontAwesome name="map-marker" size={24} color="black" />
                <Text>{listing.location?.description}</Text>
              </View>

              <Text className="text-lg font-semibold pb-2">
                Ksh {listing.price}/mo
              </Text>

              <View className="border border-gray-dimmed p-2 rounded-md">
                <Text>
                  The agent below will take you on a tour to view this house and
                  all other vacant houses they have available. Click the name of
                  the agent to view their profile and other vacant houses they
                  have. When you request a tour, the agent will take you to see
                  all the vacant houses and you will pay them the tour fee
                  indicated below.
                </Text>
              </View>

              <List.Item
                //descriptionStyle={{}}
                // descriptionNumberOfLines={2} //default 2
                //onPress={() => router.push("/profile/view")}
                titleStyle={{}}
                title={
                  <Text className="text-lg font-semibold">
                    {profile?.user?.username}
                  </Text>
                }
                description={
                  <View className="flex-row  items-center">
                    <FontAwesome
                      name="star"
                      size={15}
                      color={colors.orange.DEFAULT}
                    />
                    <Text className="text-sm text-gray-muted px-2">
                      {profile?.rating?.toPrecision(2) || "No rating"}
                    </Text>
                  </View>
                } // string | React.ReactNode
                left={() => (
                  <Avatar.Icon
                    size={40}
                    icon={({ size, color }) => {
                      size = size + 20;
                      return profile?.profilePic?.filename ? (
                        <Image
                          source={`${PROFILE_PIC_ROOT}/${profile?.profilePic?.filename}`}
                          className="rounded-full"
                          style={{ width: size, height: size }}
                        />
                      ) : (
                        <FontAwesome name="user-o" size={24} color="black" />
                      );
                    }}
                    color="#10b981"
                    style={{ backgroundColor: "#e2e8f0" }}
                  />
                )}
                right={() => <Text>Tour fee: Ksh {profile?.tourFee}</Text>}
              />
              <CustomTabBar
                className="mb-4 "
                style={{ elevation: 1 }}
                tabs={["Overview", "Facts", "Amenities", "Policies"]}
                activeTab={activeTab}
                handleTabChange={handleTabChange}
              />
            </View>
          }
          //onStartReachedThreshold//How far from the start (in units of visible length of the list) the leading edge of the list must be from the start of the content to trigger the onStartReached callback.
          //onStartReached//(info: {distanceFromStart: number}) => void//Called once when the scroll position gets within within onStartReachedThreshold from the logical start of the list.
          //initialScrollIndex
          onScroll={handleScroll}
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[0]} //An array of child indices determining which children get docked to the top of the screen when scrolling.
          //initialNumToRender={10}//default/10//How many items to render in the initial batch.
          //onRefresh={refetch} //function// standard RefreshControl will be added for "Pull to Refresh" functionality.
          refreshing={isFetching} //Set this true while waiting for new data from a refresh.
          // stickySectionHeadersEnabled={true} ////default: false in android//Makes section headers stick to the top of the screen until the next one pushes it off.
          sections={DATA}
          keyExtractor={(item, i) => item.key + i}
          renderItem={({ item }) => (
            <View>
              {item.key === "overview" ? (
                <View className="mb-2 px-2">
                  <Text>{item.value}</Text>
                </View>
              ) : (
                <DataTable.Row>
                  <DataTable.Cell className="font-semibold">
                    {item.key}
                  </DataTable.Cell>
                  <DataTable.Cell>{item.value}</DataTable.Cell>
                </DataTable.Row>
              )}
            </View>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <View className=" px-2 py-1  ">
              <Text className="text-lg font-semibold">{title}</Text>
            </View>
          )}
          // ListFooterComponent={
          //   <View className="py-3 flex-row ">
          //     <Text>scroll to top</Text>
          //   </View>
          // }
        />

        {scrollPosition > 100 && (
          <IconButton
            className="bg-gray/30 absolute bottom-20 right-0"
            mode="contained-tonal"
            size={20}
            //labelStyle={{ fontSize: 30 }}
            //containerColor
            icon="chevron-up"
            iconColor="#fff"
            onPress={() => handleTabChange("Main specs")}
          />
        )}
      </View>
    </Modal>
  );
};

export default ViewListing;
