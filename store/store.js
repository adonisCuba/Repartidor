import { configureStore } from "@reduxjs/toolkit";
import deliveryReducer from "./slices/delivery";

const reducer = {
  delivery: deliveryReducer,
};

const store = configureStore({
  reducer: reducer,
});

export default store;
