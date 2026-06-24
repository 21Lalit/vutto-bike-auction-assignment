import { useEffect, useState } from "react";
import { BarChart3, Search, X } from "lucide-react";
import { api, Auction } from "../api/client";
import { AuctionCard } from "../components/AuctionCard";
import { formatKm, formatMoney } from "../utils";

export function Auctions() {
  const initialLocation = new URLSearchParams(window.location.search).get("location") ?? "";
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ keyword: "", status: "", brand: "", location: initialLocation, minPrice: "", maxPrice: "" });
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const compared = auctions.filter((auction) => compareIds.includes(auction.id));

  async function load() {
    setLoading(true);
    setError("");
    const params = new URLSearchParams(Object.entries(filters).filter(([, v]) => v));
    api<{ auctions: Auction[] }>(`/api/auctions?${params}`).then((r) => setAuctions(r.auctions)).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }

  function applyQuick(next: Partial<typeof filters>) {
    const updated = { ...filters, ...next };
    setFilters(updated);
    setLoading(true);
    setError("");
    const params = new URLSearchParams(Object.entries(updated).filter(([, v]) => v));
    api<{ auctions: Auction[] }>(`/api/auctions?${params}`).then((r) => setAuctions(r.auctions)).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }

  useEffect(() => { void load(); }, []);

  return (
    <main className="page">
      <div className="pageHeader">
        <div><h1>Auctions</h1><p>Filter live, scheduled, and completed motorcycle auctions.</p></div>
      </div>
      <form className="filters" onSubmit={(e) => { e.preventDefault(); void load(); }}>
        <label><Search size={16} /> <input placeholder="Keyword" value={filters.keyword} onChange={(e) => setFilters({ ...filters, keyword: e.target.value })} /></label>
        <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}><option value="">Any status</option><option>LIVE</option><option>SCHEDULED</option><option>ENDED</option><option>CANCELLED</option></select>
        <input placeholder="Brand" value={filters.brand} onChange={(e) => setFilters({ ...filters, brand: e.target.value })} />
        <input placeholder="Location" value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} />
        <input placeholder="Min price" type="number" value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} />
        <input placeholder="Max price" type="number" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} />
        <button className="button" disabled={loading}>Apply</button>
      </form>
      <div className="quickFilters">
        <button onClick={() => applyQuick({ status: "LIVE" })}>Live now</button>
        <button onClick={() => applyQuick({ maxPrice: "100000" })}>Budget picks</button>
        <button onClick={() => applyQuick({ keyword: "Royal Enfield" })}>Royal Enfield</button>
        <button onClick={() => applyQuick({ location: "Delhi" })}>Delhi hub</button>
      </div>
      {error && <div className="alert error">{error}</div>}
      {loading ? <div className="grid">{[1,2,3].map((i) => <div className="skeleton card" key={i} />)}</div> :
        auctions.length ? <div className="grid">{auctions.map((auction) => (
          <div className="compareWrap" key={auction.id}>
            <button
              className={`compareToggle ${compareIds.includes(auction.id) ? "active" : ""}`}
              onClick={() => setCompareIds((ids) => ids.includes(auction.id) ? ids.filter((id) => id !== auction.id) : ids.length >= 3 ? [ids[1], ids[2], auction.id] : [...ids, auction.id])}
            >
              <BarChart3 size={16} /> {compareIds.includes(auction.id) ? "Selected" : "Compare"}
            </button>
            <AuctionCard auction={auction} />
          </div>
        ))}</div> :
        <div className="empty">No auctions match those filters.</div>}
      {compared.length === 1 && <div className="compareHint"><BarChart3 size={17} /> Select one more auction to compare. <button onClick={() => setCompareIds([])}><X size={16} /> Clear</button></div>}
      {compared.length > 1 && <section className="compareTray">
        <div className="compareHeader"><strong>Compare auctions</strong><button onClick={() => setCompareIds([])}><X size={17} /> Clear</button></div>
        <div className="compareTable" style={{ gridTemplateColumns: `repeat(${compared.length}, minmax(220px, 1fr))` }}>
          {compared.map((auction) => <div key={auction.id}>
            <img src={auction.bike.photos[0]} alt={auction.bike.title} />
            <h3>{auction.bike.title}</h3>
            <p><strong>Bid:</strong> {formatMoney(auction.currentBid ?? auction.bike.basePrice)}</p>
            <p><strong>Mileage:</strong> {formatKm(auction.bike.mileage)}</p>
            <p><strong>Condition:</strong> {auction.bike.condition}</p>
            <p><strong>Location:</strong> {auction.bike.location}</p>
          </div>)}
        </div>
      </section>}
    </main>
  );
}
