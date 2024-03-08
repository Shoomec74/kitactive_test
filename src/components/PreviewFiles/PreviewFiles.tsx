import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/hooks/hooks';
import styles from './PreviewFiles.module.less';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import ArticleIcon from '@mui/icons-material/Article';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { IFiles } from '../../services/reducers/previewFiles.slice';

function PreviewFiles() {
  //-- Инициализация состояний для хранения информации о прогрессе загрузки, статусе загрузки, принятых и отклоненных файлах --//
  const { acceptedFiles, rejectedFiles } = useAppSelector((state) => ({
    acceptedFiles: state.previewFiles.acceptedFiles, // Обновили путь к состоянию
    rejectedFiles: state.previewFiles.rejectedFiles,
  }));

  const dispatch = useAppDispatch();

  // useEffect(() => {
  //   // Этот код выполнится при размонтировании компонента
  //   return () => {
  //     acceptedFiles.forEach((file) => URL.revokeObjectURL(file.preview));
  //   };
  // }, [acceptedFiles]); // Зависимость от acceptedFiles гарантирует обновление списка URL

  //-- Ссылки на стили для элементов предварительного просмотра --//
  const {
    previewInfo,
    content,
    img,
    allowFiles,
    rejectFiles,
    filename,
    removeButton,
  } = styles;

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return null; // Иконка не нужна, будет отображено превью
    } else if (fileType.startsWith('audio/')) {
      return <AudioFileIcon style={{width:'inherit', height: 'inherit', color: '#eee' }} />;
    } else if (fileType.startsWith('video/')) {
      return <VideoFileIcon style={{width:'inherit', height: 'inherit', color: '#eee' }} />;
    } else if (
      fileType.startsWith('text/') ||
      fileType.includes('word') ||
      fileType.includes('excel') ||
      fileType.includes('pdf')
    ) {
      return <ArticleIcon style={{width:'inherit', height: 'inherit', color: '#eee' }}/>;
    } else {
      return <InsertDriveFileIcon style={{width:'inherit', height: 'inherit', color: '#eee' }}/>;
    }
  };

  function removeFile() {
    // Здесь ваша логика удаления файла из состояния
    console.log(`Удаление файла`);
    // Например, можно обновить состояние acceptedFiles, исключив из него файл с fileId
  }

  //-- Создание элементов списка для отклоненных файлов с детализацией ошибок --//
  const fileRejectionItems = rejectedFiles.map(({ file, errors }) => (
    <li key={file.name}>
      {file.name} - {file.size} bytes
      <ul>
        {errors.map((e) => (
          <li key={e.code}>{e.message}</li>
        ))}
      </ul>
    </li>
  ));

  //-- Генерация предпросмотров для принятых файлов --//
  const previews = acceptedFiles.map((file: IFiles) => {
    // Проверяем, является ли файл изображением
    const isImage = file.type.startsWith('image/');

    return (
      <li className={previewInfo} key={file.name}>
        {isImage ? (
          // Если файл является изображением, отображаем его превью
          <img src={file.preview} className={img} />
        ) : (
          // Если файл не является изображением, отображаем иконку документа
          <div className={img}>{getFileIcon(file.type)}</div>
        )}

        <p className={filename}>
          {file.name} - {file.size} bytes
        </p>
        <button onClick={removeFile} className={removeButton}>
          <HighlightOffIcon style={{ color: 'red' }} />
        </button>
      </li>
    );
  });

  return (
    <>
      <main className={content}>
        <section className={allowFiles}>
          <h2>Одобренные файлы</h2>
          <ul>{previews}</ul>
        </section>
        <section className={rejectFiles}>
          <h2>Отклоненные файлы</h2>
          <ul>{fileRejectionItems}</ul>
        </section>
      </main>
    </>
  );
}

export default PreviewFiles;
