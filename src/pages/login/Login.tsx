import loginStyles from './login.module.css';
import {
  Button,
  Input,
  PasswordInput,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { getCookie } from '../../auth/auth';
import useForm from '../../hooks/useForm/useForm';
import { FC, FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/hooks/hooks';
import { signIn } from '../../services/reducers/authorization.slice';

export const Login: FC = () => {
  const { loginPage, form, link } = loginStyles;
  const dispatch = useAppDispatch();
  const cookie = getCookie('token');
  const location = useLocation();
  const { isLoading, isLogin } = useAppSelector((state) => ({
    isLoading: state.auth.isLoading, // Обновили путь к состоянию
    isLogin: state.auth.isLogin,
  }));
  const initialValuesForm = { email: '', password: '' };
  const { values, handleChange, setValues } = useForm(initialValuesForm);
  const { email, password } = values;

  const handlerSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    dispatch(signIn({ email, password }));
    setValues(initialValuesForm);
  };

  if (cookie) {
    return <Navigate to={location.state?.from || '/'} replace />;
  }

  return (
    <div className={loginPage}>
      <form className={form} onSubmit={handlerSubmit}>
        <h1 className="text text_type_main-medium mb-6">Вход</h1>
        <div className="mb-6">
          <Input
            type={'email'}
            name={'email'}
            value={email}
            placeholder={'E-mail'}
            size={'default'}
            onChange={handleChange}
          />
        </div>
        <div className="mb-6">
          <PasswordInput
            value={password}
            name={'password'}
            onChange={handleChange}
          ></PasswordInput>
        </div>
        <Button
          type="primary"
          size="medium"
          disabled={isLoading || !(email !== '' && password !== '')}
          htmlType={'submit'}
        >
          {isLoading ? 'Подождите' : 'Войти'}
        </Button>
      </form>
      <p className="text text_type_main-default text_color_inactive mb-4 mt-20">
        Вы — новый пользователь?&nbsp;
        <Link className={`${link} text text_type_main-default`} to="/register">
          Зарегистрироваться
        </Link>
      </p>
    </div>
  );
};
