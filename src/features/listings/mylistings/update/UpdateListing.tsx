import colors from "@/constants/colors";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";

import { Slot, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import {
  ActivityIndicator,
  Avatar,
  Button,
  Dialog,
  List,
  Portal,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import {
  addToUpdated,
  resetDraft,
  resetUpdated,
  selectDraftListing,
  selectUpdatedListing,
} from "../listingSlice";
import { ListingStatus } from "@/types/listing";
import {
  usePostNewListingMutation,
  useUpdateListingMutation,
} from "../listingApiSlice";
import FactsPanel from "./FactsPanel";
import ImagesPanel from "./ImagesPanel";
import OverviewPanel from "./OverviewPanel";
import { EvilIcons } from "@expo/vector-icons";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetListingQuery } from "../../view/viewApiSlice";
import compressImage from "@/utils/compressImage";
import Modal from "@/components/Modal";

type UpdateListingProps = {
  open: boolean;
  handleClose: () => void;
  id: string;
};

const UpdateListing = ({ open, handleClose, id }: UpdateListingProps) => {
  const [activeStep, setActiveStep] = useState(0);

  const dispatch = useAppDispatch();

  const updated = useAppSelector(selectUpdatedListing);

  /* ----------------------------------------
   FETCH LISTING
   ----------------------------------------*/

  const {
    data: listing,
    isFetching,
    isSuccess: isFetched,
    isError: isFetchErr,
    error: fetchErr,
  } = useGetListingQuery(id ?? skipToken, {
    //pollingInterval: 15000,
    //refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const [updateListing, { data, error, isLoading, isError, isSuccess }] =
    useUpdateListingMutation();

  const steps = [
    {
      label: "Facts",
      altLabel: "Update facts about the listing",
      content: <FactsPanel />,
    },

    {
      label: "Images",
      altLabel: "Update images",
      content: <ImagesPanel />,
    },
    {
      label: "Overview ",
      altLabel: "Wrap things up",
      content: <OverviewPanel />,
    },
  ];

  const maxSteps = steps.length;
  //handle next btn
  const handleNext = () => {
    //check required fields

    if (activeStep === 0) {
      const isDataValid =
        updated.location &&
        updated.bathrooms &&
        updated.bedrooms &&
        updated.price;
      if (!isDataValid) {
        return Toast.show({
          type: "error",
          text1: "Fields with '*' are required",
        });
      }
    }

    //either we have new images or the length of removed and uploaded can't be same
    if (
      activeStep === 1 &&
      !(
        updated.removedImages?.length !== updated.listingImages?.length ||
        updated.newImages?.length
      )
    ) {
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
    dispatch(resetUpdated());
    handleClose();
  };

  //submit data
  const handleUpdateListing = async () => {
    //last step fields validation

    if (!updated.overview) {
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
      updated.newImages?.map(async (img) => {
        const uri = await compressImage(img.uri);

        formData.append("files", { ...img, uri } as unknown as File); //if value is not a string | Blob/File, it will be converted to string

        return uri;
      }) || []
    );

    //append the rest
    Object.keys(updated).forEach((field, i) => {
      //skip appending new images + current listing images
      if (field === "listingImages" || field === "newImages") return;

      let value = updated[field as keyof typeof updated];
      //stringify non-string values
      if (
        field === "location" ||
        field === "policies" ||
        field === "amenities" ||
        field === "removedImages"
      ) {
        value = JSON.stringify(value);
      }
      formData.append(field, value as string);
    });

    await updateListing({ id, data: formData });
  };

  //update store with listing
  useEffect(() => {
    if (!listing) return;

    dispatch(resetUpdated()); //reset updated state//could have eg newImages or removedImages from another listing
    //dispatch is synchronous
    dispatch(addToUpdated(listing));
  }, [listing]);

  //feedback
  useEffect(() => {
    if (isError) Toast.show({ type: "error", text1: error as string });

    if (isSuccess) Toast.show({ type: "success", text1: data?.message });

    const timeoutId = setTimeout(() => {
      //on success//close & //clear updated from store
      if (isSuccess) handleReset();
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [isError, isSuccess, data]);

  if (!Object.keys(updated).length)
    return (
      <Modal visible={open} onDismiss={handleClose}>
        <ActivityIndicator color={colors.gray.light} size={35} />
      </Modal>
    );

  return (
    <Modal visible={open} onDismiss={handleClose} style={{ padding: 20 }}>
      <View className="relative pb-24   h-full">
        <Text className="text-xl font-bold mb-3">Update listing</Text>

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
              <Button mode="contained" onPress={handleReset}>
                Discard changes
              </Button>
              <Button
                mode="contained"
                disabled={isLoading}
                loading={isLoading}
                onPress={handleUpdateListing}
              >
                Update
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

export default UpdateListing;
