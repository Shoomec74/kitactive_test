import { getCookie } from '../auth/auth';

//-- Базовый URL API --//
const BASE_URL = 'https://js-test.kitactive.ru';

//-- Расширенный интерфейс стандартного Response для добавления типизации к методу json() --//
interface IResponse<T> extends Response {
  json(): Promise<T>;
}

//-- Тип для опций fetch-запроса --//
type TOptions = {
  headers?: { authorization?: string; 'Content-Type': string };
  method?: string;
  body?: string | FormData;
};

//-- Тип для параметров запроса --//
type TReq = {
  uri: string;
  auth?: boolean;
  data?: Record<string, unknown>;
  attachments?: File[];
  id?: string;
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
};

//-- Базовые параметры для заголовков запроса --//
const BASE_PARAMS = {
  headers: {
    'Content-Type': 'application/json',
  },
};

//-- Функция для подготовки параметров запроса --//
function getReqParams({ uri, id, method, data, attachments, auth }: TReq) {
  const params: TOptions = {
    ...BASE_PARAMS,
    method,
  };
  //-- Формирование полного пути запроса --//
  const path = `${BASE_URL}/${uri}${id ? `/${id}` : ''}`;
  //-- Добавление токена авторизации, если требуется --//
  if (auth) {
    params.headers!.authorization = `Bearer ${getCookie('token') || ''}`;
  }

  //-- Добавление вложений как FormData, если они есть --//
  if (attachments) {
    const formData = new FormData();

    attachments.forEach((file: File) => {
      formData.append(`files[]`, file);
    });

    params.body = formData;
    //-- Удаление заголовка 'Content-Type', чтобы браузер мог самостоятельно установить нужный тип содержимого для FormData --//
    //@ts-ignore
    delete params.headers['Content-Type'];
  }

  //-- Добавление тела запроса в формате JSON, если есть данные --//
  if (data) {
    params.headers = {
      ...params.headers,
      'Content-Type': 'application/json',
    };
    params.body = JSON.stringify(data);
  }
  return { path, params };
}

//-- Функция проверки ответа сервера --//
export function checkRes<T>(res: IResponse<T>): Promise<T> | Promise<never> {
  //-- Если статус ответа OK, возвращаем результат вызова .json() --//
  if (res.ok) {
    return res.json();
  }
  //-- В случае ошибки возвращаем Promise.reject с описанием ошибки --//
  return Promise.reject([`Ошибка ${res.status}`, res.json()]);
}

//-- Общая функция для выполнения запросов --//
function request<T>(url: string, options: TOptions): Promise<T> {
  //-- Выполняем запрос и обрабатываем ответ через checkRes --//
  return fetch(url, options).then(checkRes);
}

//-- Функции для выполнения запросов определенных типов --//
export function getReq<T>(options: TReq) {
  //-- Подготовка параметров для GET-запроса --//
  const { path, params } = getReqParams({ ...options, method: 'GET' });
  return request<T>(path, params);
}

export function postReq<T>(options: TReq) {
  //-- Подготовка параметров для POST-запроса --//
  const { path, params } = getReqParams({ ...options, method: 'POST' });
  return request<T>(path, params);
}

export function patchReq<T>(options: TReq) {
  //-- Подготовка параметров для PATCH-запроса --//
  const { path, params } = getReqParams({ ...options, method: 'PATCH' });
  return request<T>(path, params);
}

export function deleteReq<T>(options: TReq) {
  //-- Подготовка параметров для DELETE-запроса --//
  const { path, params } = getReqParams({ ...options, method: 'DELETE' });
  return request<T>(path, params);
}

export default {
  patchReq,
  postReq,
  getReq,
};
