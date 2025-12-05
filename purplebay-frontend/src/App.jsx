// src/App.jsx
import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeContext } from "./context/ThemeContext";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Notifications from "./pages/Notifications";
import ListingDetails from "./pages/ListingDetails";
import WatchlistPage from "./pages/WatchlistPage";
import Watchlist from "./pages/Watchlist";
import Messages from "./pages/Messages";
import Orders from "./pages/Orders";
import SearchResults from "./pages/SearchResults";
import CreateListing from "./pages/CreateListing";
import Profile from "./pages/Profile";
import MockPayment from "./pages/MockPayment";
import ListingsPage from "./pages/ListingsPage"; // Make sure this file exists!

function App() {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className={`app-container ${theme}`}
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Navbar />
      <main className="container my-4 flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/listings/:id" element={<ListingDetails />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
          <Route path="/messages/:userId" element={<Messages />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/payments/mock" element={<MockPayment />} />
          <Route path="/listings" element={<ListingsPage />} /> {/* All listings */}
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;

