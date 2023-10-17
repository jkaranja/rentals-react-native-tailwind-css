import {
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from "react-native-google-places-autocomplete";

import colors from "@/constants/colors";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";

import { FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { IconButton } from "react-native-paper";
import { addToFilters, selectSearchFilters } from "./rentalSlice";
import { ILocation } from "@/types/listing";

//// navigator or window.navigator interface return identity of user agent/device
//navigator.geolocation: Returns a Geolocation object allowing accessing the location of the device.
//@ts-ignore//needed for accessing current location by google-places-autocomplete
navigator.geolocation = require("react-native-geolocation-service");

type SearchBarProps = {
  handleOpen: () => void;
};

const SearchBar = ({ handleOpen }: SearchBarProps) => {
  const dispatch = useAppDispatch();

  const filters = useAppSelector(selectSearchFilters);

  const placesRef = useRef<GooglePlacesAutocompleteRef>(null);

  const [location, setLocation] = useState(
    filters.location || ({} as ILocation)
  );

  const [isPermissionGranted, setIsPermissionGranted] = useState(false);

  // useEffect(() => {
  //   (async () => {
  //     //Access to the location in the foreground happens while an app is open and visible to the user.
  //     let { status: foregroundStatus } =
  //       await Location.requestForegroundPermissionsAsync();
  //     if (foregroundStatus !== "granted") {
  //       return;
  //     }
  //     setIsPermissionGranted(true);

  //     //background location access happens after a user closes the app or uses the home button to return to their main screen
  //     //if foregroundStatus === "granted", req permission to use location in the background
  //     // const { status: backgroundStatus } =
  //     //   await Location.requestBackgroundPermissionsAsync();
  //     // if (backgroundStatus !== "granted") {
  //     //   return; //current location option will be hidden
  //     // }
  //     // setIsPermissionGranted(true); //show current location
  //   })();
  // }, []);

  //google auto complete optional methods
  useEffect(() => {
    placesRef.current?.setAddressText(location?.description || ""); //set the value of TextInput
    //placeRef.current?.focus()//makes the TextInput focus//blur()= remove focus//clear()=>clear text
    //const current = placeRef.current?.getCurrentLocation()//makes a query to find nearby places based on current location
  }, []);

  //update filters in store
  useEffect(() => {
    dispatch(
      addToFilters({
        location,
      })
    );
  }, [location, dispatch]);

  return (
    <View>
      <GooglePlacesAutocomplete
        ref={placesRef}
        placeholder="Search location"
        query={{
          key: process.env.EXPO_PUBLIC_MAPS_API_KEY,
          language: "en",
          components: "country:ke", //limit results to one country
        }}
        // currentLocation={isPermissionGranted} //default false//only enable this is permission is granted
        currentLocationLabel="Current location"
        minLength={1} //	number//	minimum length of text to trigger a search//default	0
        //onPress runs after a suggestion is pressed
        onPress={(data, details) => {
          // 'details' is provided when fetchDetails = true
          if (details) {
            setLocation({
              coordinate: {
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              },
              description: data.description,
            });
          }
        }}
        //textInputProps//object//define props for the textInput, or provide a custom input component//you can then pass props to it//see above
        enablePoweredByContainer={false} //boolean	show "powered by Google" at the bottom of the search results list//default	true
        fetchDetails={true} //get more place details about the selected option from the Place Details API//default false
        //returnKeyType="search" //	the return key text//default "search"
        styles={{
          container: { flex: 0, elevation: 5 },
          textInputContainer: {
            elevation: 3,
            // borderWidth: 1,
            // borderColor: colors.gray.light,
            borderRadius: 25,
            paddingHorizontal: 5,
            backgroundColor: "#fff",
          },
          textInput: {
            marginBottom: 0,
            borderRadius: 25,
            //backgroundColor: "red",
          },
        }}
        renderLeftButton={() => (
          <IconButton
            icon={({ size, color }) => (
              <FontAwesome name="search" size={18} color="black" />
            )}
            iconColor="#000"
            mode="contained"
            containerColor="#fff"
            size={15}
          />
        )}
        renderRightButton={() => (
          <IconButton
            icon={({ size, color }) => (
              <Image
                source={require("../../../../assets/images/filter_icon.png")}
                className="h-full w-full"
                priority="high"
                //style={{ borderRadius: 10 }}
                alt="filter"
                contentFit="cover"
                transition={1000}
              />
            )}
            iconColor="#000"
            mode="outlined"
            containerColor="#fff"
            size={15}
            onPress={handleOpen}
            rippleColor="#fff"
            style={{ borderColor: colors.gray.light, padding: 5 }}
          />
        )}
      />
    </View>
  );
};

export default SearchBar;
