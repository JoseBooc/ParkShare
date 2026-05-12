import logo from "../assets/logo.png";

function OwnerMessages({ setScreen }) {
  return (
    <div className="owner-page">
      <aside className="owner-sidebar">
        <img src={logo} alt="ParkShare" className="owner-logo" />

        <button onClick={() => setScreen("ownerDashboard")}>Dashboard</button>
        <button onClick={() => setScreen("ownerCalendar")}>Calendar</button>
        <button onClick={() => setScreen("ownerSlots")}>Slots</button>
        <button className="active">Messages</button>
        <button onClick={() => setScreen("howToList")}>How to List</button>
        <button onClick={() => setScreen("landing")}>Logout</button>
      </aside>

      <main className="owner-main">
        <h1>Messages</h1>
        <p className="owner-subtitle">View client inquiries and booking messages.</p>

        <div className="message-list">
          <div className="message-card">
            <h3>Shane Cava</h3>
            <p>Is the Obrero slot available tonight?</p>
          </div>

          <div className="message-card">
            <h3>Andrea Lopez</h3>
            <p>Can I reserve the condo space for 2 hours?</p>
          </div>

          <div className="message-card">
            <h3>Mark Santos</h3>
            <p>Is the parking area safe for overnight parking?</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default OwnerMessages;