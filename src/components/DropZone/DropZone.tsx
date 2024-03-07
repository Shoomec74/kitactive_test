import React, { useCallback, useState } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import styles from './DropZone.module.less';

function MyDropzone() {
  //-- Инициализация состояний для хранения информации о прогрессе загрузки, статусе загрузки, принятых и отклоненных файлах --//
  const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);
  const [rejectedFiles, setRejectedFiles] = useState<FileRejection[]>([]);

  //-- Если когда-то понадобится сохранять большие файлы то можно отображать процесс загрузкт сначала в память браузера --//
  const [filesProcessed, setFilesProcessed] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);

  //-- Ссылки на стили для элементов предварительного просмотра --//
  const { thumbsContainer, thumb, thumbInner, img, progressBar } = styles;

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
      // Установка общего количества файлов
      setTotalFiles(acceptedFiles.length);

      // Асинхронно обрабатываем каждый принятый файл с задержкой
      for (const file of acceptedFiles) {
        // Задержка перед обработкой каждого файла
        await new Promise((resolve) => setTimeout(resolve, 100)); // Задержка в 1 секунду

        // Создание URL для предпросмотра и обновление состояния принятых файлов
        setAcceptedFiles((prevFiles) => [
          ...prevFiles,
          Object.assign(file, { preview: URL.createObjectURL(file) }),
        ]);

        // Увеличиваем счетчик обработанных файлов после каждой задержки
        setFilesProcessed((prevCount) => prevCount + 1);
      }

      // Обновление списка отклоненных файлов
      setRejectedFiles((previousFiles: FileRejection[]) => [
        ...previousFiles,
        ...rejectedFiles,
      ]);

      //-- Обновляем счетчики загрузки --//
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

  //-- Создание элементов списка для принятых файлов --//
  const acceptedFileItems = acceptedFiles.map((file: File) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  //-- Создание элементов списка для отклоненных файлов с детализацией ошибок --//
  const fileRejectionItems = rejectedFiles.map(({ file, errors }) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
      <ul>
        {errors.map((e) => (
          <li key={e.code}>{e.message}</li>
        ))}
      </ul>
    </li>
  ));

  //-- Функция для удаления всех выбранных файлов --//
  const removeAll = () => {
    acceptedFiles.map((file) =>
      console.log(`acceptedFiles - ${JSON.stringify(file)}`)
    );
    rejectedFiles.map((file) => console.log(`rejectedFiles - ${file}`));
    setAcceptedFiles([]); //-- Сброс списка принятых файлов --//
    setRejectedFiles([]); //-- Сброс списка отклоненных файлов --//
  };

  //-- Генерация предпросмотров для принятых файлов --//
  const previews = acceptedFiles.map((file: File) => (
    <div className={thumb} key={file.name}>
      <div className={thumbInner}>
        <img
          src={file.preview} //-- Использование URL для предпросмотра файла --//
          className={img}
          onLoad={() => {
            URL.revokeObjectURL(file.preview); //-- Освобождение URL после загрузки изображения для экономии памяти --//
          }}
        />
      </div>
    </div>
  ));

  return (
    <>
      <div {...getRootProps()} className={styles.dndZone}>
        <input {...getInputProps()} />
        {totalFiles > 0 ? (
          <div>
            <p>Загрузка...</p>
            <progress className={progressBar} value={filesProcessed} max={totalFiles}></progress>
          </div>
        ) : (
          <>
            <p>
              Перетащите файлы сюда или кликните, чтобы выбрать файлы для
              загрузки.
            </p>
            <em>
              (Only files with name less than 20 characters will be accepted)
            </em>
          </>
        )}
      </div>

      <div>
        <h2>Preview</h2>
        <button type="button" onClick={removeAll}>
          Remove all files
        </button>
      </div>
      <aside>
        <h4>Accepted files</h4>
        <ul>{acceptedFileItems}</ul>
        <h4>Rejected files</h4>
        <ul>{fileRejectionItems}</ul>
        <aside className={thumbsContainer}>{previews}</aside>
      </aside>
    </>
  );
}

export default MyDropzone;
