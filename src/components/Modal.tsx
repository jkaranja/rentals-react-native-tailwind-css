import * as React from "react";
import {
  Modal as PaperModal,
  Button,
  Dialog,
  Divider,
  IconButton,
  PaperProvider,
  Portal,
} from "react-native-paper";
import { View, Text, ViewStyle, StyleProp, Pressable } from "react-native";
import { AntDesign, EvilIcons } from "@expo/vector-icons";
import colors from "@/constants/colors";

type ModalProps = {
  visible: boolean;
  title?: string;
  onDismiss: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
};

const Modal = ({
  onDismiss,
  children,
  visible,
  title,
  style = { padding: 20 },
}: ModalProps) => {
  return (
    <Portal>
      <PaperModal
        visible={visible}
        onDismiss={onDismiss}
        dismissable //Determines whether clicking outside the dialog dismiss it.
        style={{
          justifyContent: "flex-start",
          //borderRadius: 12,
          backgroundColor: "#fff",

          ...style,
        }} //Style for the wrapper of the modal. Use this prop to change the default wrapper style or to override safe area insets with marginTop and marginBottom.
        //contentContainerStyle//Style for the content of the modal
        dismissableBackButton //Determines whether clicking Android hardware back button dismiss dialog.
      >
        <View className="flex-row   gap-x-1 items-center">
          {/* <IconButton
            icon={({ size, color }) => (
              <AntDesign name="arrowleft" size={15} color="#000" />
            )}
            iconColor={colors.gray.dark}
            mode="outlined"
            containerColor="red"
            size={15}
            onPress={onDismiss}
            //rippleColor={colors.emerald.DEFAULT}
            style={{ borderColor: "#fff", marginVertical: 0 }}
          /> */}

          <Pressable onPress={onDismiss} className="py-3">
            <AntDesign name="arrowleft" size={15} color="#000" />
          </Pressable>
          <Text className="font-semibold px-2">{title}</Text>
        </View>

        {children}
      </PaperModal>
    </Portal>
  );
};

export default Modal;
