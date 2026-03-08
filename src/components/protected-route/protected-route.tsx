import { FC, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { useSelector } from '../../services/store';
import { selectIsLoading } from '../../services/slices/feedSlice';
import { selectUser } from '../../services/slices/userSlice';

type ProtectedRouteProps = {
  children: ReactElement;
  noLoggedIn?: boolean;
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  noLoggedIn = false
}) => {
  const loading = useSelector(selectIsLoading);
  const user = useSelector(selectUser);
  const isAuth = !!user;
  const location = useLocation();
  const from = location.state?.from || '/';

  if (loading) return <Preloader />;

  if (noLoggedIn && isAuth) return <Navigate to={from} replace />;

  if (!noLoggedIn && !isAuth)
    return <Navigate to='/login' state={{ from: location }} replace />;

  return children;
};
