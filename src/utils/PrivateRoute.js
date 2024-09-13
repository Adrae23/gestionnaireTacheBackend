import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, roleRequired }) => {
  const role = localStorage.getItem('role');
  return role === roleRequired ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
