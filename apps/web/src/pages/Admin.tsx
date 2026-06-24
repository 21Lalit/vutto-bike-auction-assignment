import { useEffect, useMemo, useState } from "react";
import { api, Auction, Bike, InspectionRequest, SellerLead, User } from "../api/client";
import { formatMoney } from "../utils";

export function Admin() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [leads, setLeads] = useState<SellerLead[]>([]);
  const [requests, setRequests] = useState<InspectionRequest[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [bikeForm, setBikeForm] = useState({
    title: "", brand: "", model: "", year: new Date().getFullYear(), mileage: 0, condition: "GOOD",
    location: "", photos: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80",
    description: "", basePrice: 2500, reservePrice: 3000
  });
  const [auctionForm, setAuctionForm] = useState({ bikeId: "", status: "SCHEDULED", startTime: "", endTime: "", minimumIncrement: 100 });
  const stats = useMemo(() => ({
    live: auctions.filter((a) => a.status === "LIVE").length,
    scheduled: auctions.filter((a) => a.status === "SCHEDULED").length,
    ended: auctions.filter((a) => a.status === "ENDED").length,
    users: users.length,
    leads: leads.length,
    requests: requests.length
  }), [auctions, users, leads, requests]);

  async function load() {
    setError("");
    try {
      const [auctionRes, bikeRes, userRes, leadRes, requestRes] = await Promise.all([
        api<{ auctions: Auction[] }>("/api/auctions"),
        api<{ bikes: Bike[] }>("/api/bikes"),
        api<{ users: User[] }>("/api/users"),
        api<{ leads: SellerLead[] }>("/api/sell/leads"),
        api<{ requests: InspectionRequest[] }>("/api/requests")
      ]);
      setAuctions(auctionRes.auctions); setBikes(bikeRes.bikes); setUsers(userRes.users);
      setLeads(leadRes.leads);
      setRequests(requestRes.requests);
      setAuctionForm((f) => ({ ...f, bikeId: f.bikeId || bikeRes.bikes[0]?.id || "" }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Load failed");
    }
  }
  useEffect(() => { void load(); }, []);

  async function createBike(e: React.FormEvent) {
    e.preventDefault(); setError(""); setMessage("");
    try {
      await api("/api/bikes", { method: "POST", body: JSON.stringify({ ...bikeForm, photos: bikeForm.photos.split(",").map((p) => p.trim()), reservePrice: Number(bikeForm.reservePrice) || null, basePrice: Number(bikeForm.basePrice), mileage: Number(bikeForm.mileage), year: Number(bikeForm.year) }) });
      setMessage("Bike listing created."); await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Create failed"); }
  }

  async function createAuction(e: React.FormEvent) {
    e.preventDefault(); setError(""); setMessage("");
    try {
      await api("/api/auctions", { method: "POST", body: JSON.stringify({ ...auctionForm, minimumIncrement: Number(auctionForm.minimumIncrement) }) });
      setMessage("Auction created."); await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Create failed"); }
  }

  async function lifecycle(id: string, action: "start" | "end" | "cancel") {
    await api(`/api/auctions/${id}/${action}`, { method: "POST" }); await load();
  }

  async function updateRequest(id: string, status: InspectionRequest["status"]) {
    await api(`/api/requests/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }); await load();
  }

  async function updateLead(id: string, status: string) {
    await api(`/api/sell/leads/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }); await load();
  }

  return (
    <main className="page adminPage">
      <div className="pageHeader"><div><h1>Admin dashboard</h1><p>Manage listings, auctions, users, and lifecycle status.</p></div></div>
      {error && <div className="alert error">{error}</div>}{message && <div className="alert success">{message}</div>}
      <section className="statGrid"><div><strong>{stats.live}</strong><span>Live</span></div><div><strong>{stats.scheduled}</strong><span>Scheduled</span></div><div><strong>{stats.ended}</strong><span>Ended</span></div><div><strong>{stats.users}</strong><span>Users</span></div><div><strong>{stats.leads}</strong><span>Seller leads</span></div><div><strong>{stats.requests}</strong><span>Requests</span></div></section>
      <section className="adminGrid">
        <form className="panel" onSubmit={createBike}>
          <h2>Create bike</h2>
          <input required placeholder="Title" value={bikeForm.title} onChange={(e) => setBikeForm({ ...bikeForm, title: e.target.value })} />
          <div className="two"><input required placeholder="Brand" value={bikeForm.brand} onChange={(e) => setBikeForm({ ...bikeForm, brand: e.target.value })} /><input required placeholder="Model" value={bikeForm.model} onChange={(e) => setBikeForm({ ...bikeForm, model: e.target.value })} /></div>
          <div className="two"><input required type="number" placeholder="Year" value={bikeForm.year} onChange={(e) => setBikeForm({ ...bikeForm, year: Number(e.target.value) })} /><input required type="number" placeholder="Mileage" value={bikeForm.mileage} onChange={(e) => setBikeForm({ ...bikeForm, mileage: Number(e.target.value) })} /></div>
          <select value={bikeForm.condition} onChange={(e) => setBikeForm({ ...bikeForm, condition: e.target.value })}><option>EXCELLENT</option><option>GOOD</option><option>FAIR</option><option>PROJECT</option></select>
          <input required placeholder="Location" value={bikeForm.location} onChange={(e) => setBikeForm({ ...bikeForm, location: e.target.value })} />
          <input required placeholder="Photo URLs, comma separated" value={bikeForm.photos} onChange={(e) => setBikeForm({ ...bikeForm, photos: e.target.value })} />
          <textarea required minLength={20} placeholder="Description" value={bikeForm.description} onChange={(e) => setBikeForm({ ...bikeForm, description: e.target.value })} />
          <div className="two"><input required type="number" placeholder="Base price" value={bikeForm.basePrice} onChange={(e) => setBikeForm({ ...bikeForm, basePrice: Number(e.target.value) })} /><input type="number" placeholder="Reserve price" value={bikeForm.reservePrice} onChange={(e) => setBikeForm({ ...bikeForm, reservePrice: Number(e.target.value) })} /></div>
          <button className="button full">Create bike</button>
        </form>
        <form className="panel" onSubmit={createAuction}>
          <h2>Create auction</h2>
          <select required value={auctionForm.bikeId} onChange={(e) => setAuctionForm({ ...auctionForm, bikeId: e.target.value })}>{bikes.map((b) => <option key={b.id} value={b.id}>{b.title}</option>)}</select>
          <select value={auctionForm.status} onChange={(e) => setAuctionForm({ ...auctionForm, status: e.target.value })}><option>DRAFT</option><option>SCHEDULED</option><option>LIVE</option></select>
          <label>Start time<input required type="datetime-local" value={auctionForm.startTime} onChange={(e) => setAuctionForm({ ...auctionForm, startTime: e.target.value })} /></label>
          <label>End time<input required type="datetime-local" value={auctionForm.endTime} onChange={(e) => setAuctionForm({ ...auctionForm, endTime: e.target.value })} /></label>
          <input required type="number" min="1" value={auctionForm.minimumIncrement} onChange={(e) => setAuctionForm({ ...auctionForm, minimumIncrement: Number(e.target.value) })} />
          <button className="button full">Create auction</button>
        </form>
      </section>
      <section className="panel wide"><h2>Auction activity</h2><div className="table">{auctions.map((a) => <div key={a.id} className="row"><span>{a.bike.title}</span><span className={`status ${a.status.toLowerCase()}`}>{a.status}</span><span>{formatMoney(a.currentBid ?? a.bike.basePrice)}</span><span>{a.bids.length} bids</span><div><button onClick={() => lifecycle(a.id, "start")}>Start</button><button onClick={() => lifecycle(a.id, "end")}>End</button><button onClick={() => lifecycle(a.id, "cancel")}>Cancel</button></div></div>)}</div></section>
      <section className="panel wide"><h2>Inspection and test-ride requests</h2><div className="table">{requests.length ? requests.map((request) => <div key={request.id} className="row requestAdminRow"><span>{request.auction.bike.title}<small>{request.user?.name} · {request.user?.email}</small></span><span>{request.type.replace("_", " ")}</span><span>{new Date(request.preferredDate).toLocaleString()}</span><span className={`status ${request.status.toLowerCase()}`}>{request.status}</span><div><button onClick={() => updateRequest(request.id, "CONFIRMED")}>Confirm</button><button onClick={() => updateRequest(request.id, "COMPLETED")}>Done</button><button onClick={() => updateRequest(request.id, "CANCELLED")}>Cancel</button></div></div>) : <div className="empty">No buyer requests yet.</div>}</div></section>
      <section className="panel wide"><h2>Seller leads</h2><div className="table">{leads.length ? leads.map((lead) => <div key={lead.id} className="row leadRow"><span>{lead.name}<small>{lead.phone}</small></span><span>{lead.city}</span><span>{lead.year} {lead.brand} {lead.model}</span><span>{lead.expectedPrice ? formatMoney(lead.expectedPrice) : "No price"}</span><div><select value={lead.status} onChange={(e) => updateLead(lead.id, e.target.value)}><option>NEW</option><option>CONTACTED</option><option>APPRAISED</option><option>CONVERTED</option><option>CLOSED</option></select></div></div>) : <div className="empty">No seller leads yet.</div>}</div></section>
      <section className="panel wide"><h2>Users</h2><div className="table">{users.map((u) => <div key={u.id} className="row"><span>{u.name}</span><span>{u.email}</span><span>{u.role}</span></div>)}</div></section>
    </main>
  );
}
