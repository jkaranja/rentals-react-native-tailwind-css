import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { Chip, useTheme } from "react-native-paper";

import colors from "@/constants/colors";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { usePathname } from "expo-router";
import { TReset } from "@/types/react-hook-form";

const BEDROOMS = [
  "",
  "Bedsitter",
  "1 Bedroom",
  "2 Bedrooms",
  "3 Bedrooms",
  "4+ Bedrooms",
  "Single",
];

type BedroomsProps = {
  bedrooms: string;
  setBedrooms: React.Dispatch<React.SetStateAction<string>>;
};

const BedroomsBar = ({ bedrooms, setBedrooms }: BedroomsProps) => {
  const theme = useTheme();

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row content-evenly flex-wrap  gap-2"
      >
        {BEDROOMS.map((bedroom, i) => {
          return (
            <Chip
              key={i}
              mode="flat" //'flat'(default) | 'outlined'
              selected={bedroom === bedrooms} //boolean//Whether chip is selected.
              showSelectedCheck={false}
              selectedColor={bedroom === bedrooms ? "#fff" : colors.gray.dark} //Whether to style the chip color as selected.
              style={{
                backgroundColor:
                  bedroom === bedrooms
                    ? colors.emerald.DEFAULT
                    : theme.colors.surfaceDisabled,
              }} ///sec/primaryContainer //surfaceDisabled//inverseOnSurf//Style of chip
              onPress={() => setBedrooms(bedroom)}
            >
              {bedroom === "" ? "All" : bedroom}
            </Chip>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default BedroomsBar;
