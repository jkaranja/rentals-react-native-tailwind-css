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
import { PROFILE_PIC_ROOT } from "../../constants/paths";
import { PHONE_NUMBER_REGEX } from "../../constants/regex";
import { IProfile } from "../../types/user";
import { useUpdateProfileMutation } from "../auth/userApiSlice";
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
import Modal from "@/components/Modal";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const MEGA_BYTES_PER_BYTE = 1e6;
const convertBytesToMB = (bytes: number) =>
  Math.round(bytes / MEGA_BYTES_PER_BYTE);

type UpdateProfileProps = {
  profile: IProfile;
  open: boolean;
  handleClose: () => void;
};

const UpdateProfile = ({ profile, open, handleClose }: UpdateProfileProps) => {
  const [updateProfile, { data, error, isLoading, isError, isSuccess }] =
    useUpdateProfileMutation();

  const [profilePic, setProfilePic] = useState<IImage>({} as IImage);

  type Inputs = {
    bio: string;
    tourFee: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, submitCount },
    reset: resetForm,
    control,
    watch,
    getValues,
    setValue,
  } = useForm<Inputs>({ mode: "onChange" });

  /**--------------------------------
   HANDLE SIGN UP SUBMIT
 -------------------------------------*/
  const onSubmit = async (data: Inputs) => {
    const formData = new FormData();

    formData.append("profilePic", profilePic as unknown as Blob);
    formData.append("bio", data.bio);
    formData.append("tourFee", String(data.tourFee));

    await updateProfile(formData);
  };

  //image picker
  const pickImage = async () => {
    // Ask the user for the permission to access the media library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Toast.show({
        type: "error", // error || info
        text1: "Access to media library denied",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images, //Images | Videos| All  images or only videos separately
      quality: 1,
      aspect: [3, 3], //landscape->4, 3// portrait:[3, 4]
    });

    //use 'canceled' => 'cancelled' deprecated
    //if picker was not cancelled
    if (!result.canceled) {
      //fileSize & fileName = undefined in result
      ////don't forget to check if file type is correct(eg format image/jpeg)//else Network error or nothing or multer will return files a stringified array
      setProfilePic({
        uri: result.assets[0]?.uri,
        name:
          result.assets[0]?.fileName || result.assets[0]?.uri.split("/").pop()!,
        type: `image/${result.assets[0]?.uri.split(".").pop()}`,
      });
    }
  };

  //set defaults
  useEffect(() => {
    resetForm({
      bio: profile?.bio || "",
      tourFee: String(profile?.tourFee) || "",
    });
  }, [profile]);

  //feedback
  useEffect(() => {
    if (isError) Toast.show({ type: "error", text1: error as string });

    if (isSuccess) Toast.show({ type: "success", text1: data?.message });

    const timerId = setTimeout(() => {
      if (isSuccess) handleClose();
    }, 2000);

    return () => clearTimeout(timerId);
  }, [isError, isSuccess]);

  return (
    <Modal visible={open} onDismiss={handleClose} style={{ padding: 20 }}>
      <KeyboardAwareScrollView>
        <Text className="text-xl font-bold mb-3">Update profile</Text>

        <View className="flex-row justify-center  my-3">
          <Pressable className="" onPress={pickImage}>
            <Avatar.Icon
              // size={60}
              icon={({ size, color }) => {
                size = size + 20;
                return profilePic.uri || profile?.profilePic?.filename ? (
                  <Image
                    source={
                      profilePic.uri ||
                      `${PROFILE_PIC_ROOT}/${profile?.profilePic?.filename}`
                    }
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
            <View className="absolute bottom-[-10] right-3 ">
              <IconButton
                icon={({ size, color }) => (
                  <MaterialCommunityIcons
                    name="pencil"
                    size={14}
                    color={color}
                  />
                )}
                iconColor="#fff"
                size={10}
                className="bg-emerald"
              />
            </View>
          </Pressable>
        </View>

        <Text className="my-3 ">Write a brief introduction about yourself</Text>

        <Controller
          name="bio"
          control={control}
          rules={{
            required: "Bio is required",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              multiline //=boolean//whether the input can have multiple lines.
              numberOfLines={10}
              //also inherits react native TextInput props
              //keyboardType="number-pad" //or numeric
              clearButtonMode="while-editing"
              // autoComplete="tel" //Specifies autocomplete hints for the system, so it can provide autofill(off to disable). eg username|email|
              //secureTextEntry//If true, the text input obscures the text entered so that sensitive text like passwords stay secure.
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              //left={<TextInput.Affix text="+254" />}
              error={Boolean(errors.bio?.message)} //Whether to style the TextInput with error style.
              // label="Message"
            />
          )}
        />
        <HelperText type="error" visible={Boolean(errors.bio?.message)}>
          {errors.bio?.message}
        </HelperText>
        <Text className="mb-3">How much do you charge for a tour?</Text>

        <Controller
          name="tourFee"
          control={control}
          rules={{
            required: "Tour fee is required",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              //label="Ksh"
              keyboardType="number-pad"
              dense
              mode="outlined"
              onBlur={onBlur}
              onChangeText={(text) =>
                onChange(text.replace(/[^0-9]/g, "") || "0")
              }
              value={value}
              left={<TextInput.Affix text="Ksh" />}
              // error={Boolean(errors.username?.message)} //Whether to style the TextInput with error style.
            />
          )}
        />
        <HelperText type="error" visible={Boolean(errors.tourFee?.message)}>
          {errors.tourFee?.message}
        </HelperText>

        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
        >
          Save changes
        </Button>
      </KeyboardAwareScrollView>
    </Modal>
  );
};

export default UpdateProfile;
