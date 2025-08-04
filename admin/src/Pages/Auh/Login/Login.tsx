import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import '../../../styles/Login.scss';
import { LOCAL_STORAGE_KEY } from '../../../Constants/Constants';
import { ROUTES } from '../../../Constants/Routes';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Context/AuthContext';
import { doLogin } from '../../../Connection/Auth';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;  
}

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {login} = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue
  } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });


  const rememberMe = watch('rememberMe');

  const onSubmit = async (data: LoginFormData) => {
    try {
     
      const response = await doLogin(data.email, data.password);
      localStorage.setItem(LOCAL_STORAGE_KEY.AUTH_TOKEN, response.token);
      login(response.profile);
      navigate(ROUTES.HOME);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="login-container">
      {/* Background decorative shapes */}
      <div className="login-container__background">
        <div className="login-container__background-shape login-container__background-shape--1"></div>
        <div className="login-container__background-shape login-container__background-shape--2"></div>
        <div className="login-container__background-shape login-container__background-shape--3"></div>
        <div className="login-container__background-shape login-container__background-shape--4"></div>
      </div>

      {/* Main login card */}
      <div className="login-container__card">
        <div className="login-container__card-content">
          {/* Logo */}
          <div className="login-container__logo">
            <span className="login-container__logo-text">S20</span>
          </div>

          {/* Title */}
          <h1 className="login-container__title">Super 20</h1>
          <p className="login-container__subtitle">Welcome back! Please sign in to continue.</p>

          {/* Login Form */}
          <form className="login-container__form" onSubmit={handleSubmit(onSubmit)}>
            {/* Email Field */}
            <div className="login-container__input-group login-container__input-group--1">
              <label htmlFor="email" className="login-container__label">
                Email Address
              </label>
              <div className="login-container__input-container">
                <Mail className="login-container__input-icon" size={20} />
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className={`login-container__input ${errors.email ? 'login-container__input--error' : ''}`}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
              </div>
              {errors.email && (
                <span className="login-container__error-message">{errors.email.message}</span>
              )}
            </div>

            {/* Password Field */}
            <div className="login-container__input-group login-container__input-group--2">
              <label htmlFor="password" className="login-container__label">
                Password
              </label>
              <div className="login-container__input-container">
                <Lock className="login-container__input-icon" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  className={`login-container__input ${errors.password ? 'login-container__input--error' : ''}`}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="login-container__password-toggle"
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="login-container__error-message">{errors.password.message}</span>
              )}
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="login-container__options-row">
              <div className="login-container__checkbox-container">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setValue('rememberMe', e.target.checked)}
                  className="login-container__checkbox"
                />
                <label htmlFor="remember-me" className="login-container__checkbox-label">
                  Remember me
                </label>
              </div>
              <a href="#" className="login-container__forgot-password">
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
            <button 
              type="submit" 
              className="login-container__signin-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="login-container__signup-container">
            <span className="login-container__signup-text">Don't have an account? </span>
            <a href="#" className="login-container__signup-link">
              Sign up here
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
