import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../features/auth/authApi';
import { setCredentials } from '../features/auth/authSlice';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useNotification } from '../components/common/NotificationProvider';

const LoginPage: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { showNotification } = useNotification(); 

  const [login, { isLoading, isSuccess, isError, error: loginError }] = useLoginMutation();

  useEffect(() => {
    if (isSuccess) {
      navigate('/dashboard');
    }
    if (isError) {
      if (loginError && 'data' in loginError) {
        setError((loginError.data as any).message || 'Login failed. Please try again.');
      } else {
        setError('An unexpected error occurred.');
      }
    }
  }, [isSuccess, isError, loginError, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await login({ phone, password }).unwrap();
      console.log('Login response:', response);
      dispatch(setCredentials({
        token: response.data.api.token,
        refreshToken: response.data.api.refreshToken,
      }));

      showNotification("success", "Login Successful", "You have successfully logged in.");
      navigate('/dashboard');


    } catch (err) {
      // Error handling is done in useEffect
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-neutral-50">
      {/* Left Side - Illustration/Branding */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary to-primary-dark text-white p-12 flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display">MockPay</h1>
          <p className="mt-2 text-primary-light">Business Subscription Platform</p>
        </div>
        
        <div className="py-12">
          <div className="mb-12">
            <h2 className="text-4xl font-bold mb-6">Connect with businesses you love</h2>
            <p className="text-lg text-white/90">
              Access exclusive offers, discounts, and services through flexible subscription plans.
            </p>
          </div>
          
          <div className="space-y-6">
            {[
              { icon: 'fa-check-circle', text: 'Support local businesses' },
              { icon: 'fa-check-circle', text: 'Manage all your subscriptions in one place' },
              { icon: 'fa-check-circle', text: 'Discover new services in your area' }
            ].map((item, i) => (
              <div key={i} className="flex items-center">
                <i className={`fas ${item.icon} text-primary-light mr-3`}></i>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="pt-12 border-t border-white/20 text-sm text-white/70">
          <p>&copy; {new Date().getFullYear()} MockPay. All rights reserved.</p>
        </div>
      </div>
      
      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <div className="text-center md:text-left md:hidden mb-8">
            <h1 className="text-3xl font-bold text-primary font-display">MockPay</h1>
            <p className="mt-1 text-neutral-600">Business Subscription Platform</p>
          </div>
          
          <div className="card p-8 md:p-10">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-neutral-800">Welcome back</h2>
              <p className="text-neutral-600 mt-1">Please sign in to your account</p>
            </div>
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <i className="fas fa-exclamation-circle text-red-500"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="phone" className="form-label">
                  Phone Number
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-phone text-neutral-500"></i>
                  </div>
                  <input
                    type="text"
                    id="phone"
                    className="form-input pl-10"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (123) 456-7890"
                    required
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <a href="#" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-lock text-neutral-500"></i>
                  </div>
                  <input
                    type="password"
                    id="password"
                    className="form-input pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-neutral-300 rounded"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-700">
                    Remember me
                  </label>
                </div>
              </div>
              
              <button
                type="submit"
                className="btn-primary w-full flex justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <LoadingSpinner />
                    <span className="ml-2">Signing in...</span>
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
              
              <div className="flex items-center mt-6">
                <div className="h-px bg-neutral-300 flex-grow"></div>
                <span className="px-4 text-sm text-neutral-500">Or continue with</span>
                <div className="h-px bg-neutral-300 flex-grow"></div>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                {['google', 'facebook', 'apple'].map((provider) => (
                  <button
                    key={provider}
                    type="button"
                    className="inline-flex justify-center items-center py-2 px-4 border border-neutral-300 rounded-md shadow-sm bg-white text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                  >
                    <i className={`fab fa-${provider} text-lg`}></i>
                  </button>
                ))}
              </div>
            </form>
            
            <p className="text-center mt-8 text-sm text-neutral-600">
              Don't have an account?{' '}
              <Link to="#" className="text-primary font-medium hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;