import logo from "../assets/logo.png";

function OwnerSlots({ setScreen }) {
  return (
    <div className="owner-page">
      <aside className="owner-sidebar">
        <img src={logo} alt="ParkShare" className="owner-logo" />

        <button onClick={() => setScreen("ownerDashboard")}>Dashboard</button>
        <button onClick={() => setScreen("ownerCalendar")}>Calendar</button>
        <button className="active">Slots</button>
        <button onClick={() => setScreen("ownerMessages")}>Messages</button>
        <button onClick={() => setScreen("howToList")}>How to List</button>
        <button onClick={() => setScreen("landing")}>Logout</button>
      </aside>

      <main className="owner-main">
        <h1>My Parking Slots</h1>
        <p className="owner-subtitle">Manage your listed parking spaces.</p>

        <div className="slot-list">
          <div className="slot-card">
            <h2>Obrero Parking Slot</h2>
            <p>₱50/hour · Available</p>
            <button className="primary-btn">Edit Slot</button>
          </div>

          <div className="slot-card">
            <h2>Condo Parking Space</h2>
            <p>₱60/hour · Booked</p>
            <button className="primary-btn">Edit Slot</button>
          </div>

          <div className="slot-card add-slot">
            <h2>+ Add New Slot</h2>
            <p>Create another parking space listing.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default OwnerSlots;