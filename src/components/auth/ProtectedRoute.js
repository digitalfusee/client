import { Outlet, Navigate } from "react-router-dom";
import useStateContext from "../../hooks/useStateContext";

const ProtectedRoute = ({ allowedRoles, ...props }) => {
  const { context } = useStateContext();
  let auth = { token: false };

  if (allowedRoles.includes(context.role) || context.isInstructor) {
    auth.token = true;
  }

  return auth.token ? <Outlet {...props} /> : <Navigate to="/account" />;
};

const InstructorProtectedRoute = (props) => {
  return <ProtectedRoute allowedRoles={[]} {...props} />;
};

export { ProtectedRoute, InstructorProtectedRoute };
