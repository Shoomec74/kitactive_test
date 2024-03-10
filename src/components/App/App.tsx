import { Route, Routes } from 'react-router-dom';
import styles from './App.module.less';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import { Login } from '../../pages/login/Login';
import { Page404 } from '../../pages/page404/Page404';
import AdminPanel from '../../pages/adminPanel/AdminPanel';
import { Register } from '../../pages/register/Register';
import { FC } from 'react';

const App: FC = () => {
  //-- Использование стилей для компонента App --//
  const { app } = styles;

  return (
    <div className={app}>
      {/* Конфигурация маршрутов для приложения */}
      <Routes>
        {/* Маршрут для страницы авторизации */}
        <Route path="/login" element={<Login />} />
        {/* Маршрут для страницы регистрации */}
        <Route path="/register" element={<Register />} />
        {/* Маршрут для страницы 404: Страница не найдена */}
        <Route path="*" element={<Page404 />} />
        {/* Защищенный маршрут к панели администратора, доступный только после авторизации */}
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
