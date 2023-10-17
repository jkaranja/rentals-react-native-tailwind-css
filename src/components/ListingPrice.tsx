
import { TControl } from "@/types/react-hook-form";
import React from "react";
import { Controller } from "react-hook-form";
import { View } from "react-native";
import { TextInput } from "react-native-paper";

type ListingPriceProps = {
  control: TControl;
};

const ListingPrice = ({ control }: ListingPriceProps) => {
  return (
    <View className="">
      <Controller
        name="price"
        control={control}
        rules={
          {
            // required: "Username is required",
          }
        }
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            label="Ksh"
            keyboardType="number-pad"
            dense
            mode="outlined"
            onBlur={onBlur}
            onChangeText={(text) =>
              onChange(text.replace(/[^0-9]/g, "") || "0")
            }
            value={value}
            //left={<TextInput.Affix text="Ksh" />}
            // error={Boolean(errors.username?.message)} //Whether to style the TextInput with error style.
          />
        )}
      />
    </View>
  );
};

export default ListingPrice;
