import { View, Text } from "react-native";
import { useEffect } from "react";

import { useAppSelector } from "./useAppSelector";
import * as secureStore from "expo-secure-store";
import { useAppDispatch } from "./useAppDispatch";
import { selectCurrentToken, setCredentials } from "@/features/auth/authSlice";

const usePersistAuth = () => {
  const token = useAppSelector(selectCurrentToken);

  const dispatch = useAppDispatch();

  //load token from secure store to redux store
  useEffect(() => {
    const getToken = async () => {
      try {
        const accessToken = await secureStore.getItemAsync("token");
        if (!accessToken) return;
        //save accessToken to store
        dispatch(setCredentials(accessToken));
      } catch (e) {
        return;
      }
    };

    if (!token) getToken();
  }, []);
};

export default usePersistAuth;
