import { FC, useEffect, useState } from 'react';
import styles from './ServerFilesList.module.less';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { getFileIcon } from '../../utils/utils';
import { TResponseLoadFile } from '../../utils/types/attachments';
import { getCookie } from '../../auth/auth';

interface IProps {
  file: TResponseLoadFile;
}

const ServerFilesList: FC<IProps> = ({ file }) => {
  const [previewUrl, setPreviewUrl] = useState<string>();
  const { previewInfo, img, filename, removeButton } = styles;

  // Функция для удаления файла
  const handleRemoveFile = () => {
    console.log(`Удаление файла с ID: ${file.id}`);
  };

  const cookie = getCookie('token');

  useEffect(() => {
    fetch(file.url, {
      headers: {
        Authorization: `Bearer ${cookie}`,
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        // После использования URL, рекомендуется освободить его через URL.revokeObjectURL(url), но это лучше делать после удаления или размонтирования компонента.
      })
      .catch((error) => console.error('Ошибка загрузки изображения:', error));
  }, [file]);

  // Рендер иконки в зависимости от mimeType
  const renderFileIcon = () => {
    if (file.mimeType.startsWith('image/')) {
      return (
        <a href={previewUrl} download={file.fileName}>
          <img
            src={previewUrl}
            className={img}
            alt={`Preview of ${file.fileName}`}
          />
        </a>
      );
    } else {
      // Используем функцию для получения компонента иконки для не-изображений
      return (
        <a href={previewUrl} download={file.fileName}>
          <div className={img}>{getFileIcon({ fileType: file.mimeType })}</div>
        </a>
      );
    }
  };

  return (
    <li className={previewInfo}>
      {/* Рендер превью или иконки */}
      {renderFileIcon()}
      <p className={filename}>{file.fileName}</p>
      <button onClick={handleRemoveFile} className={removeButton}>
        <HighlightOffIcon style={{ color: 'red' }} />
      </button>
    </li>
  );
};

export default ServerFilesList;
