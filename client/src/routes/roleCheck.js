import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const useRequireRole = (allowedRoles) => {
  const navigate = useNavigate();
  const { user, isLoggedIn, loading } = useContext(AuthContext);

  // Wait until auth finishes loading
  useEffect(() => {
    if (loading) return;

    if (!isLoggedIn) {
      navigate('/unauthorized', { replace: true });
      return;
    }

    const normalizedUserRole = user?.role?.toLowerCase();

    const allowed = Array.isArray(allowedRoles)
      ? allowedRoles.map(r => r.toLowerCase()).includes(normalizedUserRole)
      : false;

    if (!allowed) {
      navigate('/unauthorized', { replace: true });
    }
  }, [user, isLoggedIn, loading]);

  return { user, isLoading: loading };
};

export default useRequireRole;