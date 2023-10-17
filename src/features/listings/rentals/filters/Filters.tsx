import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import {
  Button,
  Checkbox,
  Divider,
  IconButton,
  Modal,
  Portal,
} from "react-native-paper";

import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";

import { router } from "expo-router";

import { ILocation } from "@/types/listing";

import { Controller, useForm, useWatch } from "react-hook-form";
import { FlatList } from "react-native-gesture-handler";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { AMENITIES } from "../../mylistings/post/FactsPanel";
import {
  addToFilters,
  resetFilters,
  selectSearchFilters,
} from "../rentalSlice";
import { TAmenitiesInputs, TFactInputs } from "@/types/react-hook-form";
import LocationPicker from "@/components/LocationPicker";
import PriceRange from "@/components/PriceRange";
import Bedrooms from "@/components/Bedrooms";
import Bathrooms from "@/components/Bathrooms";
import { AntDesign } from "@expo/vector-icons";
import colors from "@/constants/colors";

type FiltersDrawerProps = {
  total: number;
  open: boolean;
  handleClose: () => void;
  isFetching: boolean;
};

const Filters = ({
  open,
  handleClose,
  total,
  isFetching,
}: FiltersDrawerProps) => {
  const filters = useAppSelector(selectSearchFilters);

  const dispatch = useAppDispatch();

  const [location, setLocation] = useState(
    filters.location || ({} as ILocation)
  );

  const [priceRange, setPriceRange] = useState(
    filters.priceRange || [100, 1000000]
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
    watch,
    register,
    reset: resetForm,
    getValues,
  } = useForm<TFactInputs>({
    defaultValues: {
      bedrooms: filters.bedrooms || "",
      bathrooms: filters.bathrooms || "",
      amenities: {
        water: filters.amenities?.water || false,
        borehole: filters.amenities?.borehole || false,
        parking: filters.amenities?.parking || false,
        wifi: filters.amenities?.wifi || false,
        gym: filters.amenities?.gym || false,
        pool: filters.amenities?.pool || false,
        cctv: filters.amenities?.cctv || false,
        securityLights: filters.amenities?.securityLights || false,
        watchman: filters.amenities?.watchman || false,
      },
    },
  });

  const formValues = useWatch({ control }); //all fields//use name: "field"| ["field1"]

  // //update filters in store
  useEffect(() => {
    const entries = formValues as TFactInputs;
    dispatch(
      addToFilters({
        location,
        priceRange,
        ...entries, //form values
      })
    );
  }, [formValues, location, priceRange]);

  //clear filters and close
  const handleReset = () => {
    dispatch(resetFilters());
    handleClose();
  };

  const DATA = [
    {
      label: "Location",
      content: <LocationPicker setLocation={setLocation} location={location} />,
    },
    {
      label: "Price Range",
      content: (
        <PriceRange priceRange={priceRange} setPriceRange={setPriceRange} />
      ),
    },
    {
      label: "Bedrooms",
      content: (
        <Bedrooms defaultBedrooms={filters.bedrooms!} resetForm={resetForm} />
      ),
    },
    {
      label: "Bathrooms",
      content: (
        <Bathrooms defaultBathrooms={filters.bedrooms!} resetForm={resetForm} />
      ),
    },
  ];

  return (
    <Portal>
      <Modal
        visible={open}
        onDismiss={handleClose}
        //dismissable //Determines whether clicking outside the dialog dismiss it.
        style={{
          justifyContent: "flex-start",
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          backgroundColor: "#fff",
          marginTop: 30,
        }} //Style for the wrapper of the modal. Use this prop to change the default wrapper style or to override safe area insets with marginTop and marginBottom.
        //contentContainerStyle//Style for the content of the modal
        //dismissableBackButton //Determines whether clicking Android hardware back button dismiss dialog.
      >
        <View className="relative h-full  pb-[70]">
          <View className="flex-row   p-3 gap-x-1 items-center">
            <Pressable onPress={handleClose} className="">
              <AntDesign name="close" size={15} color="black" />
            </Pressable>
            <Text className=" font-bold px-2">Filters</Text>
          </View>
          <Divider />

          <FlatList
            className="px-4 bg-white"
            //showsVerticalScrollIndicator={false}
            stickyHeaderIndices={[0]}
            data={DATA}
            ListHeaderComponent={<View className="bg-white "></View>}
            keyExtractor={(item) => item.label}
            renderItem={({ item }) => {
              return (
                <View className="py-2">
                  <Text className="text-lg mb-2">{item.label}</Text>
                  {item.content}
                </View>
              );
            }}
            ListFooterComponent={
              <View className="">
                <Text className="text-lg my-2">Amenities</Text>
                {AMENITIES.map((item, i) => {
                  const key = item.key as keyof TAmenitiesInputs;
                  return (
                    <View
                      className="flex-row items-center justify-between "
                      key={key + i}
                    >
                      <Text className="">{item.value}</Text>

                      <Controller
                        name={`amenities.${key}`}
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <Checkbox
                            status={value ? "checked" : "unchecked"}
                            onPress={() => onChange(!watch(`amenities.${key}`))}
                          />
                        )}
                      />
                    </View>
                  );
                })}
              </View>
            }
          />
          <View className="px-4  absolute bottom-0 w-full h-[60] border border-gray-disabled justify-between flex-row items-center">
            <Button
              className="rounded-md"
              icon=""
              mode="outlined"
              //compact
              onPress={handleReset}
              //uppercase //boolean//Make the label text uppercased
              textColor={colors.red.DEFAULT}
            >
              Reset filters
            </Button>
            <Button
              className="bg-gray-dark rounded-md"
              icon=""
              mode="contained"
              loading={isFetching}
            >
              {isFetching ? "" : `Show ${total} results`}
            </Button>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

export default Filters;
