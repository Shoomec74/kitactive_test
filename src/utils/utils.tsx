import AudioFileIcon from '@mui/icons-material/AudioFile';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import ArticleIcon from '@mui/icons-material/Article';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { FC } from 'react';

interface IFileType {
  fileType: string;
}

//-- Вспомогательный компонент возвращий иконку в зависмости от типа вложения --//
export const getFileIcon: FC<IFileType> = ({
  fileType,
}): JSX.Element | null => {
  const iconStyle = { width: 'inherit', height: 'inherit', color: '#eee' };

  if (fileType.startsWith('image/')) {
    return null;
  } else if (fileType.startsWith('audio/')) {
    return <AudioFileIcon style={iconStyle} />;
  } else if (fileType.startsWith('video/')) {
    return <VideoFileIcon style={iconStyle} />;
  } else if (
    fileType.startsWith('text/') ||
    fileType.includes('word') ||
    fileType.includes('excel') ||
    fileType.includes('pdf')
  ) {
    return <ArticleIcon style={iconStyle} />;
  } else {
    return <InsertDriveFileIcon style={iconStyle} />;
  }
};
