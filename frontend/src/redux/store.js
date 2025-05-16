// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import ipGeoReducer from './ipGeoSlice';

const store = configureStore({
  reducer: {
    data: ipGeoReducer,
  },
});

export default store;
