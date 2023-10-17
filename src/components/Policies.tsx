import { TReset } from "@/types/react-hook-form";
import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import {
  Chip,
  HelperText,
  IconButton,
  List,
  TextInput,
} from "react-native-paper";

type PoliciesProps = {
  resetForm: TReset;
  defaultPolicies: string[];
};
const Policies = ({ resetForm, defaultPolicies }: PoliciesProps) => {
  const [policies, setPolicies] = useState<string[]>(defaultPolicies || []);

  const [policy, setPolicy] = useState("");

  useEffect(() => {
    resetForm({ policies });
  }, [policies]);

  return (
    <View>
      <TextInput
        //keyboardType="number-pad"
        dense
        mode="outlined"
        //dense//Sets min height with densed layout//adds paddingVertical
        placeholder="eg. No smoking"
        //label="Enter policy"
        value={policy}
        onChangeText={(text) => setPolicy(text)}
        right={
          <TextInput.Icon
            icon="plus"
            onPress={() => {
              policy && setPolicies((prev) => [...prev, policy]);
              setPolicy("");
            }}
          />
        }
      />
      <HelperText type="info" visible={true}>
        Enter a policy and tap the + sign
      </HelperText>
      <View className="flex-col content-evenly flex-wrap justify-evenly">
        {policies.map((pol, i) => {
          return (
            <View key={i}>
              <List.Item
                className="   h-13 p-0"
                title={
                  <Text className="">
                    {i + 1}. {pol}
                  </Text>
                }
                //left={() => <Text>{i + 1} </Text>}
                right={() => (
                  <IconButton
                    icon={({ size, color }) => (
                      <FontAwesome name="close" size={15} color="black" />
                    )}
                    className="bg-gray/20 "
                    //iconColor="#000"
                    //mode="outlined"
                    //containerColor=
                    // disabled={item._id === currentId && (isLoading || isRLoading)}
                    size={12}
                    onPress={() =>
                      setPolicies(policies.filter((value) => value !== pol))
                    }
                  />
                )}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default Policies;
