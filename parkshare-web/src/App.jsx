import { useEffect, useState } from "react";
import "./App.css";

import Landing from "./pages/Landing";
import Login from "./pages/Login";

import DriverDashboard from "./pages/DriverDashboard";
import DriverProfile from "./pages/DriverProfile";
import Wishlist from "./pages/Wishlist";
import Listing from "./pages/Listing";
import LocationGuide from "./pages/LocationGuide";

import OwnerDashboard from "./pages/OwnerDashboard";
import OwnerCalendar from "./pages/OwnerCalendar";
import OwnerSlots from "./pages/OwnerSlots";
import OwnerMessages from "./pages/OwnerMessages";
import HowToList from "./pages/HowToList";

function App() {
  const [screen, setScreen] = useState("landing");

  useEffect(() => {
    const path = window.location.pathname;

    if (path === "/admin") {
      setScreen("ownerDashboard");
    }
  }, []);

  const pages = {
    landing: <Landing setScreen={setScreen} />,
    login: <Login setScreen={setScreen} />,

    driverDashboard: <DriverDashboard setScreen={setScreen} />,
    driverProfile: <DriverProfile setScreen={setScreen} />,
    wishlist: <Wishlist setScreen={setScreen} />,
    listing: <Listing setScreen={setScreen} />,
    locationGuide: <LocationGuide setScreen={setScreen} />,

    ownerDashboard: <OwnerDashboard setScreen={setScreen} />,
    ownerCalendar: <OwnerCalendar setScreen={setScreen} />,
    ownerSlots: <OwnerSlots setScreen={setScreen} />,
    ownerMessages: <OwnerMessages setScreen={setScreen} />,
    howToList: <HowToList setScreen={setScreen} />,
  };

  return pages[screen];
}

export default App;