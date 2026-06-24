import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./state/AuthContext";
import { Nav } from "./components/Nav";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ApiConfigNotice } from "./components/ApiConfigNotice";
import { Landing } from "./pages/Landing";
import { Auctions } from "./pages/Auctions";
import { AuctionDetail } from "./pages/AuctionDetail";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Admin } from "./pages/Admin";
import { Sell } from "./pages/Sell";
import { NotFound } from "./pages/NotFound";
import { Events } from "./pages/Events";
import { Hubs } from "./pages/Hubs";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <AuthProvider>
        <ErrorBoundary>
          <Nav />
          <ApiConfigNotice />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auctions" element={<Auctions />} />
            <Route path="/auctions/:id" element={<AuctionDetail />} />
            <Route path="/events" element={<Events />} />
            <Route path="/hubs" element={<Hubs />} />
            <Route path="/sell" element={<Sell />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute admin><Admin /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>
);
