import colors from "@/constants/colors";
import { View, Text } from "react-native";

import PhoneInput, {
  PhoneInputProps,
} from "react-native-phone-number-input";

const PhoneNumberInput = (props: PhoneInputProps) => {
  return (
    <PhoneInput
      //  ref={phoneInput} //methods->phoneInput.current?.isValidNumber(value)/getCountryCode()
      //defaultValue={value} //string
      //value={value} //string
      defaultCode="KE" //country code//https://github.com/xcarpentier/react-native-country-picker-modal/blob/master/src/types.ts#L252
      layout="first" //"first" | "second";//second = no flag just country code like +254
      //(text: string) => void;//format: 720....//without country code
      // onChangeText={(text) => {
      //   setValue(text);
      // }}
      //(text: string) => void;//format +2547......
      //onChangeFormattedText={(text) => {  setFormattedValue(text)}}
      withDarkTheme // boolean
      //withShadow // boolean//adds elevation
      //autoFocus // boolean
      countryPickerButtonStyle={{ width: "auto", paddingRight: 2 }} //: StyleProp<ViewStyle>;
      // disabled?: boolean
      disableArrowIcon //?: boolean
      // placeholder?: string;
      // onChangeCountry?: (country: Country) => void;
      containerStyle={{
        width: "100%",
        borderRadius: 3,
        height: 50,
        borderWidth: 1,
        borderColor: colors.gray.outline,
        elevation: 0,
      }} // StyleProp<ViewStyle>;
      textContainerStyle={{
        paddingTop: 0,
        paddingBottom: 0,
      }} // StyleProp<ViewStyle>;
      // renderDropdownImage?: JSX.Element;
      // textInputProps?: TextInputProps;
      //textInputStyle={{ backgroundColor: "red" }} //?: StyleProp<TextStyle>;
      // codeTextStyle?: StyleProp<TextStyle>;
      //flagButtonStyle={{ width: "auto",  }} //?: StyleProp<ViewStyle>;

      {...props}
    />
  );
};

export default PhoneNumberInput;
