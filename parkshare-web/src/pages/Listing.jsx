function Listing({ setScreen }) {
  const saveToWishlist = () => {
    alert("Parking slot saved to wishlist!");
    setScreen("wishlist");
  };

  return (
    <div className="listing-page">
      <button
        className="listing-back-btn"
        onClick={() => setScreen("driverDashboard")}
      >
        ← Back
      </button>

      <div className="listing-gallery">
        <div className="gallery-main">Parking Slot Photo</div>
      </div>

      <div className="listing-content">
        <div className="listing-left">
          <h1>Parking Slot in Obrero</h1>
          <p>1 slot · SUV friendly · Clean · 4.5 stars</p>

          <div className="listing-info-box">
            Secure parking space near schools, malls, and business areas in
            Obrero, Davao City.
          </div>

          <h2>Reviews</h2>

          <div className="review-card">
            <strong>Shane Cava</strong>
            <p>Clean parking spot and easy to find.</p>
          </div>

          <div className="review-card">
            <strong>Andrea Lopez</strong>
            <p>Very convenient and safe location.</p>
          </div>
        </div>

        <div className="listing-right">
          <div className="booking-card">
            <h3>₱50/hour</h3>
            <p>Hosted by Andrew Jacob</p>

            <button
              className="primary-btn"
              onClick={() => setScreen("locationGuide")}
            >
              Reserve Slot
            </button>

            <button
              className="secondary-btn"
              onClick={saveToWishlist}
            >
              Save to Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Listing;