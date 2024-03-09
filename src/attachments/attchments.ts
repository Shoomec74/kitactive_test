import { postReq, getReq, deleteReq } from '../api/api';
import { TResponseLoadFiles } from '../utils/types/attachments';
import { TResponseOk } from '../utils/types/response';

function loadFilesApi() {
    return getReq<TResponseLoadFiles>({ uri: 'api/media', auth: true });
}

function uploadFilesApi(attachments: File[]) {
  return postReq<TResponseOk>({ uri: 'api/media/upload', attachments, auth: true });
}

function downloadFileApi(id: string) {
  return getReq<TResponseOk>({ uri: `api/media/${id}`, auth: true });
}

function deleteFileApi(id: string) {
  return deleteReq<TResponseOk>({ uri: `api/media/${id}`, auth: true });
}

export { loadFilesApi, uploadFilesApi, downloadFileApi, deleteFileApi };
