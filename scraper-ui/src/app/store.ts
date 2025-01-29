import { configureStore } from "@reduxjs/toolkit";
import setUserReducer from "../features/setUser";

export const store = configureStore({
  reducer: {
    user: setUserReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
