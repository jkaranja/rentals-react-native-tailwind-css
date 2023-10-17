import { useDispatch } from "react-redux";

import React, { useEffect, useState } from "react";

import { addDays, addHours, startOfDay } from "date-fns";

import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { useRegisterUserMutation } from "./userApiSlice";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import Toast from "react-native-toast-message";
import RegisterForm from "./RegisterForm";
import SignInForm from "./SignInForm";
import { useLoginMutation } from "./authApiSlice";
import { setCredentials } from "./authSlice";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { Button, Dialog, PaperProvider, Portal } from "react-native-paper";
import { View, Text, useWindowDimensions } from "react-native";
import { EvilIcons, MaterialIcons } from "@expo/vector-icons";

import { TAuthInputs } from "./SignupScreen";
import CustomTabBar from "@/components/CustomTabBar";

const renderTabBar = (props: any) => (
  <TabBar
    {...props}
    indicatorStyle={{ backgroundColor: "#10b981" }}
    style={{ backgroundColor: "#fff", paddingTop: 20 }}
    // renderIcon={({ route, focused, color }) => {
    //   let iconName: any = "directions-car";
    //   if (route.key === "login") {
    //     iconName = focused ? "directions-car" : "directions-car";
    //   } else if (route.key === "register") {
    //     iconName = focused ? "delivery-dining" : "delivery-dining";
    //   }

    //   return <MaterialIcons name={iconName} color={color} size={24} />;
    // }}
    //renderBadge//Function which takes an object with the current route and returns a custom React Element to be used as a badge.
    activeColor="#10b981" //Custom color for icon and label in the active tab
    inactiveColor="#667085" //Custom color for icon and label in the inactive tab
    //tabStyle//tyle to apply to the individual tab items in the tab bar.
    //indicatorStyle= "#fff" //Style to apply to the active indicator.
    labelStyle={{ textTransform: "none", fontWeight: 500 }} //Style to apply to the tab item label.
    //style//Style to apply to the tab bar container
    //gap//Define a spacing between tabs
  />
);

type AuthDialogProps = {
  open: boolean;
  handleClose: () => void;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
};

const AuthDialog = ({
  open,
  handleClose,
  setIsAuthenticated,
}: AuthDialogProps) => {
  const dispatch = useAppDispatch();

  const layout = useWindowDimensions();

  const [activeTab, setActiveTab] = useState<string | JSX.Element>("Sign in");

  const [
    login,
    {
      data: loginData,
      error: loginError,
      isLoading: isLoggingIn,
      isError: isLoginError,
      isSuccess: isLoggedInSuccess,
    },
  ] = useLoginMutation();

  const [registerUser, { data, error, isLoading, isError, isSuccess }] =
    useRegisterUserMutation();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
    watch,
    register,
  } = useForm<TAuthInputs>();

  /**--------------------------------
   HANDLE SIGN UP SUBMIT
 -------------------------------------*/
  const onRegisterSubmit: SubmitHandler<TAuthInputs> = async (data) => {
    await registerUser(data);
  };

  /**--------------------------------
   HANDLE LOGIN SUBMIT
 -------------------------------------*/
  const onLoginSubmit: SubmitHandler<Omit<TAuthInputs, "username">> = async (
    data
  ) => {
    await login({ phoneNumber: data.phoneNumber, password: data.password });
  };

  /* -------------------------------------------------------------
    HANDLE TAB CHANGE
   ----------------------------------------------------------------*/
  const handleTabChange = (tab: string | JSX.Element) => {
    setActiveTab(tab);
  };

  //feedback
  useEffect(() => {
    if (isError || isLoginError)
      Toast.show({ type: "error", text1: (error || loginError) as string });

    if (isSuccess && data?.accessToken) {
      dispatch(setCredentials(data.accessToken));
      setIsAuthenticated(true);
    }

    if (isLoggedInSuccess && loginData?.accessToken) {
      dispatch(setCredentials(loginData.accessToken));
      setIsAuthenticated(true);
    }
  }, [isError, isSuccess, isLoginError, isLoggedInSuccess]);

  return (
    <Portal>
      <Dialog
        visible={open}
       // onDismiss={handleClose}
       // dismissable //Determines whether clicking outside the dialog dismiss it.
        style={{
          borderRadius: 12,
          backgroundColor: "#fff",
          paddingTop: 0,
          paddingVertical: 0,
        }}
        // dismissableBackButton//Determines whether clicking Android hardware back button dismiss dialog.
      >
        <Dialog.Title
          className=""
          style={{
            marginTop: 0,
            marginBottom: 0,
            marginLeft: 0,
            marginRight: 0, 
            height: 0,
          }}
        >
          {""}
        </Dialog.Title> 
        <Dialog.Content className="rounded-xl  p-0 ">
          <View className="flex-row justify-between text-right items-center  p-4">
            <Text className="text-lg">Sign in or create an account</Text>
            <EvilIcons name="close" size={24} onPress={handleClose} />
          </View>

         
          <CustomTabBar
            className="mb-2 "
            //style={{ elevation: 1 }}
            tabs={["Sign in", "Create an account"]}
            activeTab={activeTab}
            handleTabChange={handleTabChange}
          />

          <View className="p-5 pb-8">
            {activeTab === "Sign in" ? (
              <SignInForm
                handleSubmit={handleSubmit(onLoginSubmit)}
                errors={errors}
                control={control}
                register={register}
                isLoading={isLoggingIn}
              />
            ) : (
              <RegisterForm
                handleSubmit={handleSubmit(onRegisterSubmit)}
                errors={errors}
                control={control}
                register={register}
                isLoading={isLoading}
              />
            )}
          </View>
        </Dialog.Content>
        {/* <Dialog.Actions>
          {handleAction && <Button onPress={handleClick}>Ok</Button>}
        </Dialog.Actions> */}
      </Dialog>
    </Portal>
  );
};

export default AuthDialog;
