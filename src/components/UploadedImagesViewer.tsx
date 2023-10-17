 
import { IMAGE_ROOT } from "@/constants/paths";
import { IImage } from "@/types/file";
import { Image } from "expo-image";
import React from "react";
import { FlatList, View } from "react-native";
import { IconButton } from "react-native-paper";

type UploadedImagesViewerProps = {
  images: Array<IImage>;
  removeImage: (arg: IImage) => void;
};

const UploadedImagesViewer = ({ images, removeImage }: UploadedImagesViewerProps) => {
  return (
    <View className="flex-1 items-center">
      <FlatList
        data={images}
        horizontal={false}
        numColumns={2}
        //columnWrapperStyle={{}}//Optional custom style for multi-item rows generated when numColumns > 1.
        //Rendered in between each item, but not at the top or bottom. Type: component | JSX.Element
        //@ts-ignore//accep
        // ItemSeparatorComponent={<List.Subheader>Some title</List.Subheader>}
        ////function/component or React.ReactNode//Rendered at the top of all the items
        ListHeaderComponent={<View></View>}
        ListFooterComponent={<View></View>} //function/component or React.ReactNode//rendered bottom of list
        keyExtractor={(item, i) => item.filename! + i}
        renderItem={({ item }) => (
          <View className="m-1 w-[150]  relative h-[100] ">
            <IconButton
              icon="close"
              iconColor="white"
              mode="outlined"
              //containerColor="#000"
              size={15}
              onPress={() => removeImage(item)}
              //rippleColor={colors.emerald.DEFAULT}
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                zIndex: 1,
                borderWidth: 0,
                //opacity: 0.6
              }}
              className="bg-red/70"
            />
            <Image
              className="h-[100] rounded-none"
              //priority=null | "'low' | 'normal' | 'high'"
              style={{ borderRadius: 10 }}
              blurRadius={0.4} //blurs the image
              //source can be a require("../")//relative path//remote url
              //alt=""
              //@ts-ignore
              source={`${IMAGE_ROOT}/${item.filename}`}
              // placeholder={blurhash}
              contentFit="cover"
              transition={1000}
            />
          </View>
        )}
      />
    </View>
  );
};

export default UploadedImagesViewer;
