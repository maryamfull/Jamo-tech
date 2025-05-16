// src/redux/ipGeoSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk for fetching IP address
export const fetchIpAddress = createAsyncThunk('ipGeo/fetchIpAddress', async () => {
  const response = await axios.get("https://api.ipify.org?format=json");
  return response.data.ip;
});

// Thunk for fetching geolocation data
export const fetchGeoLocationData = createAsyncThunk(
  'ipGeo/fetchGeoLocationData',
  async (ip) => {
    if (!ip) return;
    const response = await axios.get(
      `https://geo.ipify.org/api/v2/country?apiKey=at_uohOehclsSfxAVu14J4NUiQBHmT7O&ipAddress=${ip}`
    );
    return response.data;
  }
);

const ipGeoSlice = createSlice({
  name: 'ipGeo',
  initialState: {
    ip: null,         // Initialize ip as null
    geoData: null,    // Initialize geoData as null
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch IP address
      .addCase(fetchIpAddress.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchIpAddress.fulfilled, (state, action) => {
        state.ip = action.payload;
        state.loading = false;
      })
      .addCase(fetchIpAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch Geolocation Data
      .addCase(fetchGeoLocationData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGeoLocationData.fulfilled, (state, action) => {
        state.geoData = action.payload;
        state.loading = false;
      })
      .addCase(fetchGeoLocationData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default ipGeoSlice.reducer;
