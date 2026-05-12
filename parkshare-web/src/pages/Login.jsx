import { useState } from "react";
import logo from "../assets/logo.png";

function Login({ setScreen }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-page">
      <div className="login-card">

        <button
          className="back-btn"
          onClick={() => setScreen("landing")}
        >
          ← Back
        </button>

        <img src={logo} alt="ParkShare Logo" className="login-logo" />

        <h1>Welcome to ParkShare</h1>

        <p>
          Find and reserve parking spaces before you arrive.
          Save time, avoid stress, and park smarter.
        </p>

        <input type="email" placeholder="Email Address" />

        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
          />

          <button
            type="button"
            className="eye-btn"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-10-7a18.1 18.1 0 012.38-3.69M6.18 6.18A9.956 9.956 0 0112 5c5 0 9 4 10 7a18.084 18.084 0 01-4.293 5.774M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 6L3 3"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        </div>

        <button
          className="primary-btn"
          onClick={() => setScreen("driverDashboard")}
        >
          Login
        </button>

        <button
          className="secondary-btn"
          onClick={() => setScreen("driverDashboard")}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default Login;