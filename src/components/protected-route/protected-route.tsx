import { FC, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { useSelector } from '../../services/store';
import { selectIsLoading, selectUser } from '../../services/slices/userSlice';

type ProtectedRouteProps = {
  children: ReactElement;
  noLoggedIn?: boolean;
};

// Универсальный компонент защиты маршрутов
export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  noLoggedIn = false // По умолчанию маршрут для авторизованных
}) => {
  const loading = useSelector(selectIsLoading);
  const user = useSelector(selectUser); // Данные пользователя из стора
  const isAuth = !!user; // true, если user существует
  const location = useLocation();
  const from = location.state?.from || '/';

  // Показываем прелоадер, пока идет проверка авторизации
  if (loading) return <Preloader />;

  // Если маршрут только для НЕавторизованных (логин, регистрация)
  if (noLoggedIn && isAuth) {
    console.log('Уже авторизован, редирект на:', from);
    return <Navigate to={from} replace />;
  }

  // Если маршрут только для авторизованных (профиль) и пользователь НЕ авторизован
  if (!noLoggedIn && !isAuth) {
    console.log('Неавторизован, отправлен на логин');
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  // Если все проверки пройдены, рендерим дочерние компоненты
  console.log('Авторизован, доступ разрешен');
  return children;
};
