import { useState } from "react";
import { Bike, ClipboardCheck, DollarSign, MapPin, Truck } from "lucide-react";
import { api } from "../api/client";

export function Sell() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "Delhi",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    expectedPrice: 75000,
    wantsPickup: true,
    notes: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await api("/api/sell/leads", {
        method: "POST",
        body: JSON.stringify({ ...form, year: Number(form.year), expectedPrice: Number(form.expectedPrice) || null })
      });
      setMessage("Your bike details were submitted. The auction team can review this lead in the admin dashboard.");
      setForm({ ...form, name: "", phone: "", brand: "", model: "", notes: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit seller lead");
    }
  }

  return (
    <main className="page sellPage">
      <section className="sellHero">
        <div>
          <span className="eyebrow">Seller intake</span>
          <h1>List a motorcycle for auction</h1>
          <p>Collect bike details, inspection preference, location, and expected price before converting a lead into an auction listing.</p>
        </div>
        <div className="sellerPromise">
          <div><ClipboardCheck /> Inspection-ready intake</div>
          <div><Truck /> Pickup or showroom handoff</div>
          <div><DollarSign /> Reserve-price planning</div>
          <div><MapPin /> City-based routing</div>
        </div>
      </section>
      <section className="sellGrid">
        <form className="panel" onSubmit={submit}>
          <h2>Bike and contact details</h2>
          <div className="two"><label>Name<input required minLength={2} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label><label>Phone<input required minLength={8} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label></div>
          <div className="two"><label>City<input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></label><label>Year<input required type="number" min="1980" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} /></label></div>
          <div className="two"><label>Brand<input required minLength={2} value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} /></label><label>Model<input required value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} /></label></div>
          <label>Expected price<input type="number" min="1" value={form.expectedPrice} onChange={(e) => setForm({ ...form, expectedPrice: Number(e.target.value) })} /></label>
          <label className="checkRow"><input type="checkbox" checked={form.wantsPickup} onChange={(e) => setForm({ ...form, wantsPickup: e.target.checked })} /> Request pickup inspection</label>
          <label>Notes<textarea maxLength={500} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Condition, ownership documents, loan status, service history" /></label>
          {message && <div className="alert success">{message}</div>}
          {error && <div className="alert error">{error}</div>}
          <button className="button full"><Bike size={18} /> Submit bike</button>
        </form>
        <aside className="panel sellGuide">
          <h2>What buyers see later</h2>
          <p>Good seller intake makes auctions easier to trust. These checks can be converted into listing badges and detail-page confidence signals.</p>
          <ul>
            <li>Inspection status and service history</li>
            <li>Ownership transfer readiness</li>
            <li>Open challan or document notes</li>
            <li>Reserve price and bid increment recommendation</li>
            <li>Pickup, showroom, or test-ride location</li>
          </ul>
        </aside>
      </section>
    </main>
  );
}
