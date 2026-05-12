import logo from "../assets/logo.png";

function OwnerDashboard({ setScreen }) {
  return (
    <div className="owner-page">
      <aside className="owner-sidebar">
        <img src={logo} alt="ParkShare" className="owner-logo" />

        <button className="active">Dashboard</button>
        <button onClick={() => setScreen("ownerCalendar")}>Calendar</button>
        <button onClick={() => setScreen("ownerSlots")}>Slots</button>
        <button onClick={() => setScreen("ownerMessages")}>Messages</button>
        <button onClick={() => setScreen("howToList")}>How to List</button>
        <button onClick={() => setScreen("landing")}>Logout</button>
      </aside>

      <main className="owner-main">
        <h1>Owner Dashboard</h1>
        <p className="owner-subtitle">Manage your parking slots and bookings.</p>

        <div className="owner-stats">
          <div className="owner-stat-card">
            <h3>Total Earnings</h3>
            <p>₱3,250</p>
          </div>

          <div className="owner-stat-card">
            <h3>Active Slots</h3>
            <p>4</p>
          </div>

          <div className="owner-stat-card">
            <h3>Bookings Today</h3>
            <p>7</p>
          </div>
        </div>

        <div className="owner-panel">
          <h2>Recent Bookings</h2>

          <div className="booking-row">
            <span>Obrero Parking Slot</span>
            <strong>₱50/hour</strong>
            <em>Reserved</em>
          </div>

          <div className="booking-row">
            <span>Condo Parking Space</span>
            <strong>₱60/hour</strong>
            <em>Checked In</em>
          </div>

          <div className="booking-row">
            <span>Garage Parking</span>
            <strong>₱45/hour</strong>
            <em>Completed</em>
          </div>
        </div>
      </main>
    </div>
  );
}

export default OwnerDashboard;