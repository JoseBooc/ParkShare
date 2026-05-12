import { useState } from "react";
import logo from "../assets/logo.png";

function DriverProfile({ setScreen }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("Andrew Jacob");
  const [email, setEmail] = useState("andrewjacob@gmail.com");
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <div className="profile-page">
      <button
        className="listing-back-btn"
        onClick={() => setScreen("driverDashboard")}
      >
        ← Back
      </button>

      <div className="profile-card">
        <img src={logo} alt="ParkShare" className="profile-logo" />

        <div className="profile-avatar">{initials}</div>

        {isEditing ? (
          <>
            <input
              className="profile-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
            />

            <input
              className="profile-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
            />

            <button
              className="primary-btn"
              onClick={() => setIsEditing(false)}
            >
              Save Profile
            </button>
          </>
        ) : (
          <>
            <h1>{name}</h1>

            <p className="profile-email">{email}</p>

            <div className="profile-info">
              <div className="profile-box">
                <h3>Saved Slots</h3>
                <p>5 Parking Spaces</p>
              </div>

              <div className="profile-box">
                <h3>Reservations</h3>
                <p>12 Completed</p>
              </div>

              <div className="profile-box">
                <h3>Favorite Area</h3>
                <p>Obrero, Davao City</p>
              </div>
            </div>

            <button
              className="primary-btn"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default DriverProfile;