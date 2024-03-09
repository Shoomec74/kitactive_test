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
  //-- Инициализация состояний для хранения информации о прогрессе загрузки, статусе загрузки, принятых и отклоненных файлах --//
  const { acceptedFiles, rejectedFiles, files, isUpload} = useAppSelector(
    (state) => ({
      acceptedFiles: state.previewFiles.acceptedFiles,
      rejectedFiles: state.previewFiles.rejectedFiles,
      files: state.attachments.files,
      isUpload: state.attachments.isUpload,
    })
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadFiles());
    dispatch(removePreviewFiles());
  }, [isUpload]);

  //-- Ссылки на стили для элементов предварительного просмотра --//
  const { content, allowFiles, titleWrapper, sectionWrapper, sectionTitle } = styles;

  const previewsFiles = [...acceptedFiles, ...rejectedFiles];

  return (
    <main className={content}>
      <div className={titleWrapper}>
        <h2 className={sectionTitle}>Предосмотр загружаемых файлов</h2>
        <h2 className={sectionTitle}>Файлы на сервере</h2>
      </div>
      <div className={sectionWrapper}>
        <section className={allowFiles}>
          <ul>
            {previewsFiles.map((item: File | FileRejection) => {
              //@ts-ignore
              return <FileUploadPreview file={item} key={item.name} />;
            })}
          </ul>
        </section>
        <section className={allowFiles}>
          {files.map((item: TResponseLoadFile) => {
            return <ServerFilesList file={item} key={item.name} />;
          })}
        </section>
      </div>
    </main>
  );
};

export default PreviewFiles;
