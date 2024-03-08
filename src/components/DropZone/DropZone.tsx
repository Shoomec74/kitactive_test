import React, { useCallback, useState } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import styles from './DropZone.module.less';
import { useAppDispatch, useAppSelector } from '../../services/hooks/hooks';
import {
  setPreviewAcceptedFiles,
  setPreviewRejectedFiles,
} from '../../services/reducers/previewFiles.slice';

const MAX_SIZE = 1024 * 1024; // Максимальный размер файлов в байтах (1MB)
const MAX_FILES = 20; // Максимальное количество файлов

function DropZone() {
  //-- Инициализация состояний для хранения информации о прогрессе загрузки, статусе загрузки, принятых и отклоненных файлах --//
  const { acceptedFiles, rejectedFiles } = useAppSelector((state) => ({
    acceptedFiles: state.previewFiles.acceptedFiles, // Обновили путь к состоянию
    rejectedFiles: state.previewFiles.rejectedFiles,
    //loadingFiles: state.previewFiles.loadingFiles,
  }));

  //-- Если когда-то понадобится сохранять большие файлы то можно отображать процесс загрузкт сначала в память браузера --//
  const [filesProcessed, setFilesProcessed] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);

  const dispatch = useAppDispatch();

  //-- Ссылки на стили для элементов предварительного просмотра --//
  const { dndZone, progressBar, progressFiller, component } = styles;

  //-- Функция fileSize валидирует размер файла, возвращая ошибку, если файл превышает 1МБ --//
  const fileSize = (file: File) => {
    if (file.size > 1024 * 1024) {
      //-- Проверка, что размер файла больше 1МБ --//
      return {
        code: 'too-large',
        message: `Размер файла превышает 1МБ`,
      };
    }
    return null; //-- Возвращение null, если размер файла не превышает лимит --//
  };

  //-- Функция onDrop обрабатывает событие перетаскивания файлов в зону загрузки, обновляя состояния принятых и отклоненных файлов --//
  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      setTotalFiles(acceptedFiles.length);

      let totalLoadedFiles = 18;
      let totalLoadedSize = 0;
      const newRejected = [];

      for (const file of acceptedFiles) {
        await new Promise((resolve) => setTimeout(resolve, 100)); // Имитация задержки

        const fileData = {
          preview: URL.createObjectURL(file),
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
        };

        if (
          totalLoadedFiles < MAX_FILES &&
          totalLoadedSize + file.size <= MAX_SIZE
        ) {
          // Если не превышены лимиты по количеству и размеру, принимаем файл
          dispatch(setPreviewAcceptedFiles(fileData));
          totalLoadedSize += file.size;
          totalLoadedFiles++;
        } else {
          // Иначе, файл попадает в массив отклонённых
          const message = `Превышен лимит в ${MAX_FILES} файлов или общий размер файлов превышает 1mb`;
          newRejected.push({
            file,
            errors: [{ code: 'limit-exceeded', message }],
          });
        }

        setFilesProcessed((prevCount) => prevCount + 1);
      }

      dispatch(setPreviewRejectedFiles([...rejectedFiles, ...newRejected]));
      setFilesProcessed(0);
      setTotalFiles(0);
    },
    []
  );

  //-- Использование useDropzone для интеграции функционала drag-n-drop с кастомной логикой валидации и обработки файлов --//
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    validator: fileSize,
  });

  return (
    <>
      <div {...getRootProps({ className: dndZone })}>
        <input {...getInputProps()} />
        {totalFiles > 0 ? (
          <div>
            <p>Загрузка...</p>
            <div className={progressBar}>
              <div
                className={progressFiller}
                style={{ width: `${(filesProcessed / totalFiles) * 100}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <>
            <p>
              Перетащите файлы сюда или кликните, чтобы выбрать файлы для
              загрузки.
            </p>
            {acceptedFiles.length ? (
              <p>
                Вы загрузили - {acceptedFiles.length} файлов, осталось{' '}
                {20 - acceptedFiles.length}
              </p>
            ) : (
              <p>Максимум 20 файлов</p>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default DropZone;
