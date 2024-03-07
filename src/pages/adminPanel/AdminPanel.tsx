import AppHeader from '../../components/AppHeader/AppHeader';
import MyDropzone from '../../components/DropZone/DropZone';
import styles from './AdminPanel.module.less';

import Dropzone from 'react-dropzone';

const AdminPanel = () => {
  return (
    <div className={styles.content}>
      <AppHeader></AppHeader>
      <MyDropzone></MyDropzone>
    </div>
  );
};

export default AdminPanel;
