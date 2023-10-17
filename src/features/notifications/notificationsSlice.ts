import { RootState } from "@/redux/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


//In some cases, TypeScript may unnecessarily tighten the type of the initial state. If that happens, you can work around it by casting the initial state using as, instead of declaring the type of the variable:
// Workaround: cast state instead of declaring variable type
// const initialState = {
//   value: 0,
// } as CounterState

interface NotificationState {
  pushToken: null | string;
}

const initialState: NotificationState = {
  pushToken: null,
};

//slice
const notificationsSlice = createSlice({
  name: "notifications",
  initialState,

  reducers: {
    setPushToken: (
      state,
      action: PayloadAction<string>
    ) => {
      state.pushToken = action.payload;
    },
    resetPushToken: (state) => {
      state.pushToken = null;
    },
  },
});

export const { setPushToken, resetPushToken } = notificationsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectPushToken = (state: RootState) =>
  state.notifications.pushToken;

export default notificationsSlice.reducer;
