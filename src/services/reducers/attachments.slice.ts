import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  deleteFileApi,
  loadFilesApi,
  uploadFilesApi,
} from '../../attachments/attchments';
import { TResponseLoadFile } from '../../utils/types/attachments';

type TAuthorizationState = {
  isLoadingAttachments: boolean;
  serverFiles: TResponseLoadFile[];
  isLogin: boolean;
  isUpload: boolean;
  error: string | null;
};

const initialState: TAuthorizationState = {
  isLoadingAttachments: false,
  serverFiles: [],
  isLogin: false,
  isUpload: false,
  error: null,
};

//-- Асинхронное thunk-действие получения фалов с сервера --//
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

//-- Асинхронное thunk-действие загрузки файлов на сервер --//
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

//-- Асинхронное thunk-действие удаление файла --//
export const deleteFile = createAsyncThunk(
  '/api/media/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await deleteFileApi(id);
      return { response, id };
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
      //-- Обработка состояний работы при загрузке файлов с сервера --//
      .addCase(loadFiles.pending, (state) => {
        state.isLoadingAttachments = true;
        state.error = null;
      })
      .addCase(loadFiles.fulfilled, (state, action) => {
        state.isLoadingAttachments = false;
        state.serverFiles = action.payload?.files as TResponseLoadFile[];
        state.error = null;
      })
      .addCase(loadFiles.rejected, (state, action) => {
        state.isLoadingAttachments = false;
        state.error = action.payload as string;
      })

      //-- Обработка состояний работы при отправке файлов на сервер--//
      .addCase(uploadFiles.pending, (state) => {
        state.isLoadingAttachments = true;
        state.isUpload = false;
        state.error = null;
      })
      .addCase(uploadFiles.fulfilled, (state) => {
        state.isLoadingAttachments = false;
        state.isUpload = true;
        state.error = null;
      })
      .addCase(uploadFiles.rejected, (state, action) => {
        state.isLoadingAttachments = false;
        state.error = action.payload as string;
      })

      //-- Обработка состояний работы при отправке файлов на сервер--//
      .addCase(deleteFile.pending, (state) => {
        state.isLoadingAttachments = true;
        state.error = null;
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.isLoadingAttachments = false;
        const fileId = action.payload?.id;
        state.serverFiles = state.serverFiles.filter((file) => file.id !== fileId);
        state.error = null;
      })
      .addCase(deleteFile.rejected, (state, action) => {
        state.isLoadingAttachments = false;
        state.error = action.payload as string;
      });
  },
});

export default attachmentsSlice.reducer;
