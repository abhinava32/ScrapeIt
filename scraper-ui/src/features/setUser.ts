import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface userState {
  isLoggedIn: Boolean;
  userName: string;
  userType: "Square" | "Triangle" | "Circle" | "null"; // Enum-like string literal type
}

const initialState: userState = {
  isLoggedIn: false,
  userName: "",
  userType: "null", // Default value can be 'agent' or any valid value
};

export const setUser = createSlice({
  name: "setuser",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<userState>) => {
      state.isLoggedIn = true;
      state.userName = action.payload.userName;
      state.userType = action.payload.userType;
    },
    logout: (state) => {
      (state.isLoggedIn = false), (state.userName = "");
      state.userType = "null"; // Reset or set to a default value
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, logout } = setUser.actions;

export default setUser.reducer;
