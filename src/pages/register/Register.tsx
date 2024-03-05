import React, { FC, FormEvent } from 'react';
import registerStyles from './register.module.css';
import {
  Button,
  Input,
  PasswordInput,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { Link, useLocation, Navigate } from 'react-router-dom';
import useForm from '../../hooks/useForm/useForm';
import { getCookie } from '../../auth/auth';
import { useAppDispatch, useAppSelector } from '../../services/hooks/hooks';
import { signUp } from '../../services/reducers/authorization.slice';

export const Register: FC = () => {
  const { registerPage, form, link } = registerStyles;
  const dispatch = useAppDispatch();
  const location = useLocation();

  const { isLoading, isRegistered } = useAppSelector((state) => ({
    isLoading: state.auth.isLoading,
    isRegistered: state.auth.isRegistered,
  }));

  const initialValuesForm = {
    name: '',
    email: '',
    password: '',
  };

  const { values, handleChange, setValues } = useForm(initialValuesForm);
  const { name, email, password } = values;

  const handlerSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    dispatch(signUp({ name, email, password }));
    setValues(initialValuesForm);
  };

  const cookie = getCookie('token');

  if (!cookie && isRegistered) {
    return <Navigate to={'/login'} replace />;
  } else if (cookie) {
    return <Navigate to={location.state?.from || '/'} replace />;
  }

  return (
    <div className={registerPage}>
      <form className={form} onSubmit={handlerSubmit}>
        <h1 className="text text_type_main-medium mb-6">Регистрация</h1>
        <div className="mb-6">
          <Input
            type={'text'}
            placeholder={'Имя'}
            name={'name'}
            size={'default'}
            value={name}
            onChange={handleChange}
          />
        </div>
        <div className="mb-6">
          <Input
            type={'email'}
            placeholder={'E-mail'}
            name={'email'}
            size={'default'}
            value={email}
            onChange={handleChange}
          />
        </div>
        <div className="mb-6">
          <PasswordInput
            onChange={handleChange}
            value={password}
            name={'password'}
          ></PasswordInput>
        </div>
        <Button
          type="primary"
          size="medium"
          disabled={
            isLoading || !(name !== '' && email !== '' && password !== '')
          }
          htmlType={'submit'}
        >
          {isLoading ? 'Подождите...' : 'Зарегистрироваться'}
        </Button>
      </form>
      <p className="text text_type_main-default text_color_inactive mb-4 mt-20">
        Уже зарегистрировались?&nbsp;
        <Link className={`${link} text text_type_main-default`} to="/login">
          Войти
        </Link>
      </p>
    </div>
  );
};
