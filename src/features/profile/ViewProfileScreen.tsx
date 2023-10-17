import React, { useState } from "react";

import { skipToken } from "@reduxjs/toolkit/dist/query";
import { format } from "date-fns";
import { Image } from "expo-image";
import { PROFILE_PIC_ROOT } from "../../constants/paths";
import useAuth from "../../hooks/useAuth";
import { AccountStatus, IReview } from "../../types/user";
import { useGetProfileQuery } from "../auth/userApiSlice";

import { FlatList, Text, View } from "react-native";

import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  ActivityIndicator,
  Avatar,
  Button,
  Card,
  List,
} from "react-native-paper";
import UpdateProfile from "./UpdateProfile";
import Onboard from "../onboarding/Onboard";
import colors from "@/constants/colors";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const ViewProfileScreen = () => {
  const [roles, _id, accountStatus] = useAuth();

  //dialogs
  const [openProfileD, setOpenProfileD] = useState(false);
  const handleToggleProfileD = () => setOpenProfileD((prev) => !prev);
  const [openOnboardD, setOpenOnboardD] = useState(false);
  const handleToggleOnboardD = () => setOpenOnboardD((prev) => !prev);

  const {
    data: profile,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetProfileQuery(_id ?? skipToken, {
    // pollingInterval: 15000,
    // refetchOnFocus: true,
    // refetchOnMountOrArgChange: true,
  });

  if (!profile?.user)
    return (
      <View className="flex-1 p-6 mt-4">
        <ActivityIndicator color={colors.gray.light} size={35} />
      </View>
    );

  return (
    <KeyboardAwareScrollView className="flex-1 p-4 ">
      {openProfileD && (
        <UpdateProfile
          profile={profile!}
          open={openProfileD}
          handleClose={handleToggleProfileD}
        />
      )}

      {openOnboardD && (
        <Onboard open={openOnboardD} handleClose={handleToggleOnboardD} />
      )}

      <List.Item
        className="my-2 p-2 "
        //descriptionStyle={{}}
        // descriptionNumberOfLines={2} //default 2
        onPress={() => router.push("/profile/view")}
        titleStyle={{}}
        title={
          <Text className="text-lg font-semibold">{profile.user.username}</Text>
        }
        // description={
        //   <Text className="text-sm text-gray-muted ">Profile</Text>
        // } // string | React.ReactNode
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
      />

      <View className="flex-row gap-x-3 justify-between items-center mb-3">
        <Text>{profile.rating?.toFixed(1) || "No rating"}</Text>
        <Text>{profile.reviewCount || "0"} reviews</Text>

        <View className="flex-row gap-x-2">
          <MaterialCommunityIcons name="calendar" size={24} color="black" />
          <Text>
            Joined {format(new Date(profile.user.createdAt), "dd MMM, yyyy")}
          </Text>
        </View>
      </View>

      <View>
        {accountStatus === AccountStatus.Approved ? (
          <Button mode="contained" onPress={handleToggleProfileD}>
            Edit profile
          </Button>
        ) : (
          <Button mode="contained" onPress={handleToggleOnboardD}>
            Create Agent Profile
          </Button>
        )}
      </View>

      <Text className="text-xl font-bold my-2">About Me</Text>

      <Text>{profile.bio ? `"${profile.bio}` : "No bio yet!"}</Text>

      <Text className="text-xl font-bold my-3">Contacts</Text>

      <Text>Phone Number: {profile.user.phoneNumber}</Text>

      <Text className="my-2">Email: {profile.user.email || "No email"}</Text>

      <Text className="text-xl font-bold my-3">Tour fees</Text>

      <Text>Ksh: {profile.tourFee || "Not provided yet!"}</Text>

      <Text className="text-xl font-bold my-3">Reviews</Text>

      {!profile.reviews?.length && <Text>No reviews found</Text>}

      {profile.reviews?.map((item, i) => (
        <View key={item._id} className="max-w-[300] mb-3">
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
              } // string | React.ReactNode
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
                      <FontAwesome name="user-o" size={24} color="black" />
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
    </KeyboardAwareScrollView>
  );
};

export default ViewProfileScreen;
