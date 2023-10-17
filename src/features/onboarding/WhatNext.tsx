import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import {
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  Pressable,
} from "react-native";
import { Image } from "expo-image";

import Toast from "react-native-toast-message";
import {
  EvilIcons,
  FontAwesome,
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
} from "react-native-paper";
import colors from "@/constants/colors";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { router } from "expo-router";

type WhatNextProps = {
  handleClose: () => void;
};

const WhatNext = ({ handleClose }: WhatNextProps) => {
  return (
    <KeyboardAwareScrollView>
      <Text className="text-xl font-bold mb-3">Your are now all set!</Text>

      <Text className="mb-3">
        You will now be able to post vacant houses and manage tour requests from
        interested clients.
      </Text>

      <Text>Click the button below to post or manage rentals.</Text>

      <View className="flex-row py-4 justify-end">
        <Button onPress={handleClose} mode="outlined">
          Manage listings
        </Button>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default WhatNext;
