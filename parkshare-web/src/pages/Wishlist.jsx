function Wishlist({ setScreen }) {
  return (
    <div className="wishlist-page">

      <button
        className="listing-back-btn"
        onClick={() => setScreen("driverDashboard")}
      >
        ← Back
      </button>

      <h1 className="wishlist-title">
        Saved Parking Slots
      </h1>

      <div className="wishlist-grid">

        <div className="wishlist-card">
          <div className="wishlist-image"></div>

          <h2>Obrero Parking Slot</h2>

          <p>₱50/hour • 0.5 km away</p>

          <button
            className="primary-btn"
            onClick={() => setScreen("listing")}
          >
            View Slot
          </button>
        </div>

        <div className="wishlist-card">
          <div className="wishlist-image"></div>

          <h2>Condo Parking Space</h2>

          <p>₱60/hour • 1.1 km away</p>

          <button
            className="primary-btn"
            onClick={() => setScreen("listing")}
          >
            View Slot
          </button>
        </div>

      </div>

    </div>
  );
}

export default Wishlist;