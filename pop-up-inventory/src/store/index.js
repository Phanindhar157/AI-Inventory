import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';
import vendorReducer from './slices/vendorSlice';
import orderReducer from './slices/orderSlice';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    products: productReducer,
    vendors: vendorReducer,
    orders: orderReducer,
    auth: authReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for non-serializable values
    }),
}); 