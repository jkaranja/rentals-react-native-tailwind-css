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

type HowItWorksProps = {
  handleNext: () => void;
};

const HowItWorks = ({ handleNext }: HowItWorksProps) => {
  return (
    <KeyboardAwareScrollView>
      <Text className="text-xl font-bold mb-3">
        Getting started as an agent and making money
      </Text>

      <Text className="mb-3">
        We're glad your interested in becoming an agent and start posting
        rentals. Let's answer a few questions you might have.
      </Text>

      <Text className="text-lg font-bold mb-3">How does it work?</Text>
      <Text className="mb-3">
        It's simple! You look for vacant houses in your area and post them on
        our platform(with landlord/owner's permission).
      </Text>

      <Text className="mb-3">
        Then, anyone looking for a vacant house, will visit our platform and view
        all the vacant listings you have posted. They will then send you a
        request asking you to take them on a tour to see the vacant houses.
      </Text>

      <Text className="text-lg font-bold mb-3">How will you earn money?</Text>
      <Text className="mb-3">
        After receiving the request, you will accept the request, take the
        client on a tour and they will pay you for your service.
      </Text>

      <Text className="text-lg font-bold mb-3">
        How much should you charge for the service?
      </Text>
      <Text className="mb-3">
        That will be up to you. The lower the fee, the more interested clients
        you will get. In the next step, you will fill the amount you will
        charge.
      </Text>

      <Text className="text-lg font-bold mb-3">How do we make money?</Text>
      <Text className="mb-3">
        You will be required to pay a commission of Ksh 100 for every
        successful tour. Make sure you include this commission when setting your
        tour fee.
      </Text>

      <Text className="text-lg font-bold mb-3">What's next?</Text>
      <Text className="mb-3">
        To start posting rentals, you will need to create an agent profile.
        Click 'NEXT' below to create a profile.
      </Text>

      <View className="pb-10 pt-2">
        <Button onPress={handleNext} mode="contained">
          Next
        </Button>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default HowItWorks;
