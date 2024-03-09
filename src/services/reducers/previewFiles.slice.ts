import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { FileRejection } from 'react-dropzone';

type TFilesState = {
  acceptedFiles: File[];
  rejectedFiles: FileRejection[];
};

const initialState: TFilesState = {
  acceptedFiles: [],
  rejectedFiles: [],
};

export const previewFilesSlice = createSlice({
  name: 'previewFiles',
  initialState: initialState,
  reducers: {
    setPreviewAcceptedFiles: (
      state,
      action: PayloadAction<File>
    ) => {
      state.acceptedFiles.push(action.payload);
    },
    setPreviewRejectedFiles: (
      state,
      action: PayloadAction<FileRejection[]>
    ) => {
      state.rejectedFiles = [...state.rejectedFiles, ...action.payload];
    },
    removePreviewFiles: (state) => {
      // При удалении файлов необходимо также освободить URL-адреса созданные для предпросмотра
      //state.acceptedFiles.forEach((file) => URL.revokeObjectURL(file.preview));
      state.acceptedFiles = [];
      state.rejectedFiles = [];
    },
  },
});

export const {
  setPreviewAcceptedFiles,
  setPreviewRejectedFiles,
  removePreviewFiles,
} = previewFilesSlice.actions;

export default previewFilesSlice.reducer;
