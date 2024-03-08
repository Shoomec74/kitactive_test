import { FC } from 'react';
import styles from './AppHeader.module.less';
import {
  Button,
  Input,
  PasswordInput,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { useAppDispatch, useAppSelector } from '../../services/hooks/hooks';
import { signOut } from '../../services/reducers/authorization.slice';
import { getCookie } from '../../auth/auth';
import DropZone from '../DropZone/DropZone';
import { removePreviewFiles } from '../../services/reducers/previewFiles.slice';

const AppHeader: FC = () => {
  const dispatch = useAppDispatch();
  const token = getCookie('token');

  const onButtonClick = () => {
    if (token) {
      dispatch(signOut());
    }
  };

  //-- Функция для удаления всех выбранных файлов --//
  const removeButtonClick = () => {
    dispatch(removePreviewFiles());
  };

  const handlerSubmitButton = () => {};

  const { user, isLoading, acceptedFiles, rejectedFiles } = useAppSelector(
    (state) => ({
      user: state.auth.user, // Обновили путь к состоянию
      isLoading: state.auth.isLoading,
      acceptedFiles: state.previewFiles.acceptedFiles, // Обновили путь к состоянию
      rejectedFiles: state.previewFiles.rejectedFiles,
    })
  );

  return (
    <header className={styles.header}>
      <div className={styles.logo}></div>

      <DropZone />
      <Button
        type="primary"
        size="small"
        disabled={!acceptedFiles.length && !rejectedFiles.length}
        onClick={removeButtonClick}
        htmlType="button"
      >
        Удалить все превью файлов
      </Button>

      <Button
        type="primary"
        size="small"
        disabled={isLoading || !acceptedFiles.length}
        onClick={handlerSubmitButton}
        htmlType="submit"
      >
        {isLoading ? 'Подождите' : 'Загрузить файлы на сервер'}
      </Button>

      <Button
        type="primary"
        size="small"
        disabled={isLoading}
        onClick={onButtonClick}
        htmlType="button"
      >
        {isLoading ? 'Подождите' : 'Выйти'}
      </Button>
    </header>
  );
};

export default AppHeader;
