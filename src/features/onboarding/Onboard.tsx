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
import HowItWorks from "./HowItWorks";
import ProfileForm from "./ProfileForm";
import WhatNext from "./WhatNext";
import Modal from "@/components/Modal";

type OnboardProps = {
  open: boolean;
  handleClose: () => void;
};

const Onboard = ({ open, handleClose }: OnboardProps) => {
  const [activeStep, setActiveStep] = useState(1);

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  return (
    <Modal visible={open} onDismiss={handleClose}>
      <View className="">
        {activeStep === 1 && <HowItWorks handleNext={handleNext} />}
        {activeStep === 2 && (
          <ProfileForm handleNext={handleNext} handleBack={handleBack} />
        )}
        {activeStep === 3 && <WhatNext handleClose={handleClose} />}
      </View>
    </Modal>
  );
};

export default Onboard;
