import React, { useEffect, useState } from "react";
import { Text, View, ScrollView, FlatList } from "react-native";

import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";

import { ILocation } from "@/types/listing";

import { Controller, useForm, useWatch } from "react-hook-form";
import { Button, Checkbox } from "react-native-paper";
import { router } from "expo-router";
import { addToUpdated, selectUpdatedListing } from "../listingSlice";
import { TAmenitiesInputs, TFactInputs } from "@/types/react-hook-form";
import LocationPicker from "@/components/LocationPicker";
import Policies from "@/components/Policies";
import Bedrooms from "@/components/Bedrooms";
import Bathrooms from "@/components/Bathrooms";
import ListingPrice from "@/components/ListingPrice";

import { AMENITIES } from "../post/FactsPanel";

const FactsPanel = () => {
  const updated = useAppSelector(selectUpdatedListing);
  const dispatch = useAppDispatch();

  const [location, setLocation] = useState(
    updated.location || ({} as ILocation)
  );

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
      bedrooms: updated.bedrooms || "",
      bathrooms: updated.bathrooms || "",
      price: updated.price || "",
      policies: updated.policies || [],
      amenities: {
        water: updated.amenities?.water || false,
        borehole: updated.amenities?.borehole || false,
        parking: updated.amenities?.parking || false,
        wifi: updated.amenities?.wifi || false,
        gym: updated.amenities?.gym || false,
        pool: updated.amenities?.pool || false,
        cctv: updated.amenities?.cctv || false,
        securityLights: updated.amenities?.securityLights || false,
        watchman: updated.amenities?.watchman || false,
      },
    },
  });
  const formValues = useWatch({ control }); //all fields//use name: "field"| ["field1"]

  // //update updated in store
  useEffect(() => {
    const entries = formValues as TFactInputs;
    dispatch(
      addToUpdated({
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
        <Bedrooms defaultBedrooms={updated.bedrooms!} resetForm={resetForm} />
      ),
    },
    {
      label: "Bathrooms",
      content: (
        <Bathrooms
          defaultBathrooms={updated.bathrooms!}
          resetForm={resetForm}
        />
      ),
    },
    {
      label: "Rent (per month)",
      content: <ListingPrice control={control} />,
    },
    {
      label: "Policies",
      content: (
        <Policies defaultPolicies={updated.policies!} resetForm={resetForm} />
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
