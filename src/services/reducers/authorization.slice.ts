import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signinApi, logoutApi, signupApi } from '../../auth/auth';
import { setCookie, deleteCookie } from '../../auth/auth';
import {
  TUserSigninData,
  TUserSignupData,
} from '../../utils/types/auth';

type TAuthorizationState = {
  isLoading: boolean;
  isLogin: boolean;
  isRegistered: boolean;
  user: TUserSignupData | null;
  error: string | null;
};

const initialState: TAuthorizationState = {
  isLoading: false,
  isRegistered: false,
  isLogin: false,
  user: {
    name: '',
    email: '',
    password: '',
  },
  error: null,
};

// Асинхронные thunk-действия
export const signIn = createAsyncThunk(
  '/api/login',
  async (userData: TUserSigninData, { rejectWithValue }) => {
    try {
      const response = await signinApi(userData);
      setCookie('token', response.token);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const signOut = createAsyncThunk(
  '/api/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      deleteCookie('token');
      return;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const signUp = createAsyncThunk(
  '/api/register',
  async (userData: TUserSignupData, { rejectWithValue }) => {
    try {
      const response = await signupApi(userData);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
    }
  }
);

const authorizationSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //-- Обработка состояний register --//
      .addCase(signUp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isRegistered = true;
        state.error = null;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      //-- Обработка состояний login --//
      .addCase(signIn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLogin = true;
        state.error = null;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      //-- Обработка состояний logout --//
      .addCase(signOut.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.isLoading = false;
        state.isLogin = false;
        state.user = null;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default authorizationSlice.reducer;
