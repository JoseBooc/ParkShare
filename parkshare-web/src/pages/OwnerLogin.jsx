import { useState } from "react";
import logo from "../assets/logo.png";

function OwnerLogin({ setScreen }) {
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-page">
      <div className="login-card owner-login-card">

        <img
          src={logo}
          alt="ParkShare Logo"
          className="login-logo"
        />

        <h1>
          {isSignup ? "Owner Sign Up" : "Owner Login"}
        </h1>

        <p>
          {isSignup
            ? "Create an owner account to list and manage your parking slots."
            : "Login to manage your slots, bookings, messages, and earnings."}
        </p>

        {isSignup && (
          <>
            <input
              type="text"
              placeholder="Full Name"
            />

            <input
              type="tel"
              placeholder="Phone Number"
            />
          </>
        )}

        <input
          type="email"
          placeholder="Owner Email Address"
        />

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
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {isSignup && (
          <div className="upload-box">
            <label>
              Upload Valid ID / License Image
            </label>

            <input
              type="file"
              accept="image/*"
            />
          </div>
        )}

        <button
          className="primary-btn"
          onClick={() => setScreen("ownerDashboard")}
        >
          {isSignup
            ? "Create Owner Account"
            : "Login as Owner"}
        </button>

        <button
          className="secondary-btn"
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup
            ? "Already have an account? Login"
            : "Create Owner Account"}
        </button>

      </div>
    </div>
  );
}

export default OwnerLogin;