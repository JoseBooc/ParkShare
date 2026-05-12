import { useState } from "react";
import logo from "../assets/logo.png";

function Login({ setScreen }) {
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-page">
      <div className="login-card">
        <button className="back-btn" onClick={() => setScreen("landing")}>
          ← Back
        </button>

        <img src={logo} alt="ParkShare Logo" className="login-logo" />

        <h1>{isSignup ? "Driver Sign Up" : "Driver Login"}</h1>

        <p>
          {isSignup
            ? "Create your driver account to find and reserve parking spaces."
            : "Login to find and reserve parking spaces before you arrive."}
        </p>

        {isSignup && (
          <>
            <input type="text" placeholder="Full Name" />
            <input type="tel" placeholder="Phone Number" />
          </>
        )}

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
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {isSignup && (
          <div className="upload-box">
            <label>Upload Driver’s License Image</label>
            <input type="file" accept="image/*" />
          </div>
        )}

        <button
          className="primary-btn"
          onClick={() => setScreen("driverDashboard")}
        >
          {isSignup ? "Create Driver Account" : "Login as Driver"}
        </button>

        <button
          className="secondary-btn"
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup ? "Already have an account? Login" : "Create Account"}
        </button>
      </div>
    </div>
  );
}

export default Login;