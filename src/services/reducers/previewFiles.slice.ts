import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { FileRejection } from 'react-dropzone';

type TFilesState = {
  acceptedFiles: File[];
  rejectedFiles: FileRejection[];
  previewFilesIsClear: boolean;
};

const initialState: TFilesState = {
  acceptedFiles: [],
  rejectedFiles: [],
  previewFilesIsClear: true,
};

export const previewFilesSlice = createSlice({
  name: 'previewFiles',
  initialState: initialState,
  reducers: {
    //-- Действие по добавлению состояния одобренных файлов для загрузки на сервер --//
    setPreviewAcceptedFiles: (state, action: PayloadAction<File>) => {
      state.acceptedFiles.push(action.payload);
      state.previewFilesIsClear = false;
    },

    //-- Действие по добавлению состояния не одобренных файлов для отображения пользователю --//
    setPreviewRejectedFiles: (
      state,
      action: PayloadAction<FileRejection[]>,
    ) => {
      state.rejectedFiles = [...state.rejectedFiles, ...action.payload];
      state.previewFilesIsClear = false;
    },

    //-- Действие по очистке состояния превью всех файлов --//
    removePreviewFiles: (state) => {
      state.acceptedFiles = [];
      state.rejectedFiles = [];
      state.previewFilesIsClear = true;
    },
  },
});

export const {
  setPreviewAcceptedFiles,
  setPreviewRejectedFiles,
  removePreviewFiles,
} = previewFilesSlice.actions;

export default previewFilesSlice.reducer;
