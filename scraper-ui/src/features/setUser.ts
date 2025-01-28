import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface userState {
  isLoggedIn: Boolean;
  name: string;
  email: string;
  avatar: String;
  id: String;
}

const initialState: userState = {
  isLoggedIn: false,
  name: "",
  email: "",
  avatar: "",
  id: "",
};

export const setUser = createSlice({
  name: "setuser",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<userState>) => {
      state.isLoggedIn = true;
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.avatar = action.payload.avatar;
    },
    logout: (state) => {
      (state.isLoggedIn = false),
        (state.name = ""),
        (state.email = ""),
        (state.avatar = ""),
        (state.id = ""); // Reset or set to a default value
    },
    setDetails: (state, action: PayloadAction<userState>) => {
      if (state.isLoggedIn) {
        state.name = action.payload.name;
        state.email = action.payload.email;
        state.avatar = action.payload.avatar;
        state.id = action.payload.id;
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, logout } = setUser.actions;

export default setUser.reducer;
