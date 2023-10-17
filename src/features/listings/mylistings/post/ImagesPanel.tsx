import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";

import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";
import Toast from "react-native-toast-message";
import { addToDraft, selectDraftListing } from "../listingSlice";
import { IImage } from "@/types/file";
import ImagesViewer from "@/components/ImagesViewer";

const ImagesPanel = () => {
  const draft = useAppSelector(selectDraftListing);

  const [selectedImages, setSelectedImages] = useState<IImage[]>(
    (draft.listingImages as any) || []
  );

  const dispatch = useAppDispatch();

  //or use hooks
  //const [permission, requestPermission] = ImagePicker.useCameraPermissions();
  //permission?.status !== ImagePicker.PermissionStatus.GRANTED

  //pick an image/video from the media library
  //Can also pick only image or only video separately. Set mediaTypes below.
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
      aspect: [4, 3], //landscape// portrait: 3,4
    });

    //use 'canceled' => 'cancelled' deprecated
    //if picker was not cancelled
    if (!result.canceled) {
      //fileSize & fileName = undefined in result
      ////don't forget to check if file type is correct(eg format image/jpeg)//else Network error or nothing or multer will return files a stringified array
      const imgList = result.assets.map((file) => ({
        uri: file.uri,
        name: file.fileName || file.uri.split("/").pop(),
        type: `image/${file.uri.split(".").pop()}`,
      }));
      //dedupe images/not working/name gen randomly each time
      // const newImages = imgList.filter(
      //   (img) =>
      //     !listingPics
      //       .map((pic) => JSON.stringify(pic))
      //       .includes(JSON.stringify(img))
      // );
      setSelectedImages([...selectedImages, ...(imgList as Array<IImage>)]);
    }
  };

  //take a photo with the camera
  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Toast.show({
        type: "error", // error || info
        text1: "Access to camera denied",
      });
      //Alert.alert("You've refused to allow this app to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images, //Images | Videos| All
      quality: 1,
      aspect: [4, 3], //landscape// portrait: 3,4
    });

    // Explore the result
    //use 'canceled' => 'cancelled' deprecated
    if (!result.canceled) {
      //fileSize & fileName = undefined in result
      //always use the assets array to extract file info->other fields deprecated
      const imgList = result.assets.map((file) => ({
        uri: file.uri,
        name: file.fileName || file.uri.split("/").pop(),
        type: file.type,
      }));

      // //dedupe images/not working/name gen randomly each time
      // const newImages = imgList.filter(
      //   (img) =>
      //     !listingPics
      //       .map((pic) => JSON.stringify(pic))
      //       .includes(JSON.stringify(img))
      // );
      setSelectedImages([...selectedImages, ...(imgList as Array<IImage>)]);
    }
  };

  const removeImage = (file: IImage) => {
    setSelectedImages((prev) => {
      return prev.filter(
        (image) => JSON.stringify(image) !== JSON.stringify(file)
      );
    });
  };

  //update draft in store
  useEffect(() => {
    dispatch(
      addToDraft({
        listingImages: selectedImages,
      })
    );
  }, [selectedImages]);

  return (
    <View className=" px-4 flex-1 ">
      <View className=" py-3">
        <Text className="text-lg text-gray-dimmed ">Add at least 3 images</Text>
      </View>

      <View className="flex-row justify-between py-2">
        <Button mode="contained" onPress={pickImage} className="bg-emerald">
          Select images
        </Button>
        <Button mode="contained" onPress={openCamera} className="bg-emerald">
          Take photo
        </Button>
      </View>

      <View className="flex-1 mt-4">
        {selectedImages && (
          <ImagesViewer images={selectedImages} removeImage={removeImage} />
        )}
      </View>
    </View>
  );
};

export default ImagesPanel;
