import React, { useEffect, useRef, useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import * as Location from "expo-location";

import {
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from "react-native-google-places-autocomplete";
import MapViewDirections from "react-native-maps-directions";
import { IconButton, List, Searchbar, TextInput } from "react-native-paper";

import { useAppDispatch } from "@/hooks/useAppDispatch";

import { useSelector } from "react-redux";

import colors from "@/constants/colors";
import { useLocalSearchParams } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

const LOCATION_TASK_NAME = "background-location-task";

//// navigator or window.navigator interface return identity of user agent/device
//navigator.geolocation: Returns a Geolocation object allowing accessing the location of the device.
//@ts-ignore//needed for accessing current location by google-places-autocomplete
navigator.geolocation = require("react-native-geolocation-service");

export default function Direction() {
  const ref = useRef(null);
  const mapRef = useRef<MapView>(null);
  const placesOriginRef = useRef<GooglePlacesAutocompleteRef>(null);
  const placesDestinationRef = useRef<GooglePlacesAutocompleteRef>(null);

  const { location } = useLocalSearchParams<{ location: string }>();

  const [travelInfo, setTravelInfo] = useState({ duration: "", distance: "" });

  const [origin, setOrigin] = useState({
    coordinate: {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    description: "Current location",
  });
  //JSON.parse(location)
  const [destination, setDestination] = useState({
    coordinate: {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    description: "Listing location",
  });

  const [isPermissionGranted, setIsPermissionGranted] = useState(false);

  useEffect(() => {
    (async () => {
      //Access to the location in the foreground happens while an app is open and visible to the user.
      let { status: foregroundStatus } =
        await Location.requestForegroundPermissionsAsync();
      if (foregroundStatus !== "granted") {
        return;
      }
      setIsPermissionGranted(true);

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation, //highest possible accuracy that uses additional sensor data
      });

      setOrigin({
        coordinate: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        description: "Current location",
      });
    })();
    //set input text/name
    // placesOriginRef.current?.setAddressText("Current location");
    //placesDestinationRef.current?.setAddressText("Listing/use description");
  }, []);

  //react-native-maps methods//zoom in markers
  useEffect(() => {
    if (!origin || !destination) return;
    //zoom & fit to markers
    mapRef.current?.fitToSuppliedMarkers(["origin", "destination"], {
      edgePadding: { top: 50, left: 50, bottom: 50, right: 50 },
    });
  }, [origin, destination]);

  //hit google api to get timestamps from description
  useEffect(() => {
    if (!origin || !destination) return;
    const getTravelTime = async () => {
      fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?
  units-imperial&origins=${origin.coordinate}&destinations=${destination.coordinate}&key=${process.env.EXPO_PUBLIC_MAPS_API_KEY}`)
        .then((res) => res.json())
        .then((data) => {
          // console.log(data);

          if (data.rows[0]?.elements[0]?.status === "NOT_FOUND") return;
          setTravelInfo({
            duration: data.rows[0]?.elements[0]?.distance?.value,
            distance: data.rows[0]?.elements[0]?.duration?.text,
          });
          //dispatch(setTravelTimeInformation(data.rows[0].elements[0]));//{distance: {text: "470 mi", value: 756340}, duration: {text: "8 hours 7 mins", value: 29240"}
        });
    };
    getTravelTime();
  }, [origin, destination]);

  return (
    <KeyboardAvoidingView style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        //controlling the region as state
        // showsUserLocation={true} //Boolean	false	If true the users location will be shown on the map. NOTE: You need runtime location permissions prior to setting this to true, otherwise it is going to fail silently!
        //showsMyLocationButton	Boolean	true	If false hide the button to move map to the current user's location.
        //showsTraffic	Boolean	false	A Boolean value indicating whether the map displays traffic information.
        //onUserLocationChange	{ coordinate: Location }//Callback that is called when the underlying map figures our users current location//Make sure showsUserLocation is set to true.
        //map will zoom in the region
        initialRegion={origin.coordinate}
        //region={origin.coordinate}
        ////Callback that is called continuously when the region changes, such as when a user is dragging the map.
        // onRegionChange={(region) => {
        //   setOrigin({
        //     coordinate: {
        //       latitude: region.latitude,
        //       longitude: region.longitude,
        //       latitudeDelta: region.longitudeDelta,
        //       longitudeDelta: region.longitudeDelta,
        //     },
        //     description: "New region",
        //   });
        // }}
        //customMapStyle={mapStyle}//Customizing the map style. Gen mapStyle array at https://mapstyle.withgoogle.com/
        //mapType="" //"hybrid" | "mutedStandard" | "none" | "satellite" | "standard" | "terrain"
      >
        {origin && (
          <Marker
            identifier="origin" //An identifier used to reference this marker at a later date.//see mapRef methods .fitTo...
            //Draggable Markers
            draggable
            //onDragEnd={(e) => setMapRegion(e.nativeEvent.coordinate)}
            // key={index}//when looping using map(()=>) for multiple markers
            coordinate={origin.coordinate}
            title="Marker"
            description={origin.description}
            //image={{uri: 'custom_pin'}}// or local img using {require('../custom_pin.png')} //using image as a custom marker
          />
        )}

        {origin && destination && (
          <MapViewDirections
            origin={origin.coordinate} //The origin location to start routing from
            destination={destination.coordinate} // The destination location to start routing to
            apikey={process.env.EXPO_PUBLIC_MAPS_API_KEY!} //Your Google Maps Directions API Key
            //precision="low"//default// Setting to "high" may cause a hit in performance
            //timePrecision="none"//default | "now"//The timePrecision to get Realtime traffic info.
            //mode="DRIVING"/default | "BICYCLING", "WALKING", and "TRANSIT"  //Which transportation mode to use when calculating directions.
            //language="en"	//The language to use when calculating directions.
            //waypoints=[]//Array of waypoints to use between origin and destination.
            strokeWidth={3} //The stroke width to use for the path.
            strokeColor="hotpink" //The stroke color to use for the path.
            optimizeWaypoints={true}
            onStart={(params) => {
              //Callback that is called when the routing has started.
              console.log(
                `Started routing between "${params.origin}" and "${params.destination}"`
              );
            }}
            onReady={(result) => {
              //Callback that is called when the routing has succesfully finished.
              console.log(`Distance: ${result.distance} km`);
              console.log(`Duration: ${result.duration} min.`);
              // this.mapView.fitToCoordinates(result.coordinates, {
              //   edgePadding: {
              //     right: width / 20,
              //     bottom: height / 20,
              //     left: width / 20,
              //     top: height / 20,
              //   },
              // });
            }}
          />
        )}

        {destination && (
          <Marker
            identifier="destination" //An identifier used to reference this marker at a later date.//see mapRef methods .fitTo...
            //Draggable Markers
            draggable
            //onDragEnd={(e) => setMapRegion(e.nativeEvent.coordinate)}
            // key={index}//when looping using map(()=>) for multiple markers
            coordinate={destination.coordinate}
            title="Marker"
            description={destination.description}
            //image={{uri: 'custom_pin'}}// or local img using {require('../custom_pin.png')} //using image as a custom marker
          />
        )}
      </MapView>

      <View className="h-[200]  rounded-t-xl p-3 pt-5 justify-center ">
        {origin ? (
          <View className="">
            <List.Item
              title={
                <Text className="text-lg font-bold">
                  {destination.description}
                </Text>
              }
              description={
                <Text className="text-gray-dimmed">Building location</Text>
              }
              left={(props) => (
                <List.Icon color={colors.emerald.DEFAULT} icon="flag" />
              )}
            />

            <View className=" p-3  bg-orange-light/20 rounded-md">
              <Text className="text-lg font-semibold">
                {travelInfo.distance} 5 km away
              </Text>
              <Text className="text-lg text-gray-dimmed">
                {travelInfo.duration} 35 minutes
              </Text>
            </View>

            {/* <View>
              <List.Item
                title={
                  <Text className="text-lg font-bold">
                    {(origin as any).description}
                  </Text>
                }
                left={(props) => (
                  <List.Icon color={colors.emerald.DEFAULT} icon="map-marker" />
                )}
              />
            </View> */}
          </View>
        ) : (
          <GooglePlacesAutocomplete
            ref={placesOriginRef}
            placeholder="Search starting location "
            query={{
              key: process.env.EXPO_PUBLIC_MAPS_API_KEY,
              language: "en",
              // components: "country:ke", //limit results to one country
            }}
            currentLocation={isPermissionGranted} //default false//only enable this is permission is granted
            currentLocationLabel="Current location"
            minLength={1} //	number//	minimum length of text to trigger a search//default	0
            //onPress runs after a suggestion is pressed
            onPress={(data, details) => {
              // 'details' is provided when fetchDetails = true
              if (details) {
                setOrigin({
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
            renderLeftButton={() => (
              <IconButton
                disabled
                icon={({ size, color }) => (
                  <FontAwesome name="map-marker" size={20} color="black" />
                )}
                iconColor={colors.gray.dark}
                //mode="outlined"
                containerColor="#fff"
                size={10}
                // onPress={() => handleSnapPress()}
                //rippleColor={colors.emerald.DEFAULT}
                style={{ borderColor: colors.gray.light }}
              />
            )}
            styles={{
              container: { flex: 0 },
              textInputContainer: {
                borderWidth: 1,
                borderColor: "#5d5d5d",
                borderRadius: 5,
              },
              textInput: {
                height: 38,
              },
            }}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 2,
  },
  box: {
    flex: 1,
  },
});
