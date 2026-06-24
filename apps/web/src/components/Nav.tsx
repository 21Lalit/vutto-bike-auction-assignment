import { Link, NavLink } from "react-router-dom";
import { Bike, CalendarDays, Gauge, LogOut, MapPin, Shield } from "lucide-react";
import { useAuth } from "../state/AuthContext";

export function Nav() {
  const { user, logout } = useAuth();
  return (
    <header className="topbar">
      <Link to="/" className="brand"><Bike size={24} /> vutto-auctions-demo</Link>
      <nav>
        <NavLink to="/auctions">Auctions</NavLink>
        <NavLink to="/events"><CalendarDays size={17} /> Events</NavLink>
        <NavLink to="/hubs"><MapPin size={17} /> Hubs</NavLink>
        <NavLink to="/sell">Sell</NavLink>
        {user && <NavLink to="/dashboard"><Gauge size={17} /> Dashboard</NavLink>}
        {user?.role === "ADMIN" && <NavLink to="/admin"><Shield size={17} /> Admin</NavLink>}
      </nav>
      <div className="session">
        {user ? <><span>{user.name}</span><button className="iconBtn" onClick={logout} title="Log out"><LogOut size={18} /></button></> : <Link className="button ghost" to="/login">Login</Link>}
      </div>
    </header>
  );
}
