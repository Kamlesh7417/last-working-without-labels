import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order, MOCK_ORDERS } from '../../utils/mockData';

interface OrderState {
  orders: Record<string, Order>;
  loading: boolean;
  error: string | null;
  selectedOrderId: string | null;
  pagination: {
    currentPage: number;
    itemsPerPage: number;
  };
  filters: {
    search: string;
    status: string | null;
  };
}

const initialState: OrderState = {
  orders: MOCK_ORDERS,
  loading: false,
  error: null,
  selectedOrderId: null,
  pagination: {
    currentPage: 1,
    itemsPerPage: 10
  },
  filters: {
    search: '',
    status: null
  }
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Record<string, Order>>) => {
      state.orders = action.payload;
    },
    updateOrderStatus: (state, action: PayloadAction<{ orderId: string; status: string }>) => {
      const { orderId, status } = action.payload;
      if (state.orders[orderId]) {
        state.orders[orderId].order_status = status as Order['order_status'];
      }
    },
    setFilters: (state, action: PayloadAction<Partial<OrderState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.currentPage = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.currentPage = 1;
    }
  }
});

export const { setOrders, updateOrderStatus, setFilters, setPage, clearFilters } = orderSlice.actions;
export default orderSlice.reducer;