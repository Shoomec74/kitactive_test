import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/hooks/hooks';
import styles from './PreviewFiles.module.less';
import { FileRejection } from 'react-dropzone';
import FileUploadPreview from '../FileUploadPreview/FileUploadPreview';
import { TResponseLoadFile } from '../../utils/types/attachments';
import ServerFilesList from '../ServerFilesList/ServerFilesList';
import { loadFiles } from '../../services/reducers/attachments.slice';
import { removePreviewFiles } from '../../services/reducers/previewFiles.slice';

const PreviewFiles: FC = () => {
  //-- Ссылки на стили для элементов предварительного просмотра --//
  const { content, sectionBox, titleWrapper, sectionWrapper, sectionTitle } =
    styles;

  //-- Инициализация состояний для хранения информации о прогрессе загрузки, статусе загрузки, принятых и отклоненных файлах --//
  const { acceptedFiles, rejectedFiles, serverFiles, isUpload } =
    useAppSelector((state) => ({
      acceptedFiles: state.previewFiles.acceptedFiles,
      rejectedFiles: state.previewFiles.rejectedFiles,
      serverFiles: state.attachments.serverFiles,
      isUpload: state.attachments.isUpload,
    }));

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadFiles());
    dispatch(removePreviewFiles());
  }, [isUpload]);

  const previewsFiles = [...acceptedFiles, ...rejectedFiles];

  return (
    <main className={content}>
      <div className={titleWrapper}>
        <h2 className={sectionTitle}>Предосмотр загружаемых файлов</h2>
        <h2 className={sectionTitle}>Файлы на сервере</h2>
      </div>
      <div className={sectionWrapper}>
        <section className={sectionBox}>
          <ul>
            {previewsFiles.map((item: File | FileRejection, index) => {
              return (
                //@ts-ignore
                <FileUploadPreview file={item} key={`${item.name}${index}`} />
              );
            })}
          </ul>
        </section>
        <section className={sectionBox}>
          {serverFiles.map((item: TResponseLoadFile) => {
            return <ServerFilesList file={item} key={item.id} />;
          })}
        </section>
      </div>
    </main>
  );
};

export default PreviewFiles;
