import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import styles from './DropZone.module.less';
import { useAppDispatch, useAppSelector } from '../../services/hooks/hooks';
import {
  setPreviewAcceptedFiles,
  setPreviewRejectedFiles,
} from '../../services/reducers/previewFiles.slice';

const MAX_SIZE = 1024 * 1024;
const MAX_FILES = 19;

const DropZone: FC = () => {
  //-- Ссылки на стили для элементов предварительного просмотра --//
  const { dndZone, progressBar, progressFiller, dndZoneText } = styles;

  //-- Если когда-то понадобится сохранять большие файлы то можно отображать процесс загрузкт сначала в память браузера --//
  const [filesProcessed, setFilesProcessed] = useState(0);

  //-- Состояние для визуализации прогрессбара --//
  const [totalFiles, setTotalFiles] = useState(0);

  //-- Состояние для отслеживания общего размера вложений --//
  const [totalSize, setTotalSize] = useState(0);

  const dispatch = useAppDispatch();

  //-- Инициализация состояний для хранения информации о прогрессе загрузки, статусе загрузки, принятых и отклоненных файлах --//
  const { acceptedFiles, serverFiles, previewFilesIsClear } = useAppSelector((state) => ({
    acceptedFiles: state.previewFiles.acceptedFiles,
    serverFiles: state.attachments.serverFiles,
    previewFilesIsClear: state.previewFiles.previewFilesIsClear,
  }));

  //-- После загрузки файлов на сервер обновляем лимит по размеру вложений и обновляем счетчик загруженных файлов на странице --//
  const totalLoadedFiles = useMemo(() => {
    setTotalSize(0);
    return serverFiles.length;
  }, [serverFiles]);

  //-- После очистки превью файлов обновляем лимит по размеру вложений --//
  const clearTotalSize = useMemo(() => {
    if(previewFilesIsClear){
      setTotalSize(0);
    }
  }, [previewFilesIsClear]);

  //-- Обновляем допустимое кол-во разрешенных файлов к загрузке --//
  const allowLoadedFiles = useMemo(() => {
    return MAX_FILES - (serverFiles.length + acceptedFiles.length);
  }, [serverFiles, acceptedFiles]);

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
    async (
      onDropAcceptedFiles: File[],
      onDropRejectedFiles: FileRejection[],
    ) => {
      let totalAccepted = MAX_FILES - serverFiles.length - acceptedFiles.length;
      let totalLoadedSize = totalSize;
      setTotalFiles(onDropAcceptedFiles.length);

      const newRejected = [];

      for (const file of onDropAcceptedFiles) {
        //-- Имитация зарузки для визуализации процесса добавления файлов--//
        await new Promise((resolve) => setTimeout(resolve, 100)); // Имитация задержки

        if (totalAccepted > 0 && totalLoadedSize + file.size <= MAX_SIZE) {
          // @ts-ignore
          file.preview = URL.createObjectURL(file);
          // Если не превышены лимиты по количеству и размеру, принимаем файл
          dispatch(setPreviewAcceptedFiles(file));
          totalLoadedSize += file.size;
          totalAccepted--;
          setTotalSize(totalLoadedSize);
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

      dispatch(
        setPreviewRejectedFiles([...onDropRejectedFiles, ...newRejected]),
      );
      setFilesProcessed(0);
      setTotalFiles(0);
    },
    [serverFiles, acceptedFiles, totalSize],
  );

  //-- Использование useDropzone для интеграции функционала drag-n-drop с кастомной логикой валидации и обработки файлов --//
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    validator: fileSize,
    disabled: filesProcessed > 0,
  });

  return (
    <>
      <div {...getRootProps({ className: dndZone })}>
        <input {...getInputProps()} />
        {totalFiles > 0 ? (
          <div>
            <p className={dndZoneText}>Загрузка...</p>
            <div className={progressBar}>
              <div
                className={progressFiller}
                style={{ width: `${(filesProcessed / totalFiles) * 100}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <>
            <p className={dndZoneText}>
              Перетащите файлы сюда или кликните, чтобы выбрать файлы для
              загрузки.
            </p>
            {acceptedFiles.length || totalLoadedFiles > 0 ? (
              <p className={dndZoneText}>
                Вы загрузили - {acceptedFiles.length + totalLoadedFiles} файлов,
                осталось {allowLoadedFiles}
              </p>
            ) : (
              <p className={dndZoneText}>Максимум 20 файлов</p>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default DropZone;
