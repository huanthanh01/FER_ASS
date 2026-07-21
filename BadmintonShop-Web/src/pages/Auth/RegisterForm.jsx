import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { registerUser, googleLogin } from '../../api/authApi';

import GoogleLoginButton from '../../components/Auth/GoogleLoginButton';

function RegisterForm({ isLoading, setIsLoading, switchToLogin }) {
  const { handleRegisterSuccess, handleLoginSuccess } = useAppContext();
  const [showPassword, setShowPassword] = useState(false);
  const [registerData, setRegisterData] = useState({
    fullname: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!registerData.fullname.trim()) newErrors.fullname = 'Full name is required';
    if (!registerData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(registerData.email))
      newErrors.email = 'Email is invalid';
    if (!registerData.username.trim()) newErrors.username = 'Username is required';
    if (!registerData.password.trim()) newErrors.password = 'Password is required';
    else if (registerData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';
    if (!registerData.confirmPassword.trim())
      newErrors.confirmPassword = 'Please confirm your password';
    else if (registerData.password !== registerData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true);
      try {
        const result = await registerUser(
          registerData.fullname, 
          registerData.email, 
          registerData.username, 
          registerData.password
        );
        
        if (result.success) {
          handleRegisterSuccess(registerData.fullname);
          setRegisterData({ fullname: '', email: '', username: '', password: '', confirmPassword: '' });
          switchToLogin();
        } else {
          setErrors({ general: result.error || 'Registration failed' });
        }
      } catch (err) {
        setErrors({ general: 'An unexpected error occurred' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const updateField = (field, value) => {
    setRegisterData({ ...registerData, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  const handleSocialClick = (e) => {
    e.preventDefault();
    alert("This feature is currently under development.");
  };

  const handleGoogleSuccess = async (codeResponse) => {
    setIsLoading(true);
    try {
      const result = await googleLogin(codeResponse.access_token);
      if (result.success && result.user) {
        await handleLoginSuccess(result.user);
      } else {
        setErrors({ general: result.error || "Google sign up failed" });
      }
    } catch (err) {
      setErrors({ general: "An unexpected error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-form-box">
      <form onSubmit={handleSubmit} id="register-form">
        <h1>Create Account</h1>
        <p className="login-subtitle">Join us to get the best badminton gear</p>

        {errors.general && <span className="login-error-msg" style={{display: 'block', marginBottom: '10px'}}>{errors.general}</span>}

        <div className={`login-input-box ${errors.fullname ? 'error' : ''}`}>
          <input
            type="text"
            id="register-fullname"
            placeholder="Full Name"
            value={registerData.fullname}
            onChange={(e) => updateField('fullname', e.target.value)}
          />
          <i className="bx bx-id-card"></i>
          {errors.fullname && <span className="login-error-msg">{errors.fullname}</span>}
        </div>

        <div className={`login-input-box ${errors.email ? 'error' : ''}`}>
          <input
            type="email"
            id="register-email"
            placeholder="Email"
            value={registerData.email}
            onChange={(e) => updateField('email', e.target.value)}
          />
          <i className="bx bx-envelope"></i>
          {errors.email && <span className="login-error-msg">{errors.email}</span>}
        </div>

        <div className={`login-input-box ${errors.username ? 'error' : ''}`}>
          <input
            type="text"
            id="register-username"
            placeholder="Username"
            value={registerData.username}
            onChange={(e) => updateField('username', e.target.value)}
          />
          <i className="bx bx-user"></i>
          {errors.username && <span className="login-error-msg">{errors.username}</span>}
        </div>

        <div className={`login-input-box ${errors.password ? 'error' : ''}`}>
          <input
            type={showPassword ? 'text' : 'password'}
            id="register-password"
            placeholder="Password"
            value={registerData.password}
            onChange={(e) => updateField('password', e.target.value)}
          />
          <i
            className={`bx ${showPassword ? 'bx-show' : 'bx-hide'}`}
            onClick={() => setShowPassword(!showPassword)}
            style={{ cursor: 'pointer' }}
            title={showPassword ? 'Hide password' : 'Show password'}
          ></i>
          {errors.password && <span className="login-error-msg">{errors.password}</span>}
        </div>

        <div className={`login-input-box ${errors.confirmPassword ? 'error' : ''}`}>
          <input
            type="password"
            id="register-confirm-password"
            placeholder="Confirm Password"
            value={registerData.confirmPassword}
            onChange={(e) => updateField('confirmPassword', e.target.value)}
          />
          <i className="bx bx-lock"></i>
          {errors.confirmPassword && (
            <span className="login-error-msg">{errors.confirmPassword}</span>
          )}
        </div>

        <button
          type="submit"
          className={`login-btn ${isLoading ? 'loading' : ''}`}
          id="register-submit-btn"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="login-spinner"></span>
          ) : (
            <>
              <span>Sign Up</span>
              <i className="bx bx-user-plus"></i>
            </>
          )}
        </button>

        <div className="login-divider">
          <span>or sign up with</span>
        </div>

        <div className="login-social-icons">
          <GoogleLoginButton 
            onSuccess={handleGoogleSuccess}
            onError={(err) => setErrors({ general: "Google sign up failed. Please try again." })}
          />
          <a href="#" className="login-social-btn" id="signup-facebook" title="Sign up with Facebook" onClick={handleSocialClick}>
            <i className="bx bxl-facebook"></i>
          </a>
          <a href="#" className="login-social-btn" id="signup-tiktok" title="Sign up with TikTok" onClick={handleSocialClick}>
            <i className="bx bxl-tiktok"></i>
          </a>
          <a href="#" className="login-social-btn" id="signup-github" title="Sign up with GitHub" onClick={handleSocialClick}>
            <i className="bx bxl-github"></i>
          </a>
        </div>
      </form>
    </div>
  );
}

export default RegisterForm;
