// import { FC } from 'react';
import { Route, Routes, useLocation, useParams } from 'react-router-dom';
import styles from './App.module.less';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import { Login } from '../../pages/login/Login';
import { Page404 } from '../../pages/page404/Page404';
import { useDispatch } from 'react-redux';
import { getCookie } from '../../auth/auth';
import AdminPanel from '../../pages/adminPanel/AdminPanel';
import { Register } from '../../pages/register/Register';
import { useEffect, useState } from 'react';

const App = () => {
  // const path = useLocation().pathname;
  const { body } = styles;

  const dispatch = useDispatch();
  const cookie = getCookie('token');
  const [token, setToket] = useState<string | undefined>('');

  return (
    <>
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
    </>
  );
};

export default App;
