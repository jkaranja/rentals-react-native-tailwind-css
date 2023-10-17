import {
  ActivityIndicator,
  Avatar,
  Button,
  Divider,
  HelperText,
  IconButton,
  TextInput,
  Dialog,
  Portal,
  List,
} from "react-native-paper";
import {
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  Pressable,
  FlatList,
} from "react-native";
import useDebounce from "../../hooks/useDebounce";
import {
  IActivity,
  ICommission,
  useGetActivitiesQuery,
  useGetCommissionsQuery,
} from "./paymentApiSlice";
import { useEffect, useMemo, useState } from "react";

import colors from "@/constants/colors";
import { format } from "date-fns";
import { EvilIcons, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { Link } from "expo-router";
import { PROFILE_PIC_ROOT } from "@/constants/paths";
import { Image } from "expo-image";
import { useGetUserQuery } from "../auth/userApiSlice";
import { useDepositMutation } from "./paymentApiSlice";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Toast from "react-native-toast-message";
import Modal from "@/components/Modal";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

type PayNowProps = {
  open: boolean;
  handleClose: () => void;
  balance: number;
};

const PayNow = ({ open, handleClose, balance }: PayNowProps) => {
  /* -------------------------------------------------------------
   FETCH USER
   ----------------------------------------------------------------*/
  const { data: user, isFetching } = useGetUserQuery(undefined, {
    // pollingInterval: 15000,
    // refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const [deposit, { isLoading, isSuccess, isError, error, data }] =
    useDepositMutation();

  //r-hook-form
  type Inputs = {
    phoneNumber: string;
    amount: string;
  };
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, submitCount },
    reset: resetForm,
    control,
    watch,
    getValues,
    setValue,
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await deposit({ amount: balance });
  };

  //set defaults
  useEffect(() => {
    resetForm({
      amount: String(balance),
    });
  }, [user]);

  //feedback
  useEffect(() => {
    if (isError) Toast.show({ type: "error", text1: error as string });

    if (isSuccess) Toast.show({ type: "success", text1: data?.message });

    if (isSuccess) handleClose();

    //return () => toast.dismiss();//don't dismiss
  }, [isError, isSuccess]);

  return (
    <Modal visible={open} onDismiss={handleClose} style={{ padding: 20 }}>
      <KeyboardAwareScrollView>
        <Text className="text-xl font-bold mb-3">Pay balance</Text>

        <Text>
          Follow the steps below to clear your balance of Ksh {balance}
        </Text>

        <Text className="text-lg font-bold my-3">1. Confirm phone number</Text>

        <Text>
          Is the phone number below the one making the payment? If not, update
          under{" "}
          <Link href="/settings/account" className="text-emerald">
            account
          </Link>
          .
        </Text>
        <Text className="text-red my-2">
          {user?.phoneNumber || "No phone number added. "}
        </Text>

        <Text className="text-lg font-bold my-3">
          2. Confirm amount and submit
        </Text>

        <Text className="mb-3">
          Confirm if the amount below matches your outstanding balance. If it
          doesn't, update amount to match your balance and click submit.
        </Text>

        <Controller
          name="amount"
          control={control}
          rules={{
            required: "Amount is required",
            min: {
              value: balance,
              message: "Amount must match balance",
            },
            max: {
              value: balance,
              message: "Amount must match balance",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              //label="Ksh"
              keyboardType="number-pad"
              dense
              mode="outlined"
              onBlur={onBlur}
              onChangeText={(text) =>
                onChange(text.replace(/[^0-9]/g, "") || "0")
              }
              value={value}
              left={<TextInput.Affix text="Ksh" />}
              // error={Boolean(errors.username?.message)} //Whether to style the TextInput with error style.
            />
          )}
        />
        <HelperText type="error" visible={Boolean(errors.amount?.message)}>
          {errors.amount?.message}
        </HelperText>
        <Button
          mode="contained"
          disabled={isLoading}
          loading={isLoading}
          onPress={handleSubmit(onSubmit)}
        >
          Submit
        </Button>

        <Text className="text-lg font-bold my-3">3. Authorize the payment</Text>
        <Text className="mb-2">
          You will receive a prompt on your phone to authorize the payment.
          Enter your PIN and click 'Send'.
        </Text>
        <Text className="mb-2">
          After getting the M-Pesa confirmation message, please refresh the page
          to check if the balance was cleared.
        </Text>

        <Text className="text-lg font-bold my-3">
          Didn't get the prompt (a pop up on your phone)?
        </Text>
        <Text className="text-lg font-bold mb-2">Option 1: </Text>
        <Text className="mb-2">
          Resend the prompt by clicking the submit button again. If that didn't
          work, see option 2 below.
        </Text>

        <Text className="text-lg font-bold mb-2">Option 2:</Text>
        <Text className="mb-2">
          You can also clear your balance by sending money directly to our Till
          Number: {""}
          5139511. It will display 'Atwelia SYSTEMS' as the recipient.
        </Text>
        <Text className="mb-2">
          After sending the money to our till number above, please refresh the
          page to check if the balance was cleared.
        </Text>

        <Text className="mb-4">
          If you sent the money and balance hasn't cleared yet, please wait for
          up to 1 minute and refresh page again. If still nothing, please
          contact us on WhatsApp: +254799295587 or email us at
          support@atwelia.com.
        </Text>
      </KeyboardAwareScrollView>
    </Modal>
  );
};

export default PayNow;
