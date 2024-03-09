import { Route, Routes, useLocation, useParams } from 'react-router-dom';
import styles from './App.module.less';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import { Login } from '../../pages/login/Login';
import { Page404 } from '../../pages/page404/Page404';

import AdminPanel from '../../pages/adminPanel/AdminPanel';
import { Register } from '../../pages/register/Register';
import { FC } from 'react';

const App: FC = () => {
  const { app } = styles;

  return (
    <div className={app}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Page404 />} />
        <Route
          path="/"
          element={
            <>
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            </>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
