import * as React from "react";
import { Button, Dialog, PaperProvider, Portal } from "react-native-paper";
import { View } from "react-native";
import { EvilIcons } from "@expo/vector-icons";

type AlertDialogProps = {
  visible: boolean;
  handleAction?: () => void;
  handleClose: () => void;
  children: React.ReactNode;
};

const AlertDialog = ({
  handleAction,
  handleClose,
  children,
  visible,
}: AlertDialogProps) => {
  // const handleClick = () => {
  //   //close dialog
  //   handleClose();
  //   //run action
  //   handleAction && handleAction();
  // };

  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={handleClose}
        dismissable //Determines whether clicking outside the dialog dismiss it.
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
          <View className="flex-row justify-end text-right items-end p-4">
            <EvilIcons name="close" size={24} onPress={handleClose} />
          </View>

          {children}
        </Dialog.Content>
        {/* <Dialog.Actions>
          {handleAction && <Button onPress={handleClick}>Ok</Button>}
        </Dialog.Actions> */}
      </Dialog>
    </Portal>
  );
};

export default AlertDialog;
