import { Navigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';

export default function AdminProtectedRoute({ children }) {
  const { admin, loading } = useAdmin();

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gray-50"
        data-icod-id="src_components_adminprotectedroute_jsx_3a0c">
        <div
          className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"
          data-icod-id="src_components_adminprotectedroute_jsx_3e77" />
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
