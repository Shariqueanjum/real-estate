import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ component: Component }) => {
  const { currentUser } = useSelector((state) => state.user);

  return currentUser ? <Component /> : <Navigate to="/sign-in" />;
};

export default PrivateRoute;
