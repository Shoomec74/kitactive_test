import { postReq, getReq, deleteReq } from '../api/api';
import { TResponseLoadFiles } from '../utils/types/attachments';
import { TResponseOk } from '../utils/types/response';

//-- Функция для получения списка файлов с сервера --//
function loadFilesApi() {
  //-- Вызов GET-запроса к API для получения списка файлов. Авторизация требуется --//
  return getReq<TResponseLoadFiles>({ uri: 'api/media', auth: true });
}

//-- Функция для загрузки файлов на сервер --//
function uploadFilesApi(attachments: File[]) {
  //-- Вызов POST-запроса к API для загрузки файлов. Передаем массив файлов и указываем, что требуется авторизация --//
  return postReq<TResponseOk>({
    uri: 'api/media/upload',
    attachments,
    auth: true,
  });
}

//-- Функция для скачивания файла с сервера --//
function downloadFileApi(id: string) {
  //-- Вызов GET-запроса к API для скачивания файла по ID. Требуется авторизация --//
  return getReq<TResponseOk>({ uri: `api/media/${id}`, auth: true });
}

//-- Функция для удаления файла с сервера по его ID --//
function deleteFileApi(id: string) {
  //-- Вызов DELETE-запроса к API для удаления файла по ID. Требуется авторизация --//
  return deleteReq<TResponseOk>({ uri: `api/media/${id}`, auth: true });
}

export { loadFilesApi, uploadFilesApi, downloadFileApi, deleteFileApi };
