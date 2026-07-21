import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';

const GoogleLoginButton = ({ onSuccess, onError, text = 'Sign in with Google', className = '' }) => {
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      console.log('Google login successful:', codeResponse);
      if (onSuccess) onSuccess(codeResponse);
    },
    onError: (error) => {
      console.error('Google login failed:', error);
      if (onError) onError(error);
    },
  });

  return (
    <button
      type="button"
      className={`login-social-btn flex items-center justify-center gap-2 ${className}`}
      onClick={() => login()}
      title={text}
    >
      <i className="bx bxl-google text-xl"></i>
    </button>
  );
};

export default GoogleLoginButton;
