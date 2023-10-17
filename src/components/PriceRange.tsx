import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { List, TextInput } from "react-native-paper";

import MultiSlider from "@ptomasroos/react-native-multi-slider";
import colors from "@/constants/colors";

type PriceRangeProps = {
  priceRange: Array<number>;
  setPriceRange: React.Dispatch<React.SetStateAction<number[]>>;
};

const PriceRange = ({ priceRange, setPriceRange }: PriceRangeProps) => {
  return (
    <View>
      <View className="flex-row gap-3 flex-wrap justify-between content-evenly items-center">
        <TextInput
          mode="outlined"
          keyboardType="number-pad"
          dense
          placeholder="0"
          //error={false}//Whether to style the TextInput with error style.
          //label="Username"
          value={priceRange[0].toString()}
          onChangeText={(text) =>
            setPriceRange((prev) => [parseInt(text), prev[1]])
          }
          left={<TextInput.Affix text="Ksh" />}
        />
        <Text>To</Text>
        <TextInput
          keyboardType="number-pad"
          dense
          mode="outlined"
          //dense//Sets min height with densed layout//adds paddingVertical
          placeholder="0"
          // label="Username"
          value={priceRange[1].toString()}
          onChangeText={(text) =>
            setPriceRange((prev) => [prev[0], parseInt(text)])
          }
          left={<TextInput.Affix text="Ksh" />}
        />
      </View>

      <View className=" items-center ">
        <MultiSlider
          values={[priceRange[0], priceRange[1]]} //Prefixed values of the slider.
          sliderLength={280} //Length of the slider//default: 280
          onValuesChange={(values) => setPriceRange(values)} //Callback when the value changes
          touchDimensions={{
            height: 40,
            width: 40,
            borderRadius: 20,
            slipDisplacement: 40,
          }}
          //enableLabel//function
          min={100} //Minimum value available in the slider
          max={1000000} //Maximum value available in the slider
          allowOverlap={false} //Allow the overlap within the cursors.
          minMarkerOverlapDistance={10} //determine the closest two markers can come to each other
          selectedStyle={{
            backgroundColor: colors.emerald.DEFAULT, //Styles for selected range track
          }}
          unselectedStyle={{ backgroundColor: colors.gray.disabled }} //Styles for unselected track
          // pressedMarkerStyle={{}}
          markerStyle={{ backgroundColor: colors.emerald.DEFAULT }} //Styles for markers
          // trackStyle={{ }}
        />
      </View>
    </View>
  );
};

export default PriceRange;
