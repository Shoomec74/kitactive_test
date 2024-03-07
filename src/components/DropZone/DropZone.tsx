import React, { useCallback, useState } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import styles from './DropZone.module.less';

function MyDropzone() {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);
  const [rejectedFiles, setRejectedFiles] = useState<FileRejection[]>([]);
  const { thumbsContainer, thumb, thumbInner, img } = styles;

  // Функция для симуляции загрузки
  const simulateUpload = (file: File) => {
    const fileSize = file.size;
    let uploaded = 0;
    setUploading(true);

    const interval = setInterval(() => {
      // Увеличиваем 'uploaded' и обновляем прогресс
      uploaded += fileSize / 20; // Симулируем скорость загрузки
      const progress = Math.min(100, (uploaded / fileSize) * 100);
      setProgress(progress);

      if (uploaded >= fileSize) {
        clearInterval(interval);
        setUploading(false);
        setProgress(0); // Сброс прогресса после загрузки
      }
    }, 100);
  };

  const fileSize = (file: File) => {
    if (file.size > 1024 * 1024) {
      // Пример ограничения размера файла 1МБ
      return {
        code: 'too-large',
        message: `Размер файла превышает 1МБ`,
      };
    }
    return null;
  };

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (acceptedFiles?.length) {
        setAcceptedFiles((previousFiles: File[]) => [
          ...previousFiles,
          ...acceptedFiles.map((file: File) =>
            Object.assign(file, { preview: URL.createObjectURL(file) })
          ),
        ]);
      }

      if (rejectedFiles?.length) {
        setRejectedFiles((previousFiles: FileRejection[]) => [
          ...previousFiles,
          ...rejectedFiles,
        ]);
      }
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    validator: fileSize,
  });

  const acceptedFileItems = acceptedFiles.map((file: File) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

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

  const removeAll = () => {
    acceptedFiles.map((file) =>
      console.log(`acceptedFiles - ${JSON.stringify(file)}`)
    );
    rejectedFiles.map((file) => console.log(`rejectedFiles - ${file}`));
    setAcceptedFiles([]);
    setRejectedFiles([]);
  };

  const previews = acceptedFiles.map((file: File) => (
    <div className={thumb} key={file.name}>
      <div className={thumbInner}>
        <img
          src={file.preview}
          className={img}
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
        />
      </div>
    </div>
  ));

  return (
    <>
      <div {...getRootProps()} className={styles.dndZone}>
        <input {...getInputProps()} />
        {uploading ? (
          <div>
            <p>Загрузка...</p>
            <progress value={progress} max="100" />
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
