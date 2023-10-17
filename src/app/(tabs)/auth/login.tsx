import React from "react";

import { KeyboardAvoidingView } from "react-native";

import { StatusBar } from "expo-status-bar";
import LoginScreen from "@/features/auth/LoginScreen";

const Login = () => {
  return (
    <KeyboardAvoidingView className="flex-1 ">
      {/**'auto', 'inverted', 'light', 'dark' */}
      <StatusBar style="auto" backgroundColor="#fff" />

      <LoginScreen />

      {/**TEXT INPUT AND BUTTON SUMMARY */}
      {/* <TextInput
              //also inherits react native TextInput props
              keyboardType="number-pad" //or numeric
              clearButtonMode="while-editing"
              autoComplete="tel" //Specifies autocomplete hints for the system, so it can provide autofill(off to disable). eg username|email|
              //secureTextEntry//If true, the text input obscures the text entered so that sensitive text like passwords stay secure.
              mode="outlined"              
              //onChangeText={(text)=> setText(text)}
              value={value}
              //mode='flat' | 'outlined'//default: flat input with an underline.
              //outlineColor//Inactive outline color of the input.
              //activeOutlineColor//active outline color of the input.
              //underlineColor
              //activeUnderlineColor
              //textColor //Color of the text in the input.
              //dense//Sets min height with densed layout//adds paddingVertical
              //multiline=boolean//whether the input can have multiple lines.
              //numberOfLines={numberOfLines}
              //onFocus
              //onBlur
              //render=()=> React.ReactNode//render custom input like nativeTextInput
              //left=React.ReactNode//same options as for right below or pass custom
              //right=React.ReactNode eg {<TextInput.Affix textStyle text="/100" />}//render a leading / trailing text in the TextInput
              //or an icon {<TextInput.Icon color onPress icon="eye" />}// render a leading / trailing icon in the TextInput
              //disabled
              //placeholder
              left={<TextInput.Affix text="+254" />}
              error={Boolean(errors.phoneNumber?.message)} //Whether to style the TextInput with error style.
              label="Phone number"
              // value={text}
              // onChangeText={(text) => setText(text)}
              // secureTextEntry
              //contentStyle//Pass custom style directly to the input itself.
              //outlineStyle//override the default style of outlined wrapper eg borderRadius, borderColor
              //underlineStyle// override the default style of underlined wrapper// eg borderRadius
              //style={{}}//eg height of input /fontSize of text inside TextInput
            />        
   
        <Button
          icon="arrow-right" //any MaterialCommunityIcons icon name//see https://icons.expo.fyi/Index
          mode="contained"
          onPress={handleSendOTP}
          //uppercase//boolean//Make the label text uppercased
          // icon={({ size, color }) => (
          //   <Image
          //     source={require("../assets/chameleon.jpg")}
          //     style={{ width: size, height: size, tintColor: color }}
          //   />
          // )}//custom icon component
          //icon={require('../assets/chameleon.jpg')}//load img as icon
          //icon={{ uri: 'https://avatars0.githubusercontent.com/u/17571969?v=3&s=400' }}//remote img
          //mode='text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal'//Default value: 'text'
          //dark= false// boolean//Whether the color is a dark color///only when mode= contained, contained-tonal and elevated modes
          //buttonColor=""
          //textColor=""
          //compact
          //rippleColor=""//Color of the ripple effect.
         // loading={isLoading || isSending} //boolean //Whether to show a loading indicator
          //disabled //boolean
          //onPressIn
          //style
          //labelStyle={{fontSize: 20}}////Style for the button text.
        >
          Submit
        </Button> */}
    </KeyboardAvoidingView>
  );
};

export default Login;
