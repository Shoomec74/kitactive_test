import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loadFilesApi, uploadFilesApi } from '../../attachments/attchments';
import { TResponseLoadFile, TResponseLoadFiles } from '../../utils/types/attachments';

type TAuthorizationState = {
  isLoading: boolean;
  files: TResponseLoadFile[];
  isLogin: boolean;
  isUpload: boolean;
  error: string | null;
};

const initialState: TAuthorizationState = {
  isLoading: false,
  files: [],
  isLogin: false,
  isUpload: false,
  error: null,
};

// Асинхронные thunk-действия
export const loadFiles = createAsyncThunk(
  '/api/media',
  async (_, { rejectWithValue }) => {
    try {
      const response = await loadFilesApi();
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
    }
  }
);

// Асинхронные thunk-действия
export const uploadFiles = createAsyncThunk(
  '/api/media/upload',
  async (attachments: File[], { rejectWithValue }) => {
    try {
      const response = await uploadFilesApi(attachments);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
    }
  }
);

const attachmentsSlice = createSlice({
  name: 'attachments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //-- Обработка состояний работы при загрузке файлов--//
      .addCase(loadFiles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadFiles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.files = action.payload?.files as TResponseLoadFile[];
        state.error = null;
      })
      .addCase(loadFiles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      //-- Обработка состояний работы при отправке файлов на сервер--//
      .addCase(uploadFiles.pending, (state) => {
        state.isLoading = true;
        state.isUpload = false;
        state.error = null;
      })
      .addCase(uploadFiles.fulfilled, (state) => {
        state.isLoading = false;
        state.isUpload = true;
        state.error = null;
      })
      .addCase(uploadFiles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default attachmentsSlice.reducer;
