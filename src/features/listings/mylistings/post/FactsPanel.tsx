import React, { useEffect, useState } from "react";
import { Text, View, ScrollView, FlatList } from "react-native";

import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";

import { ILocation } from "@/types/listing";

import { Controller, useForm, useWatch } from "react-hook-form";
import { Button, Checkbox } from "react-native-paper";
import { router } from "expo-router";
import { addToDraft, selectDraftListing } from "../listingSlice";
import { TAmenitiesInputs, TFactInputs } from "@/types/react-hook-form";
import LocationPicker from "@/components/LocationPicker";
import Policies from "@/components/Policies";
import Bedrooms from "@/components/Bedrooms";
import Bathrooms from "@/components/Bathrooms";
import ListingPrice from "@/components/ListingPrice";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
export const AMENITIES = [
  { key: "water", value: "Water 7 days/week" },
  { key: "borehole", value: "Borehole" },
  { key: "parking", value: "Spacious parking" },
  { key: "wifi", value: "Wifi" },
  { key: "gym", value: "Gym" },
  { key: "pool", value: "Swimming pool" },
  { key: "cctv", value: "CCTV" },
  { key: "securityLights", value: "Security lights" },
  { key: "watchman", value: "Watchman/security guard" },
];

const FactsPanel = () => {
  const draft = useAppSelector(selectDraftListing);
  const dispatch = useAppDispatch();

  const [location, setLocation] = useState(draft.location || ({} as ILocation));

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
    watch,
    register,
    reset: resetForm,
    getValues, //returns
  } = useForm<TFactInputs>({
    defaultValues: {
      bedrooms: draft.bedrooms || "",
      bathrooms: draft.bathrooms || "",
      price: draft.price || "",
      policies: draft.policies || [],
      amenities: {
        water: draft.amenities?.water || false,
        borehole: draft.amenities?.borehole || false,
        parking: draft.amenities?.parking || false,
        wifi: draft.amenities?.wifi || false,
        gym: draft.amenities?.gym || false,
        pool: draft.amenities?.pool || false,
        cctv: draft.amenities?.cctv || false,
        securityLights: draft.amenities?.securityLights || false,
        watchman: draft.amenities?.watchman || false,
      },
    },
  });

  const formValues = useWatch({ control }); //all fields//use name: "field"| ["field1"]

  // //update draft in store
  useEffect(() => {
    const entries = formValues as TFactInputs;
    dispatch(
      addToDraft({
        location,
        ...entries, //form values
      })
    );
  }, [formValues, location]);

  const DATA = [
    {
      label: "Location",
      content: <LocationPicker setLocation={setLocation} location={location} />,
    },
    {
      label: "Bedrooms",
      content: (
        <Bedrooms defaultBedrooms={draft.bedrooms!} resetForm={resetForm} />
      ),
    },
    {
      label: "Bathrooms",
      content: (
        <Bathrooms defaultBathrooms={draft.bathrooms!} resetForm={resetForm} />
      ),
    },
    {
      label: "Rent (per month)",
      content: <ListingPrice control={control} />,
    },
    {
      label: "Policies",
      content: (
        <Policies defaultPolicies={draft.policies!} resetForm={resetForm} />
      ),
    },
  ];

  return (
    <View className="relative flex-1 p-2">
      <FlatList
        className=" bg-white"
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
        data={DATA}
        ListHeaderComponent={<View></View>}
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
    </View>
  );
};

export default FactsPanel;
