import { FC, useEffect } from 'react';
import AppHeader from '../../components/AppHeader/AppHeader';
import PreviewFiles from '../../components/PreviewFiles/PreviewFiles';
import styles from './AdminPanel.module.less';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../services/hooks/hooks';
import { getCookie } from '../../auth/auth';

const AdminPanel: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cookie = getCookie('token');

  const { isLogin } = useAppSelector((state) => ({
    isLogin: state.auth.isLogin,
  }));

  useEffect(() => {
    if (!isLogin && !cookie) {
      navigate('/login', { replace: true, state: { from: location.pathname } });
    }
  }, [isLogin, cookie]);

  return (
    <div className={styles.content}>
      <AppHeader></AppHeader>
      <PreviewFiles></PreviewFiles>
    </div>
  );
};

export default AdminPanel;
