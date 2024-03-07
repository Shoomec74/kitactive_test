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

const AppHeader: FC = () => {
  const dispatch = useAppDispatch();
  const token = getCookie('token');

  const onButtonClick = () => {
    console.log(token);
    if (token) {
      dispatch(signOut());
    }
  };

  const { user, isLoading } = useAppSelector((state) => ({
    user: state.auth.user, // Обновили путь к состоянию
    isLoading: state.auth.isLoading,
  }));

  const { name, email } = user;

  return (
    <header className={styles.header}>
      <div className={styles.logo}></div>
      <p>{email}</p>

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
