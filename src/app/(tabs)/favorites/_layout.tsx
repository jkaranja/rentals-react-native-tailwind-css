import { View, Text } from "react-native";
import React from "react";
import { Slot } from "expo-router";
import { selectCurrentToken } from "@/features/auth/authSlice";
import { useAppSelector } from "@/hooks/useAppSelector";

const _layout = () => {
  const token = useAppSelector(selectCurrentToken);

  return token && <Slot />;
};

export default _layout;
