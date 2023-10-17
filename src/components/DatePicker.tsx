import { useState } from "react";

import { Pressable, Text, View } from "react-native";

import { FontAwesome } from "@expo/vector-icons";
import { Button, Card } from "react-native-paper";

import clsx from "clsx";
import { addDays, addHours, format, startOfDay } from "date-fns";
import { FlatList, ScrollView } from "react-native-gesture-handler";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      //width: 250,
    },
  },
};

const DATES = [...Array(8)].map((_, i) =>
  addDays(addHours(startOfDay(new Date()), 7), i)
);

type DatePickerProps = {
  datesPicked: Date[];
  handleDateClick: (arg: Date) => void;
};

const DatePicker = ({ handleDateClick, datesPicked }: DatePickerProps) => {
  const [time, setTime] = useState(0);

  const handleTimePress = (value: number) => {
    setTime(value);
  };

  return (
    <View>
      <FlatList
        horizontal
        data={DATES || []}
        //showsHorizontalScrollIndicator={}
        // ListHeaderComponent={<View></View>}
        renderItem={({ item: date, index }: { item: Date; index: number }) => (
          <View className="py-4 px-2 ">
            <Card
              className="min-w-[150] rounded-sm bg-white"
              //elevation={2}
              // contentStyle={{}}
              // onPress={}
             mode="outlined" //d='elevated'
            >
              <Pressable
                onPress={() => {
                  setTime(0);
                  handleDateClick(date);
                }}
                className={clsx({
                  "bg-gray-dark": datesPicked.includes(date),
                })}
              >
                <Card.Title
                  title={
                    <Text
                      className={clsx("text-lg font-bold", {
                        "text-white": datesPicked.includes(date),
                      })}
                    >
                      {format(date, "E")}
                    </Text>
                  }
                  subtitle={
                    <Text
                      className={clsx({
                        "text-white": datesPicked.includes(date),
                      })}
                    >
                      {format(date, "dd MMM")}
                    </Text>
                  }
                  //left={LeftContent}
                />
              </Pressable>

              {datesPicked.includes(date) && (
                <Card.Actions>
                  <View className="max-h-[200]">
                    <FlatList
                      //horizontal
                      data={[...Array(14)].map((_, i) => ({
                        _id: String(i),
                        hr: i,
                      }))}
                      //showsVerticalScrollIndicator={false}
                      renderItem={({
                        item,
                        index,
                      }: {
                        item: { _id: string; hr: number };
                        index: number;
                      }) => (
                        <Button
                          icon={() => (
                            <FontAwesome
                              name="clock-o"
                              size={24}
                              color="black"
                            />
                          )}
                          key={item._id}
                          onPress={() => handleTimePress(item.hr)}
                          mode={item.hr === time ? "contained" : "outlined"}
                          compact
                          className="my-1"
                        >
                          {format(addHours(date, item.hr), "hh:mm a")}
                        </Button>
                      )}
                      keyExtractor={(item) => item._id}
                    />
                  </View>

                  {/* <View className="max-h-[100]">
                    <ScrollView>
                      {[...Array(14)].map((_, i) => (
                        <Button
                          icon={() => (
                            <FontAwesome
                              name="clock-o"
                              size={24}
                              color="black"
                            />
                          )}
                          key={i}
                          onPress={() => handleTimePress(i)}
                          mode={i === time ? "contained" : "outlined"}
                          compact
                          className="mx-2"
                        >
                          {format(addHours(date, i), "hh:mm a")}
                        </Button>
                      ))}
                    </ScrollView>
                  </View> */}
                </Card.Actions>
              )}
            </Card>
          </View>
        )}
        keyExtractor={(item, index) => String(index)}
        // ListFooterComponent={<View></View>}
      />
    </View>
  );
};

export default DatePicker;
