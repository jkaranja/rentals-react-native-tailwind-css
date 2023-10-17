import SignupScreen from "@/features/auth/SignupScreen";
import React from "react";

import { KeyboardAvoidingView } from "react-native";

const Signup = () => {
  return (
    <KeyboardAvoidingView className="flex-1 ">
      
      {/* <StatusBar style="auto" backgroundColor="#10b981" /> */}

      <SignupScreen />
    </KeyboardAvoidingView>
  );
};

export default Signup;
