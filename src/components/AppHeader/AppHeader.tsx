import { FC } from 'react';
import styles from './AppHeader.module.less';
import { Button } from '@ya.praktikum/react-developer-burger-ui-components';
import { useAppDispatch, useAppSelector } from '../../services/hooks/hooks';
import { signOut } from '../../services/reducers/authorization.slice';
import { getCookie } from '../../auth/auth';
import DropZone from '../DropZone/DropZone';
import { removePreviewFiles } from '../../services/reducers/previewFiles.slice';
import { uploadFiles } from '../../services/reducers/attachments.slice';

const AppHeader: FC = () => {
  const dispatch = useAppDispatch();
  const token = getCookie('token');
  const { header, logo } = styles;

  const { isLoading, acceptedFiles, rejectedFiles, isLoadingAttachments } =
    useAppSelector((state) => ({
      isLoading: state.auth.isLoading,
      acceptedFiles: state.previewFiles.acceptedFiles,
      rejectedFiles: state.previewFiles.rejectedFiles,
      isLoadingAttachments: state.attachments.isLoadingAttachments,
    }));

  //-- Функция для выхода пользователя из прилоджения --//
  const logoutButtonClick = () => {
    if (token) {
      dispatch(signOut());
    }
  };

  //-- Функция для удаления всех выбранных файлов --//
  const removePreviewFilesButtonClick = () => {
    dispatch(removePreviewFiles());
  };

  //-- Функция для загрузки файлов --//
  const uploadFilesButtonClick = () => {
    dispatch(uploadFiles(acceptedFiles));
  };

  return (
    <header className={header}>
      <div className={logo}></div>
      {/* Компонент для дропа файлов в загрузку */}
      <DropZone />
      {/* Компоненты кнопок для удаления превью файлов, загрузки файлов и выхода из приложения */}
      <Button
        type="primary"
        size="small"
        disabled={
          (!acceptedFiles.length && !rejectedFiles.length) ||
          isLoadingAttachments
        }
        onClick={removePreviewFilesButtonClick}
        htmlType="button"
      >
        Удалить превью файлов
      </Button>

      <Button
        type="primary"
        size="small"
        disabled={isLoading || !acceptedFiles.length || isLoadingAttachments}
        onClick={uploadFilesButtonClick}
        htmlType="button"
      >
        {isLoading ? 'Подождите' : 'Загрузить файлы на сервер'}
      </Button>

      <Button
        type="primary"
        size="small"
        disabled={isLoading || isLoadingAttachments}
        onClick={logoutButtonClick}
        htmlType="button"
      >
        {isLoading ? 'Подождите' : 'Выйти'}
      </Button>
    </header>
  );
};

export default AppHeader;
