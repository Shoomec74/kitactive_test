/* eslint-disable prefer-promise-reject-errors */
import { getCookie } from '../auth/auth';

const BASE_URL = 'https://js-test.kitactive.ru';

interface IResponse<T> extends Response {
  json(): Promise<T>;
}

type TOptions = {
  headers?: { authorization?: string; 'Content-Type': string };
  method?: string;
  body?: string | FormData;
};

type TReq = {
  uri: string;
  auth?: boolean;
  data?: Record<string, unknown>;
  attachments?: File[];
  id?: string;
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
};

const BASE_PARAMS = {
  headers: {
    'Content-Type': 'application/json',
  },
};

function getReqParams({ uri, id, method, data, attachments, auth }: TReq) {
  const params: TOptions = {
    ...BASE_PARAMS,
    method,
  };
  const path = `${BASE_URL}/${uri}${id ? `/${id}` : ''}`;
  if (auth) {
    params.headers!.authorization = `Bearer ${getCookie('token') || ''}`;
  }

  if (attachments) {
    const formData = new FormData();
    
    attachments.forEach((file: File) => {
      formData.append(`files[]`, file);
    });

    // Не используйте JSON.stringify здесь, напрямую присвойте formData в body
    params.body = formData;
    // Удаляем 'Content-Type': 'application/json' для этого запроса чтобы браузер установил Blob сам
    //@ts-ignore
    delete params.headers['Content-Type'];
  }

  if (data) {
    params.headers = {
      ...params.headers,
      'Content-Type': 'application/json',
    };
    params.body = JSON.stringify(data);
  }
  return { path, params };
}

/**
 * @template T
 * @param {IResponse<T>} res объект с полученным от сервера ответом. Должен иметь метод .json()
 * @returns {(Promise<T> | Promise<never>)} промис с парсированным объектом response или Promise.reject([`Ошибка ${res.status}`, res.json()])
 */
export function checkRes<T>(res: IResponse<T>): Promise<T> | Promise<never> {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject([`Ошибка ${res.status}`, res.json()]);
}

/**
 * @template T
 * @param {string} url добавачная строка `${BASE_URL}/${url}`
 * @param {TOptions} options объект настроек для fetch-запроса
 * @returns {Promise<T>} {(Promise<T> | Promise<never>)} промис с парсированным объектом response или `Promise.reject([Ошибка ${res.status}, res.json()])`
 */
function request<T>(url: string, options: TOptions): Promise<T> {
  return fetch(url, options).then(checkRes);
}

export function getReq<T>(options: TReq) {
  const { path, params } = getReqParams({ ...options, method: 'GET' });
  return request<T>(path, params);
}

export function postReq<T>(options: TReq) {
  const { path, params } = getReqParams({ ...options, method: 'POST' });
  return request<T>(path, params);
}

export function patchReq<T>(options: TReq) {
  const { path, params } = getReqParams({ ...options, method: 'PATCH' });
  return request<T>(path, params);
}

export function deleteReq<T>(options: TReq) {
  const { path, params } = getReqParams({ ...options, method: 'DELETE' });
  return request<T>(path, params);
}

export default {
  patchReq,
  postReq,
  getReq,
};
