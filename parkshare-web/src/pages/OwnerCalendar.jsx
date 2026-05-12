import logo from "../assets/logo.png";

function OwnerCalendar({ setScreen }) {
  return (
    <div className="owner-page">
      <aside className="owner-sidebar">
        <img src={logo} alt="ParkShare" className="owner-logo" />

        <button onClick={() => setScreen("ownerDashboard")}>Dashboard</button>
        <button className="active">Calendar</button>
        <button onClick={() => setScreen("ownerSlots")}>Slots</button>
        <button onClick={() => setScreen("ownerMessages")}>Messages</button>
        <button onClick={() => setScreen("howToList")}>How to List</button>
        <button onClick={() => setScreen("landing")}>Logout</button>
      </aside>

      <main className="owner-main">
        <h1>Booking Calendar</h1>
        <p className="owner-subtitle">View upcoming reservations and slot schedules.</p>

        <div className="calendar-grid">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div className="calendar-card" key={day}>
              <h3>{day}</h3>
              <p>Obrero Slot</p>
              <span>9:00 AM - 12:00 PM</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default OwnerCalendar;