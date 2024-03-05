import { TUserSignupData, TSigninResponse, TSignupResponse, TUserSigninData, TSignoutResponse } from '../utils/types/auth';

import { postReq } from '../api/api';

// запрос регистрации
function signupApi(userInfo: TUserSignupData) {
  return postReq<TSignupResponse>({ uri: 'api/register', data: userInfo });
}

// запрос авторизации
function signinApi(userInfo: TUserSigninData) {
  return postReq<TSigninResponse>({ uri: 'api/login', data: userInfo });
}

// Запрос на выход из аккаунта
function logoutApi(token: string) {
  return postReq<TSignoutResponse>({ uri: 'api/logout', data: token });
}

export { signupApi, signinApi, logoutApi };


const getCookie = (name: string): string | undefined => {
  const matches = document.cookie.match(
    new RegExp(
      '(?:^|; )' +
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
        '=([^;]*)'
    )
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
};

function setCookie(name: string, value: string, props?: any): void {
  props = props || {};
  let exp = props.expires;
  if (typeof exp == 'number' && exp) {
    const d = new Date();
    d.setTime(d.getTime() + exp * 20000);
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
      updatedCookie += '=' + propValue;
    }
  }
  document.cookie = updatedCookie;
}

function deleteCookie(name: string): void {
  setCookie(name, '', { expires: -1 });
}

export {
  getCookie,
  setCookie,
  deleteCookie,
};
