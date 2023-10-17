import colors from "@/constants/colors";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";

import { Slot, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Avatar, Button, Dialog, List, Portal } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { resetDraft, selectDraftListing } from "../listingSlice";
import { ListingStatus } from "@/types/listing";
import { usePostNewListingMutation } from "../listingApiSlice";
import FactsPanel from "./FactsPanel";
import ImagesPanel from "./ImagesPanel";
import OverviewPanel from "./OverviewPanel";
import { EvilIcons } from "@expo/vector-icons";
import compressImage from "@/utils/compressImage";
import Modal from "@/components/Modal";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

type PostNewProps = {
  open: boolean;
  handleClose: () => void;
};

const PostNew = ({ open, handleClose }: PostNewProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const dispatch = useAppDispatch();

  const draft = useAppSelector(selectDraftListing);

  const [status, setStatus] = useState<ListingStatus>(ListingStatus.Available);

  const [postNewListing, { data, error, isLoading, isError, isSuccess }] =
    usePostNewListingMutation();

  const steps = [
    {
      label: "Facts",
      altLabel: "Fill some facts about the listing",
      content: <FactsPanel />,
    },

    {
      label: "Images",
      altLabel: "Upload images",
      content: <ImagesPanel />,
    },
    {
      label: "Overview",
      altLabel: "Wrap things up",
      content: <OverviewPanel />,
    },
  ];

  const maxSteps = steps.length;
  //handle next btn
  const handleNext = () => {
    //check required fields//index/step 0
    if (activeStep === 0) {
      const isDataValid =
        draft.location && draft.bathrooms && draft.bedrooms && draft.price;

      if (!isDataValid) {
        return Toast.show({
          type: "error",
          text1: "Fields with '*' are required",
        });
      }
    }
    //check required fields//index 1
    if (activeStep === 1 && !draft.listingImages?.length) {
      return Toast.show({
        type: "error",
        text1: "Please add at least one image",
      });
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  //handle back btn
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  //handle reset
  const handleReset = () => {
    dispatch(resetDraft());
    setActiveStep(0);
  };

  //submit data
  const saveListing = async (status: ListingStatus) => {
    //status for controlling loading btn state
    setStatus(status);

    //last step fields validation
    if (!draft.overview) {
      return Toast.show({
        type: "error",
        text1: "Please add a brief overview",
      });
    }

    const formData = new FormData();
    //append listing images
    //Important: don't forget to check if file type in files is correct(eg format image/jpeg)//else Network error or nothing or multer will return files a stringified array
    //compress and append files//pause execution until finished
    await Promise.all(
      draft.listingImages?.map(async (img) => {
        const uri = await compressImage(img.uri);

        formData.append("files", { ...img, uri } as unknown as File); //if value is not a string | Blob/File, it will be converted to string

        return uri;
      }) || []
    );

    //append the rest
    Object.keys(draft).forEach((field, i) => {
      //skip listing images
      if (field === "listingImages") return;

      let value = draft[field as keyof typeof draft];
      //stringify non-string values
      if (
        field === "location" ||
        field === "policies" ||
        field === "amenities"
      ) {
        value = JSON.stringify(value);
      }
      formData.append(field, value as string);
    });

    formData.append("listingStatus", status);

    await postNewListing(formData);
  };

  //feedback
  useEffect(() => {
    if (isError) Toast.show({ type: "error", text1: error as string });

    if (isSuccess) Toast.show({ type: "success", text1: data?.message });

    const timeoutId = setTimeout(() => {
      //on success//clear draft & reset to step 1
      if (isSuccess) handleReset();
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [isError, isSuccess, data]);

  return (
    <Modal visible={open} onDismiss={handleClose} style={{ padding: 20 }}>
      <View className="relative pb-24   h-full">
        <Text className="text-xl font-bold mb-3">Post a new listing</Text>

        <List.Item
          //descriptionStyle={{}}
          // descriptionNumberOfLines={2} //default 2
          //onPress={() => router.push("/profile/view")}
          titleStyle={{}}
          title={
            <Text className="text-lg font-semibold">
              {steps[activeStep].label}
            </Text>
          }
          description={
            <Text className="text-sm text-gray-muted ">
              {steps[activeStep].altLabel}
            </Text>
          } // string | React.ReactNode
          left={() => (
            <Avatar.Icon
              size={40}
              icon={({ size, color }) => <Text> {activeStep + 1} </Text>}
              color="#10b981"
              style={{ backgroundColor: "#e2e8f0" }}
            />
          )}
          // right={() => <Text>{item.rating.toFixed(1)}</Text>}
        />

        {steps[activeStep].content}

        <View className="p-2 absolute bottom-5 flex-row justify-between  w-full border-gray-light bg-white  border-t">
          <Button
            mode="outlined"
            onPress={handleBack}
            disabled={activeStep === 0}
            textColor={colors.gray.muted}
          >
            Back
          </Button>

          {activeStep === maxSteps - 1 ? (
            <View className="gap-x-3 flex-row">
              <Button
                mode="contained"
                disabled={isLoading}
                loading={status === ListingStatus.Draft && isLoading}
                onPress={() => {
                  saveListing(ListingStatus.Draft);
                }}
                className="bg-gray-dark"
                
              >
                Save draft
              </Button>
              <Button
                mode="contained"
                disabled={isLoading}
                loading={status === ListingStatus.Available && isLoading}
                onPress={() => {
                  saveListing(ListingStatus.Available);
                }}
              >
                Post
              </Button>
            </View>
          ) : (
            <Button mode="contained" onPress={handleNext}>
              Next
            </Button>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default PostNew;
