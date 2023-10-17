import React, { useState } from "react";

import { skipToken } from "@reduxjs/toolkit/dist/query";
import { format } from "date-fns";
import { Image } from "expo-image";

import { FlatList, Text, View } from "react-native";

import { EvilIcons, FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  ActivityIndicator,
  Avatar,
  Button,
  Card,
  Dialog,
  List,
  Portal,
} from "react-native-paper";
import { IProfile, IReview } from "@/types/user";
import { useGetRelatedListingsQuery } from "./viewApiSlice";
import { IMAGE_ROOT, PROFILE_PIC_ROOT } from "@/constants/paths";
import { IListing } from "@/types/listing";
import Modal from "@/components/Modal";
import colors from "@/constants/colors";
import { ScrollView } from "react-native-gesture-handler";

type ProfileProps = {
  open: boolean;
  handleClose: () => void;
  profile: IProfile;
};

const Profile = ({ open, handleClose, profile }: ProfileProps) => {
  /* ----------------------------------------
   FETCH RELATED LISTINGS
   ----------------------------------------*/
  const {
    data: related,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetRelatedListingsQuery(profile.user._id ?? skipToken, {
    //pollingInterval: 15000,
    //refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  if (!profile)
    return (
      <Modal visible={open} onDismiss={handleClose}>
        <ActivityIndicator color={colors.gray.light} size={35} />
      </Modal>
    );

  return (
    <Modal
      visible={open}
      onDismiss={handleClose}
      style={{ padding: 20 }}
      title="Profile"
    >
      <ScrollView>
        <List.Item
          className="bg-gray-dull px-3 rounded-md "
          //descriptionStyle={{}}
          // descriptionNumberOfLines={2} //default 2
          onPress={() => router.push("/profile/view")}
          titleStyle={{}}
          title={
            <Text className="text-lg font-semibold">
              {profile.user.username}
            </Text>
          }
          description={
            <View className="flex-row">
              <Text className="text-sm text-gray-muted ">
                {profile.rating?.toFixed(1) || "No rating"}
              </Text>
              <Text>
                Joined{" "}
                {format(new Date(profile.user.createdAt), "dd MMM, yyyy")}{" "}
              </Text>
            </View>
          }
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
          right={() => <Text>{profile.reviewCount || "0"} reviews</Text>}
        />

        <Text className="text-xl font-bold my-4">
          What people say about {profile.user?.username}
        </Text>

        <View className="mb-4">
          <ScrollView horizontal>
            {profile.reviews?.map((item, i) => (
              <View key={item._id} className="max-w-[300] px-1 py-4">
                <Card mode="outlined">
                  <Card.Content>
                    <Text>
                      "{item.comment.slice(0, 200)}
                      {item.comment.length > 200 && "..."}
                    </Text>
                  </Card.Content>

                  <Card.Title
                    title={
                      <Text className="text-lg font-semibold">
                        {item.postedBy.username}
                      </Text>
                    }
                    subtitle={
                      <Text className="text-sm text-gray-muted ">
                        {format(new Date(item.createdAt), "dd MMM, yyyy")}
                      </Text>
                    }
                    left={() => (
                      <Avatar.Icon
                        size={40}
                        icon={({ size, color }) => {
                          size = size + 20;
                          return item.postedBy?.username ? (
                            <Image
                              source={`${PROFILE_PIC_ROOT}/${item.postedBy?.profile?.profilePic?.filename}`}
                              className="rounded-full"
                              style={{ width: size, height: size }}
                            />
                          ) : (
                            <FontAwesome
                              name="user-o"
                              size={24}
                              color="black"
                            />
                          );
                        }}
                        color="#10b981"
                        style={{ backgroundColor: "#e2e8f0" }}
                      />
                    )}
                    right={() => (
                      <View className="flex-row  items-center">
                        <FontAwesome
                          name="star"
                          size={15}
                          color={colors.orange.DEFAULT}
                        />
                        <Text className="text-sm text-gray-muted px-2">
                          {item.rating?.toPrecision(2) || "No rating"}
                        </Text>
                      </View>
                    )}
                  />
                </Card>
              </View>
            ))}
          </ScrollView>
        </View>

        <Text className="text-xl font-bold my-3">
          Other listings from {profile.user?.username}
        </Text>

        <View className="pb-10">
          <ScrollView horizontal>
            {related?.map((item, i) => (
              <View key={item._id} className="min-w-[300] px-1 py-4">
                <Card mode="outlined">
                  <Card.Cover
                    source={{
                      uri: `${IMAGE_ROOT}/${item.listingImages?.[0]?.filename}`,
                    }}
                    className="rounded-t-md rounded-b-none"
                  />

                  <Card.Content className="gap-y-1">
                    <Text className="text-gray-darker text-lg font-bold pt-1">
                      {item.bedrooms}
                    </Text>

                    <Text className="text-gray-muted text-sm">
                      {item.location?.description}
                    </Text>

                    <Text className="text-gray-darker  text-md font-medium">
                      Ksh {item.price}/mo
                    </Text>
                  </Card.Content>
                </Card>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </Modal>
  );
};

export default Profile;
