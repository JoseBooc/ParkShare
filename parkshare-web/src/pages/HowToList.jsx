import logo from "../assets/logo.png";

function HowToList({ setScreen }) {
  return (
    <div className="owner-page">
      <aside className="owner-sidebar">
        <img src={logo} alt="ParkShare" className="owner-logo" />

        <button onClick={() => setScreen("ownerDashboard")}>Dashboard</button>
        <button onClick={() => setScreen("ownerCalendar")}>Calendar</button>
        <button onClick={() => setScreen("ownerSlots")}>Slots</button>
        <button onClick={() => setScreen("ownerMessages")}>Messages</button>
        <button className="active">How to List</button>
        <button onClick={() => setScreen("landing")}>Logout</button>
      </aside>

      <main className="owner-main">
        <h1>How to List a Slot</h1>
        <p className="owner-subtitle">Follow these steps to publish your parking space.</p>

        <div className="how-list">
          <div className="how-card">
            <span>1</span>
            <h3>Add Space Details</h3>
            <p>Input your address, available hours, and price per hour.</p>
          </div>

          <div className="how-card">
            <span>2</span>
            <h3>Upload Photos</h3>
            <p>Add clear photos of the parking area for client trust.</p>
          </div>

          <div className="how-card">
            <span>3</span>
            <h3>Set Availability</h3>
            <p>Choose when the slot can be booked by drivers.</p>
          </div>

          <div className="how-card">
            <span>4</span>
            <h3>Receive Bookings</h3>
            <p>Accept reservations and receive payouts after check-out.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default HowToList;