import { getFeedsApi, getOrdersApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '@utils-types';

export const fetchFeed = createAsyncThunk('feed/fetch', getFeedsApi);

export const fetchOrderFeed = createAsyncThunk('feed/orderFetch', getOrdersApi);

const feedSlice = createSlice({
  name: 'feed',
  initialState: {
    isLoading: false,
    feed: null as TOrdersData | null,
    orders: [] as TOrder[],
    error: null as string | null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.isLoading = false;
        state.feed = action.payload;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Ошибка при загрузке списка заказов';
      })
      .addCase(fetchOrderFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrderFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Ошибка при загрузке заказов пользователя';
      });
  },
  selectors: {
    selectIsLoading: (state) => state.isLoading,
    selectFeed: (state) => state.feed,
    selectOrdersFeed: (state) => state.orders,
    selectError: (state) => state.error
  }
});

export default feedSlice.reducer;
export const { selectFeed, selectOrdersFeed, selectIsLoading, selectError } =
  feedSlice.selectors;

export const initialState = {
  feed: null as TOrdersData | null,
  orders: [] as TOrder[],
  isLoading: false,
  error: null as string | null
};
