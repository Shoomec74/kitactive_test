//-- Базовый эндпоинт к серверу --//
export const BASE_API_URL: 'https://js-test.kitactive.ru' =
  'https://js-test.kitactive.ru';

//-- Базовый эндпоинт к серверу для авторизации --//
export const BASE_API_AUTH: string = `${BASE_API_URL}/auth`;

//-- actions для страницы регистрации --//
export const REGISTER_USER_REQUEST: 'REGISTER_USER_REQUEST' =
  'REGISTER_USER_REQUEST';
export const REGISTER_USER_SUCCESS: 'REGISTER_USER_SUCCESS' =
  'REGISTER_USER_SUCCESS';
export const REGISTER_USER_FALED: 'REGISTER_USER_FALED' = 'REGISTER_USER_FALED';

//-- actions для страницы логина --//
export const LOGIN_USER_REQUEST: 'LOGIN_USER_REQUEST' = 'LOGIN_USER_REQUEST';
export const LOGIN_USER_SUCCESS: 'LOGIN_USER_SUCCESS' = 'LOGIN_USER_SUCCESS';
export const LOGIN_USER_FALED: 'LOGIN_USER_FALED' = 'LOGIN_USER_FALED';

//-- actions для выхода --//
export const LOGOUT_USER_REQUEST: 'LOGOUT_USER_REQUEST' = 'LOGOUT_USER_REQUEST';
export const LOGOUT_USER_SUCCESS: 'LOGOUT_USER_SUCCESS' = 'LOGOUT_USER_SUCCESS';
export const LOGOUT_USER_FALED: 'LOGOUT_USER_FALED' = 'LOGOUT_USER_FALED';

