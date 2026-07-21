import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { loginUser, googleLogin } from "../../api/authApi";
import RegisterForm from "./RegisterForm";
import GoogleLoginButton from "../../components/Auth/GoogleLoginButton";
import ShopLogo from "../../assets/ShopLogo.png";
import "../../styles/AuthPage.css";

export default function AuthPage({ view = "login" }) {
  const navigate = useNavigate();
  const { isLoggedIn, handleLoginSuccess } = useAppContext();

  const isSignUp = view === "register";
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Login form state
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [loginErrors, setLoginErrors] = useState({});

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const validateLogin = () => {
    const errors = {};
    if (!loginData.username.trim()) errors.username = "Username is required";
    if (!loginData.password.trim()) errors.password = "Password is required";
    return errors;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const errors = validateLogin();
    setLoginErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      try {
        const result = await loginUser(loginData.username, loginData.password);
        if (result.success && result.user) {
          localStorage.setItem("saved_username", loginData.username);
          localStorage.setItem("saved_password", loginData.password);
          localStorage.setItem("saved_timestamp", Date.now().toString());

          await handleLoginSuccess(result.user);
        } else {
          setLoginErrors({ general: result.error || "Login failed" });
        }
      } catch (err) {
        setLoginErrors({ general: "An unexpected error occurred" });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const switchToSignUp = () => {
    navigate("/register");
  };

  const switchToLogin = () => {
    navigate("/login");
  };

  const handleGoogleSuccess = async (codeResponse) => {
    setIsLoading(true);
    try {
      const result = await googleLogin(codeResponse.access_token);
      if (result.success && result.user) {
        await handleLoginSuccess(result.user);
      } else {
        setLoginErrors({ general: result.error || "Google login failed" });
      }
    } catch (err) {
      setLoginErrors({ general: "An unexpected error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialClick = (e) => {
    e.preventDefault();
    alert("This feature is currently under development.");
  };

  return (
    <div className="login-page">
      <button
        className="back-to-home-btn"
        onClick={() => navigate("/")}
        title="Back to Home"
      >
        <i className="bx bx-left-arrow-alt"></i>
        Back to Home
      </button>

      {/* Animated background elements */}
      <div className="login-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>

      <div className={`login-container ${isSignUp ? "active" : ""}`}>
        {/* ===== LOGIN FORM (right side by default) ===== */}
        <div className="form-panel login-form-panel">
          <div className="login-form-box">
            <form onSubmit={handleLoginSubmit} id="login-form">
              <h1>Welcome Back</h1>
              <p className="login-subtitle">
                Sign in to your account to continue
              </p>

              {loginErrors.general && (
                <span
                  className="login-error-msg"
                  style={{ display: "block", marginBottom: "10px" }}
                >
                  {loginErrors.general}
                </span>
              )}

              <div
                className={`login-input-box ${loginErrors.username ? "error" : ""}`}
              >
                <input
                  type="text"
                  id="login-username"
                  placeholder="Username"
                  value={loginData.username}
                  onChange={(e) => {
                    setLoginData({ ...loginData, username: e.target.value });
                    if (loginErrors.username)
                      setLoginErrors({ ...loginErrors, username: "" });
                  }}
                />
                <i className="bx bx-user"></i>
                {loginErrors.username && (
                  <span className="login-error-msg">
                    {loginErrors.username}
                  </span>
                )}
              </div>

              <div
                className={`login-input-box ${loginErrors.password ? "error" : ""}`}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  id="login-password"
                  placeholder="Password"
                  value={loginData.password}
                  onChange={(e) => {
                    setLoginData({ ...loginData, password: e.target.value });
                    if (loginErrors.password)
                      setLoginErrors({ ...loginErrors, password: "" });
                  }}
                />
                <i
                  className={`bx ${showPassword ? "bx-show" : "bx-hide"}`}
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: "pointer" }}
                  title={showPassword ? "Hide password" : "Show password"}
                ></i>
                {loginErrors.password && (
                  <span className="login-error-msg">
                    {loginErrors.password}
                  </span>
                )}
              </div>

              <div className="login-options">
                <label className="login-remember" htmlFor="remember-me">
                  <input type="checkbox" id="remember-me" />
                  <span className="checkmark"></span>
                  Remember me
                </label>
                <span
                  className="login-forgot-link"
                  onClick={() => navigate("/forgot-password")}
                  style={{ cursor: "pointer" }}
                >
                  Forgot Password?
                </span>
              </div>

              <button
                type="submit"
                className={`login-btn ${isLoading && !isSignUp ? "loading" : ""}`}
                id="login-submit-btn"
                disabled={isLoading && !isSignUp}
              >
                {isLoading && !isSignUp ? (
                  <span className="login-spinner"></span>
                ) : (
                  <>
                    <span>Login</span>
                    <i className="bx bx-log-in-circle"></i>
                  </>
                )}
              </button>

              <div className="login-divider">
                <span>or login with</span>
              </div>

              <div className="login-social-icons">
                <GoogleLoginButton 
                  onSuccess={handleGoogleSuccess}
                  onError={(err) => setLoginErrors({ general: "Google login failed. Please try again." })}
                />
                <a
                  href="#"
                  className="login-social-btn"
                  id="login-facebook"
                  title="Login with Facebook"
                  onClick={handleSocialClick}
                >
                  <i className="bx bxl-facebook"></i>
                </a>
                <a
                  href="#"
                  className="login-social-btn"
                  id="login-tiktok"
                  title="Login with TikTok"
                  onClick={handleSocialClick}
                >
                  <i className="bx bxl-tiktok"></i>
                </a>
                <a
                  href="#"
                  className="login-social-btn"
                  id="login-github"
                  title="Login with GitHub"
                  onClick={handleSocialClick}
                >
                  <i className="bx bxl-github"></i>
                </a>
              </div>
            </form>
          </div>
        </div>

        {/* ===== REGISTER FORM (left side when active) ===== */}
        <div className="form-panel register-form-panel">
          <RegisterForm
            isLoading={isLoading && isSignUp}
            setIsLoading={setIsLoading}
            switchToLogin={switchToLogin}
          />
        </div>

        {/* ===== SLIDING OVERLAY PANEL ===== */}
        <div className="overlay-panel">
          <div className="overlay-content">
            <div className="login-brand-icon">
              <img
                src={ShopLogo}
                alt="BWF Logo"
                style={{ width: "48px", height: "48px", objectFit: "contain" }}
              />
            </div>
            <h2>BWF Store</h2>
            <p className="overlay-tagline">Premium Badminton Gear</p>

            {/* Content shown when on Login page (panel is on the left) */}
            <div className="overlay-login-content">
              <p className="overlay-question">Don't have an account?</p>
              <button
                type="button"
                className="overlay-btn"
                id="switch-to-signup"
                onClick={switchToSignUp}
              >
                Sign Up
                <i className="bx bx-right-arrow-alt"></i>
              </button>
            </div>

            {/* Content shown when on Register page (panel is on the right) */}
            <div className="overlay-register-content">
              <p className="overlay-question">Already have an account?</p>
              <button
                type="button"
                className="overlay-btn"
                id="switch-to-login"
                onClick={switchToLogin}
              >
                <i className="bx bx-left-arrow-alt"></i>
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
