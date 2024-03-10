import {
  TUserSignupData,
  TSigninResponse,
  TSignupResponse,
  TUserSigninData,
  TSignoutResponse,
} from '../utils/types/auth';

import { postReq } from '../api/api';

//-- Функция для отправки запроса регистрации пользователя --//
function signupApi(userInfo: TUserSignupData) {
  //-- Отправляет данные пользователя на API для регистрации
  return postReq<TSignupResponse>({ uri: 'api/register', data: userInfo });
}

//-- Функция для отправки запроса авторизации пользователя --//
function signinApi(userInfo: TUserSigninData) {
  //-- Отправляет данные пользователя на API для авторизации --//
  return postReq<TSigninResponse>({ uri: 'api/login', data: userInfo });
}

//-- Функция для отправки запроса на выход из аккаунта --//
function logoutApi() {
  //-- Отправляет запрос на API для выхода из аккаунта, требует авторизации --//
  return postReq<TSignoutResponse>({ uri: 'api/logout', auth: true });
}

//-- Экспортирует функции API для их использования в других частях приложения --//
export { signupApi, signinApi, logoutApi };

//-- Функция для получения значения cookie по имени --//
const getCookie = (name: string): string | undefined => {
  // Ищет cookie с указанным именем и возвращает его значение, если находит --//
  const matches = document.cookie.match(
    new RegExp(
      '(?:^|; )' +
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
        '=([^;]*)',
    ),
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
};

//-- Функция для установки cookie --//
function setCookie(name: string, value: string, props?: any): void {
  //-- Принимает имя, значение и дополнительные свойства для cookie, устанавливает новое cookie --//
  props = props || {};
  let exp = props.expires;
  if (typeof exp == 'number' && exp) {
    const d = new Date();
    d.setTime(d.getTime() + exp * 20000); //-- Устанавливает время истечения cookie --//
    exp = props.expires = d;
  }
  if (exp && exp.toUTCString) {
    props.expires = exp.toUTCString();
  }
  value = encodeURIComponent(value);
  let updatedCookie = name + '=' + value;
  for (const propName in props) {
    updatedCookie += '; ' + propName;
    const propValue = props[propName];
    if (propValue !== true) {
      updatedCookie += '=' + propValue; //-- Добавляет дополнительные свойства к cookie --//
    }
  }
  document.cookie = updatedCookie; //-- Устанавливает cookie --//
}

//-- Функция для удаления cookie --//
async function deleteCookie(name: string): Promise<void> {
  //-- Удаляет cookie, устанавливая его время жизни в прошлое --//
  setCookie(name, '', { expires: -1 });
}

export { getCookie, setCookie, deleteCookie };
