import { View, Text } from "react-native";
import React from "react";
import AgentTours from "@/features/tours/agent/AgentTours";
import { useGetNotificationsQuery } from "@/features/notifications/notificationsApiSlice";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectCurrentRole } from "@/features/auth/authSlice";
import { Role } from "@/types/user";
import RenterTours from "@/features/tours/renter/RenterTours";
import { useLocalSearchParams } from "expo-router";

const index = () => {
  const role = useAppSelector(selectCurrentRole);

  const { data: notifications } = useGetNotificationsQuery(undefined, {
    pollingInterval: 60000 * 5, //in ms//fire every 5 mins
    // refetchOnFocus: true,
    refetchOnMountOrArgChange: true, //in secs
  });

  return (
    <View className="flex-1">
      {role === Role.Agent ? (
        <AgentTours notifications={notifications!} />
      ) : (
        <RenterTours notifications={notifications!} />
      )}
    </View>
  );
};

export default index;
