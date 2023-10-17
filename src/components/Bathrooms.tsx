import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Chip } from "react-native-paper";

import colors from "@/constants/colors";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { usePathname } from "expo-router/src/hooks";
import { TReset } from "@/types/react-hook-form";

type BathroomsProps = {
  resetForm: TReset;
  defaultBathrooms: string;
};


const Bathrooms = ({ resetForm, defaultBathrooms }: BathroomsProps) => {
  const pathname = usePathname();

 const [bathrooms, setBathrooms] = useState<string>(defaultBathrooms || "");


  const BATHROOMS = [
    "1 Bathroom",
    "2 Bathrooms",
    "3 Bathrooms",
    "4+ Bathrooms",
  ];
  pathname === "/filters" && BATHROOMS.unshift("");

  useEffect(() => {
    if (!bathrooms) return;

    resetForm({ bathrooms });
  }, [bathrooms]);

  return (
    <View className="flex-row content-evenly flex-wrap gap-2 ">
      {BATHROOMS.map((bathroom, i) => {
        const label = parseInt(bathroom) ? parseInt(bathroom) : bathroom;

        return (
          <Chip
            key={i}
            mode="flat" //'flat'(default) | 'outlined'
            selected={bathroom === bathrooms}
            selectedColor={bathroom === bathrooms ? "#fff" : "#000"} //Whether to style the chip color as selected.
            //showSelectedCheck=boolean//true//shows check icon if icon prop is not provided
            onPress={() => setBathrooms(bathroom)}
            style={
              bathroom === bathrooms
                ? { backgroundColor: colors.emerald.DEFAULT }
                : {}
            } //Style of chip
          >
            {label === 4 ? "4+" : label === "" ? "Any" : label}
          </Chip>
        );
      })}
    </View>
  );
};

export default Bathrooms;
