import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getDeliveries, getDeliveriesBoy } from "../../database/delivery";

const INITIAL_STATE = {
  deliveries: [],
};

export const fetchDeliveries = createAsyncThunk(
  "delivery/fecth",
  async ({ statusFilter }) => {
    const res = await getDeliveries(statusFilter);
    return JSON.stringify(res);
  }
);

export const fetchBoyDeliveries = createAsyncThunk(
  "delivery/fecthBoy",
  async () => {
    const res = await getDeliveriesBoy();
    return JSON.stringify(res);
  }
);

const deliverySlice = createSlice({
  name: "delivery",
  initialState: INITIAL_STATE,
  extraReducers: {
    [fetchDeliveries.fulfilled]: (state, action) => {
      const data = JSON.parse(action.payload);
      return { ...state, deliveries: data };
    },
    [fetchBoyDeliveries.fulfilled]: (state, action) => {
      const data = JSON.parse(action.payload);
      return { ...state, deliveries: data };
    },
  },
});

const { reducer } = deliverySlice;
export default reducer;
