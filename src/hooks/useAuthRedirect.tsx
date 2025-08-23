
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import SessionStorageManager from '../utils/sessionStorageUtilities';

export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useSelector((state: RootState) => state.auth);

  const redirectToLogin = (message?: string) => {
    // Store current location for redirect after login
    SessionStorageManager.storeRedirectUrl(location.pathname + location.search);
    
    navigate('/login', { 
      state: { from: location, message },
      replace: true 
    });
  };

  const checkAuthAndRedirect = (): boolean => {
    if (!token) {
      redirectToLogin();
      return false;
    }
    return true;
  };

  return {
    redirectToLogin,
    checkAuthAndRedirect,
    isAuthenticated: !!token
  };
};