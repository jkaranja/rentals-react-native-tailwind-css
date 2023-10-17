import { useDispatch } from "react-redux";

import React, { useEffect, useState } from "react";

import { addDays, addHours, startOfDay } from "date-fns";

import {
  Control,
  Controller,
  FieldErrors,
  SubmitHandler,
  UseFormRegister,
  useForm,
} from "react-hook-form";

import { useAppDispatch } from "../../hooks/useAppDispatch";
import Toast from "react-native-toast-message";

import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import {
  Button,
  Dialog,
  PaperProvider,
  Portal,
  TextInput,
} from "react-native-paper";
import { View, Text, useWindowDimensions } from "react-native";
import { EvilIcons, MaterialIcons } from "@expo/vector-icons";
import { AccountInputs } from "./AccountScreen";

const MEGA_BYTES_PER_BYTE = 1e6;
const convertBytesToMB = (bytes: number) =>
  Math.round(bytes / MEGA_BYTES_PER_BYTE);

type ConfirmPwdProps = {
  open: boolean;
  isLoading: boolean;
  handleClose: () => void;
  register: UseFormRegister<AccountInputs>;
  errors: FieldErrors<AccountInputs>;
  handleSubmit: () => Promise<void>;
  control: Control<AccountInputs>;
};

const ConfirmPwd = ({
  open,
  handleClose,
  handleSubmit,
  register,
  errors,
  isLoading,
  control,
}: ConfirmPwdProps) => {
  return (
    <Portal>
      <Dialog
        visible={open}
        onDismiss={handleClose}
        dismissable //Determines whether clicking outside the dialog dismiss it.
        style={{
          borderRadius: 12,
          backgroundColor: "#fff",
          paddingTop: 0,
          paddingVertical: 0,
        }}
        // dismissableBackButton//Determines whether clicking Android hardware back button dismiss dialog.
      >
        <Dialog.Title
          className=""
          style={{
            marginTop: 0,
            marginBottom: 0,
            marginLeft: 0,
            marginRight: 0,
            height: 0,
          }}
        >
          {""}
        </Dialog.Title>
        <Dialog.Content className="rounded-xl  p-0 ">
          <View className="flex-row justify-between text-right items-center  p-4">
            <Text className="text-lg">Enter password to save changes</Text>
            <EvilIcons name="close" size={24} onPress={handleClose} />
          </View>

          <View className="p-5 pb-8">
            <Controller
              name="password"
              control={control}
              rules={{
                required: "Password is required",
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  clearButtonMode="while-editing"
                  autoComplete="password" //Specifies autocomplete hints for the system, so it can provide autofill(off to disable). eg password|email|
                  secureTextEntry //If true, the text input obscures the text entered so that sensitive text like passwords stay secure.
                  mode="outlined"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={Boolean(errors.password?.message)} //Whether to style the TextInput with error style.
                  label="password"
                />
              )}
            />
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            mode="contained"
            disabled={isLoading}
            loading={isLoading}
            onPress={handleSubmit}
          >
            Save changes
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default ConfirmPwd;
