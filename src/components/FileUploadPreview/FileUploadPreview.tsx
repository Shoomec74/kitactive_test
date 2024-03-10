import { FC } from 'react';
import styles from './FileUploadPreview.module.less';
import { FileRejection } from 'react-dropzone';
import { getFileIcon } from '../../utils/utils';

interface IProps {
  file: File | FileRejection;
}

const FileUploadPreview: FC<IProps> = ({ file }) => {
  const { previewInfo, img, filename, removeButton, crossedOut } = styles;
  function removeFile() {
    // Здесь ваша логика удаления файла из состояния
    console.log(`Удаление файла`);
    // Например, можно обновить состояние acceptedFiles, исключив из него файл с fileId
  }

  const hasErrors = 'errors' in file && file.errors.length > 0; // Проверяем, есть ли ошибки

  const fileObj = file instanceof File ? file : file.file;

  // Проверяем, является ли файл изображением
  const isImage = fileObj.type.startsWith('image/');

  return (
    <li className={`${previewInfo} ${hasErrors ? crossedOut : ''}`}>
      {isImage ? (
        // Если файл является изображением, отображаем его превью
        <img
          //@ts-ignore
          src={fileObj.preview}
          className={img}
          onLoad={() => {
            //@ts-ignore
            URL.revokeObjectURL(fileObj.preview);
          }}
        />
      ) : (
        // Если файл не является изображением, отображаем иконку документа
        <div className={img}>{getFileIcon({ fileType: fileObj.type })}</div>
      )}

      <p className={filename}>
        {fileObj.name} - {fileObj.size} bytes
      </p>
    </li>
  );
};

export default FileUploadPreview;
