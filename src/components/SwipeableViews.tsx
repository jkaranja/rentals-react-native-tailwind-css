import { Text } from "react-native";
import { IMAGE_ROOT } from "@/constants/paths";
import { IImage } from "@/types/file";
import { Image } from "expo-image";
import { useRef, useState } from "react";
import { Pressable, View, useWindowDimensions } from "react-native";
// import Share from "react-native-share";
import Carousel, { Pagination } from "react-native-snap-carousel";

import { FontAwesome } from "@expo/vector-icons";
import { IconButton } from "react-native-paper";

type ListingItemProps = {
  images: IImage[];
  imageStyle?: {};
  startIcon?: any;
  endIcon?: any;
  startIconColor?: string;
  endIconColor?: string;
  endButtonPress?: () => void;
  startButtonPress?: () => void;
  handlePress?: () => void;
  offset?: number;
} & View["props"];

const SwipeableViews = ({
  images,
  startIcon,
  endIcon,
  startIconColor,
  endIconColor,
  endButtonPress,
  startButtonPress,
  offset = 0,
  imageStyle,
  handlePress,
  ...props
}: ListingItemProps) => {
  const dimensions = useWindowDimensions();

  const carouselRef = useRef<Carousel<any>>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <Pressable
      className="h-[140]"
      onPress={handlePress ? handlePress : () => {}}
      {...props}
    >
      <View className="w-full relative top-0">
        <View className="absolute w-full  z-10 flex-row justify-between">
          {startIcon && (
            <IconButton
              icon={({ size, color }) => (
                <FontAwesome name={startIcon} size={17} color={color} />
              )}
              className="bg-gray/20 "
              iconColor={startIconColor}
              //mode="outlined"
              //containerColor=
              // disabled={item._id === currentId && (isLoading || isRLoading)}
              size={12}
              onPress={startButtonPress ? startButtonPress : () => {}}
            />
          )}

          {endIcon && (
            <IconButton
              className="bg-gray/20 "
              icon={({ size, color }) => (
                <FontAwesome name={endIcon} size={15} color={color} />
              )}
              iconColor={endIconColor}
              size={8} //default=24
              onPress={endButtonPress ? endButtonPress : () => {}}
            />
          )}
        </View>
        <Carousel
          vertical={false} //Layout slides vertically instead of horizontally//default false//but prop is required
          autoplay={true}
          ///scrollEnabled={true}//default//When false, the view cannot be scrolled via touch interaction
          //autoplayDelay={1000}
          autoplayInterval={6000} //default 3000
          layout="default" //'default', 'stack' and 'tinder'.//Define the way items are rendered and animated.
          ref={carouselRef}
          data={images} //Array of items to loop on
          renderItem={({ item: img, index }) => (
            <View className="relative grow">
              <Image
                className="h-full w-full"
                //priority=null | "'low' | 'normal' | 'high'"
                //style={{ borderRadius: 10 }}
                //blurRadius={6}//blurs the image
                //source can be a require("../")|relative path|remote url| {uri: "must be url/not require", height: 100, width: 100}
                alt="listing"
                //@ts-ignore
                source={`${IMAGE_ROOT}/${img.filename}`}
                // placeholder={blurhash}
                contentFit="cover"
                transition={1000}
                {...imageStyle}
              />

              <Pagination
                dotsLength={images.length}
                activeDotIndex={activeSlide}
                containerStyle={{
                  backgroundColor: "transparent", //rgba(0, 0, 0, 0.75)
                  position: "absolute",
                  bottom: 0,
                  width: "100%",
                  paddingVertical: 10,
                }}
                dotStyle={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  marginHorizontal: 2,
                  backgroundColor: "rgba(255, 255, 255, 0.92)",
                }}
                inactiveDotStyle={
                  {
                    // Define styles for inactive dots here
                  }
                }
                //dotColor="#.."	//Background color of the active dot
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
              />
            </View>
          )}
          sliderWidth={dimensions.width - offset} //using screenWidth//Width in pixels of the carousel itself//Required
          // sliderHeight={screenWidth}//Height in pixels of the carousel itself//required for vertical carousel
          itemWidth={dimensions.width - offset} //Width in pixels of carousel's items, must be the same for all of them/required
          //itemHeight={170}	//Height in pixels of carousel's items.//required for vertical carousel
          onSnapToItem={(index) => setActiveSlide(index)} //Callback fired after snapping to an item
        />
      </View>
    </Pressable>
  );
};

export default SwipeableViews;
