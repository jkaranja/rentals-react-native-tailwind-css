import colors from "@/constants/colors";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { PaperProvider, MD3LightTheme } from "react-native-paper";

export const navThemeSettings = (mode: string = "light") => {
  return {
    dark: false,
    colors: {
      ...DefaultTheme.colors,
      primary: colors.emerald.DEFAULT,
      background: colors.gray.bg, //screen bg
      card: "#fff", //brand//headers/tabs//use headerStyle in options/screenOptions/setOptions
      //text: colors.gray.darker, //text color
      // border: "#fff", //header border, tab bar border//keep default
      notification: colors.emerald.DEFAULT, //badge color
    },
  };
};

export const paperThemeSettings = (mode: string = "light") => {
  return {
    ...MD3LightTheme,
    // Specify custom property
    myOwnProperty: true,
    // Specify custom property in nested object
    colors: {
      ...MD3LightTheme.colors,
      primary: colors.emerald.DEFAULT,
      Secondary: colors.red.DEFAULT,
      secondaryContainer: MD3LightTheme.colors.surfaceDisabled,
    },
  };
};
