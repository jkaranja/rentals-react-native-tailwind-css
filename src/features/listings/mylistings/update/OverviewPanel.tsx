import React, { useEffect, useState } from "react";
import { Text, View, ScrollView, FlatList } from "react-native";

import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";

import { ILocation } from "@/types/listing";

import { Controller, useForm, useWatch } from "react-hook-form";
import { Button, Checkbox, HelperText, TextInput } from "react-native-paper";
import { router } from "expo-router";
import {
  addToDraft,
  addToUpdated,
  selectDraftListing,
  selectUpdatedListing,
} from "../listingSlice";

const OverviewPanel = () => {
  const updated = useAppSelector(selectUpdatedListing);
  const dispatch = useAppDispatch();

  type Inputs = {
    overview: string;
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
  } = useForm<Inputs>({
    defaultValues: {
      overview: updated.overview || "",
    },
    mode: "onChange",
  });

  // //update draft in store
  useEffect(() => {
    // Callback version of watch. Optimized for performance. Render at hook level instead of whole app  It's your responsibility to unsubscribe when done.
    const subscription = watch((data) => {
      //console.log(data, name, type); 2nd param: { name, type }//name=name of field that changed, type= event type eg 'change'
      const values = data as Inputs;
      dispatch(
        addToUpdated({
          ...values, //form values as an object
          //below handled in input field in register field
          // price: price.replace(/[^0-9]/g, "") || "0", //only numbers, default is 0,
          // brokerFee: brokerFee.replace(/[^0-9]/g, "") || "0", //only numbers, default is 0
        })
      );
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <View className="flex-1 p-2">
      <Text className="mb-3">Almost done. Let's wrap things up.</Text>

      <Text className="mb-2">
        Write a brief overview of the listing (Add any unique attribute or
        additional details)
      </Text>
      <Controller
        name="overview"
        control={control}
        rules={{
          required: "Overview is required",
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            multiline //=boolean//whether the input can have multiple lines.
            numberOfLines={2}
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
            error={Boolean(errors.overview?.message)} //Whether to style the TextInput with error style.
            //label="Message"
          />
        )}
      />
      <HelperText type="error" visible={Boolean(errors.overview?.message)}>
        {errors.overview?.message}
      </HelperText>
    </View>
  );
};

export default OverviewPanel;
