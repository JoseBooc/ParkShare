import { useState } from "react";
import logo from "../assets/logo.png";

function Landing({ setScreen }) {
  const [locationAllowed, setLocationAllowed] = useState(false);
  const [locationText, setLocationText] = useState("Location not detected yet");

  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationText("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationAllowed(true);
        setLocationText(
          `Live location detected: ${position.coords.latitude.toFixed(
            4
          )}, ${position.coords.longitude.toFixed(4)}`
        );
      },
      () => {
        setLocationText("Location access denied. Showing sample nearby slots.");
      }
    );
  };

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <img src={logo} alt="ParkShare Logo" />
        <button onClick={() => setScreen("login")}>Login</button>
      </nav>

      <section className="landing-hero">
        <div className="landing-text">
          <span className="tagline">Smart Parking, Made Simple</span>

          <h1>Find parking before you arrive.</h1>

          <p>
            ParkShare helps Filipino drivers reserve nearby parking spaces in
            busy areas like malls, hospitals, schools, and business districts.
          </p>

          <div className="landing-actions">
            <button className="primary-btn" onClick={() => setScreen("login")}>
              Get Started
            </button>

            <button className="secondary-btn" onClick={getLocation}>
              Use Live Location
            </button>
          </div>
        </div>

        <div className="landing-card">
          <h3>Available Nearby</h3>

          <p className="location-status">{locationText}</p>

          <div className="parking-item">
            <strong>{locationAllowed ? "Nearest Parking Slot" : "Obrero Parking Slot"}</strong>
            <span>₱50/hour · 0.5 km away</span>
          </div>

          <div className="parking-item">
            <strong>{locationAllowed ? "Nearby Condo Parking" : "Condo Parking Space"}</strong>
            <span>₱60/hour · 1.1 km away</span>
          </div>

          <div className="parking-item">
            <strong>{locationAllowed ? "Nearby Garage Slot" : "Garage Slot"}</strong>
            <span>₱45/hour · 1.8 km away</span>
          </div>
        </div>
      </section>

      <section className="landing-info">
        <h2>How ParkShare Works</h2>

        <div className="info-grid">
          <div className="info-card">
            <h3>Search</h3>
            <p>Allow location access to find parking spaces near you.</p>
          </div>

          <div className="info-card">
            <h3>Book</h3>
            <p>Reserve your preferred slot before going to the location.</p>
          </div>

          <div className="info-card">
            <h3>Park</h3>
            <p>Arrive with confidence and park without wasting time.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;