import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyResetPassword, resetPassword } from '../api/authApi';
import { HiOutlineUser, HiOutlinePhone, HiOutlineLockClosed, HiOutlineArrowLeft } from 'react-icons/hi';
import { toast } from 'react-toastify';
import '../styles/AuthPage.css';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1); // 1: Verify, 2: Reset
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [formData, setFormData] = useState({
    username: '',
    phoneNumber: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.phoneNumber) {
      setErrorMsg('Username and phone number are required');
      return;
    }
    
    setIsLoading(true);
    setErrorMsg('');
    try {
      const result = await verifyResetPassword(formData.username, formData.phoneNumber);
      if (result.success) {
        setStep(2);
      } else {
        setErrorMsg(result.error || 'Verification failed. Please check your details.');
      }
    } catch (err) {
      setErrorMsg('An error occurred during verification');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (!formData.newPassword || !formData.confirmPassword) {
      setErrorMsg('Please enter and confirm your new password');
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    setErrorMsg('');
    try {
      const result = await resetPassword(formData.username, formData.newPassword);
      if (result.success) {
        toast.success('Password reset successful! Please login.');
        navigate('/login');
      } else {
        setErrorMsg(result.error || 'Failed to reset password');
      }
    } catch (err) {
      setErrorMsg('An error occurred during password reset');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Animated background elements */}
      <div className="login-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>

      <div className="login-container">
        <div className="form-panel" style={{ width: '100%', right: 0 }}>
          <div className="login-form-box" style={{ maxWidth: '400px', margin: '0 auto' }}>
            <button 
              className="back-btn"
              onClick={() => step === 2 ? setStep(1) : navigate('/login')}
              style={{ background: 'none', border: 'none', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '1.5rem', fontSize: '14px', fontFamily: 'inherit' }}
            >
              <HiOutlineArrowLeft /> Back
            </button>
            
            <div className="auth-header" style={{ marginBottom: '20px' }}>
              <h1>{step === 1 ? 'Forgot Password' : 'Reset Password'}</h1>
              <p className="login-subtitle">{step === 1 ? 'Enter your details to verify your identity' : 'Enter your new password'}</p>
            </div>

            {errorMsg && <span className="login-error-msg" style={{ display: 'block', marginBottom: '15px' }}>{errorMsg}</span>}

            {step === 1 ? (
              <form onSubmit={handleVerify}>
                <div className={`login-input-box ${!formData.username && errorMsg ? 'error' : ''}`}>
                  <input 
                    type="text" 
                    name="username"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                  <i className="bx bx-user"></i>
                </div>

                <div className={`login-input-box ${!formData.phoneNumber && errorMsg ? 'error' : ''}`}>
                  <input 
                    type="text" 
                    name="phoneNumber"
                    placeholder="Enter your registered phone number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                  <i className="bx bx-phone"></i>
                </div>

                <button 
                  type="submit" 
                  className={`login-btn ${isLoading ? 'loading' : ''}`}
                  disabled={isLoading}
                  style={{ marginTop: '10px' }}
                >
                  {isLoading ? <span className="login-spinner"></span> : 'Verify Details'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleReset}>
                <div className={`login-input-box ${!formData.newPassword && errorMsg ? 'error' : ''}`}>
                  <input 
                    type="password" 
                    name="newPassword"
                    placeholder="Enter new password"
                    value={formData.newPassword}
                    onChange={handleChange}
                  />
                  <i className="bx bx-lock"></i>
                </div>

                <div className={`login-input-box ${!formData.confirmPassword && errorMsg ? 'error' : ''}`}>
                  <input 
                    type="password" 
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <i className="bx bx-lock-alt"></i>
                </div>

                <button 
                  type="submit" 
                  className={`login-btn ${isLoading ? 'loading' : ''}`}
                  disabled={isLoading}
                  style={{ marginTop: '10px' }}
                >
                  {isLoading ? <span className="login-spinner"></span> : 'Reset Password'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
