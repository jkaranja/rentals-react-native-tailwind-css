import colors from "@/constants/colors";
import useForwardRef from "@/hooks/useForwardRef";
import { AntDesign } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal
} from "@gorhom/bottom-sheet";
import React, { forwardRef, useCallback } from "react";
import { Text, View } from "react-native";
import { Divider, IconButton } from "react-native-paper";

type FilterBottomSheetProps = {
  children: React.ReactNode;
  handleClosePress: () => void;
  snapPoints: Array<string>;
  title: string;
};

type BottomSheetRef = BottomSheetModal;

const BottomSheet = forwardRef<BottomSheetRef, FilterBottomSheetProps>(
  ({ children, snapPoints, handleClosePress, title }, forwardedRef) => {
    const bottomSheetRef = useForwardRef<BottomSheetModal>(forwardedRef);

    const renderBackdrop = useCallback(
      (props_: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props_}
          pressBehavior="close" //'none|close|collapse| number(snap point index)' //default: 'close'
          opacity={0.5} //default:0.5//Backdrop opacity.
          appearsOnIndex={1} //default:1//Snap point index when backdrop will appears on
          disappearsOnIndex={-1} //default: 0//Snap point index when backdrop will disappears on.
        />
      ),
      []
    );

    // variables//possible snap points/height of sheet can be
    // const snapPoints = useMemo(() => ["25%", "50%", "55%"], []);
    // callbacks
    // const handleSheetChanges = useCallback((index: number) => {
    //   // console.log("handleSheetChanges", index);
    // }, []);
    //open/snap bottom sheet to a defined snap point
    //index === index of a snapPoint(given in %) in the snapPoints array
    // const handleSnapPress = useCallback((index: number) => {
    //use bottomSheetRef.current?.present(); with sheet modal
    //   bottomSheetRef?.current?.snapToIndex(index);
    //   setIsOpen(true);
    // }, []);
    //close btm sheet
    // const handleClosePress = useCallback(() => {
    //   bottomSheetRef.current?.close();
    //sheet modal: bottomSheetModalRef.current?.dismiss()
    //   setIsOpen(false);
    // }, []);

    return (
      <BottomSheetModal
        ref={bottomSheetRef}
        backdropComponent={renderBackdrop}
        index={snapPoints.length - 1} ////-1 won't work with sheet modal//Initial snap index. You also could provide -1 to initiate bottom sheet in closed state.
        snapPoints={snapPoints}
        //  onChange={handleSheetChanges} //Callback when the sheet position changed.
        enablePanDownToClose={true} //drag down to close
        //onClose={handleClosePress} //when sheet is closed//prop doesn't exist with sheet modal
        //handleIndicatorStyle={{ backgroundColor: "#10b981" }} //View style to be applied to the handle indicator component.
        handleStyle={{ display: "none" }} //or add bg color etc// //View style to be applied to the handle component.
        // backgroundStyle={{ shadowColor: "#000", elevation: 10,  }} //style to be applied to the background component
        //@ts-ignore
        style={{ shadowColor: "#000", elevation: 10 }} //View style to be applied at the sheet container
        //detached
        // bottomInset={40}//Bottom inset to be added to the bottom sheet container.
      >
        <View className="flex-row justify-between  p-2 gap-x-1 items-center">
          <Text className="font-semibold px-2">{title}</Text>
          <IconButton
            icon={({ size, color }) => (
              <AntDesign name="close" size={size} color={color} />
            )}
            iconColor={colors.gray.dark}
            mode="outlined"
            containerColor="#fff"
            size={15}
            onPress={() => handleClosePress()}
            //rippleColor={colors.emerald.DEFAULT}
            style={{ borderColor: "#fff", marginVertical: 0 }}
          />
        </View>
        <Divider className="bg-gray-border" />

        {/* <BottomSheetScrollView>{children}</BottomSheetScrollView> */}
        {children}
      </BottomSheetModal>
    );
  }
);

export default BottomSheet;
