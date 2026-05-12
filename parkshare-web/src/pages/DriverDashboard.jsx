import logo from "../assets/logo.png";

function DriverDashboard({ setScreen }) {
  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <img src={logo} alt="ParkShare" className="dashboard-logo" />

        <input
          type="text"
          placeholder="Search parking spaces"
          className="search-bar"
        />

        <div className="dashboard-actions">
          <button onClick={() => setScreen("driverProfile")}>Profile</button>
          <button onClick={() => setScreen("wishlist")}>Wishlist</button>
        </div>
      </header>

      <section className="dashboard-section">
        <h2>Parking Spots Near You</h2>

        <div className="parking-grid">
          <div className="parking-card">
            <div className="parking-image"></div>
            <h3>Obrero Parking Slot</h3>
            <p>₱50/hour • 0.5 km away</p>

            <button
              className="primary-btn"
              onClick={() => setScreen("listing")}
            >
              View Slot
            </button>
          </div>

          <div className="parking-card">
            <div className="parking-image"></div>
            <h3>Condo Parking Space</h3>
            <p>₱60/hour • 1.1 km away</p>

            <button
              className="primary-btn"
              onClick={() => setScreen("listing")}
            >
              View Slot
            </button>
          </div>

          <div className="parking-card">
            <div className="parking-image"></div>
            <h3>Garage Parking</h3>
            <p>₱45/hour • 1.8 km away</p>

            <button
              className="primary-btn"
              onClick={() => setScreen("listing")}
            >
              View Slot
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DriverDashboard;