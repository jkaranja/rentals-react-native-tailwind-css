import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Chip } from "react-native-paper";

import colors from "@/constants/colors";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { usePathname } from "expo-router";
import { TReset } from "@/types/react-hook-form";

type BedroomsProps = {
  resetForm: TReset; //UseFormReset accepts a generic type =  type of your inputs i.e type passed to useForm hook
  defaultBedrooms: string;
};

const Bedrooms = ({ resetForm, defaultBedrooms }: BedroomsProps) => {
  const pathname = usePathname();

  const [bedrooms, setBedrooms] = useState<string>(defaultBedrooms || "");

  const BEDROOMS = [
    "Single",
    "Bedsitter",
    "1 Bedroom",
    "2 Bedrooms",
    "3 Bedrooms",
    "4+ Bedrooms",
  ];
  pathname === "/filters" && BEDROOMS.unshift("");

  useEffect(() => {
    if (!bedrooms) return;

    resetForm({ bedrooms });
  }, [bedrooms]);

  return (
    <View className="flex-row content-evenly flex-wrap gap-2 ">
      {BEDROOMS.map((bedroom, i) => {
        const label = parseInt(bedroom) ? parseInt(bedroom) : bedroom;
        return (
          <Chip
            key={i}
            mode="flat" //'flat'(default) | 'outlined'
            //avatar= React.ReactNode//when not using icon
            //closeIcon//Icon to display as the close button for the Chip. The icon appears only when the onClose prop is specified.
            selected={bedroom === bedrooms} //boolean//Whether chip is selected.
            selectedColor={bedroom === bedrooms ? "#fff" : "#000"} //Whether to style the chip color as selected.
            //showSelectedCheck={true}//deprecated/use selected //=boolean//true//shows check icon if icon prop is not provided
            //disabled=boolean//false//Whether the chip is disabled.
            //rippleColor
            //onPress
            //onClose={()=>{}}//The close button appears only when this prop is specified.
            //compact//boolean//Sets smaller horizontal paddings 12dp around label, when there is only label.
            //icon="information" //type: IconSource
            //elevated=boolean//false
            //textStyle//Style of chip's text
            style={
              bedroom === bedrooms
                ? { backgroundColor: colors.emerald.DEFAULT }
                : {}
            } //Style of chip
            onPress={() => setBedrooms(bedroom)}
          >
            {label === 4 ? "4+" : label === "" ? "Any" : label}
          </Chip>
        );
      })}
    </View>
  );
};

export default Bedrooms;
