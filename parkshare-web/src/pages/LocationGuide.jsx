function LocationGuide({ setScreen }) {
  return (
    <div className="location-page">
      <button
        className="listing-back-btn"
        onClick={() => setScreen("listing")}
      >
        ← Back
      </button>

      <div className="location-map">
        <h2>Live Location</h2>
        <p>Map preview for the reserved parking slot</p>
      </div>

      <div className="location-details">
        <h1>Location Guide</h1>

        <div className="route-box">
          <p><strong>From Location:</strong> Your current location</p>
          <p><strong>To Location:</strong> Parking Slot in Obrero, Davao City</p>
          <p><strong>Estimated Distance:</strong> 0.5 km away</p>
          <p><strong>Estimated Time:</strong> 5 minutes</p>
        </div>

        <button
          className="primary-btn"
          onClick={() => alert("Navigation started!")}
        >
          Start Navigation
        </button>
      </div>
    </div>
  );
}

export default LocationGuide;