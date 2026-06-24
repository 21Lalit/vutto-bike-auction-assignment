import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock, FileText, MapPin, Radio, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { api, Auction } from "../api/client";
import { formatMoney, timeLeft } from "../utils";
import { hubForLocation } from "../data/vutto";

export function Events() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const eventAuctions = useMemo(() => auctions.filter((auction) => ["LIVE", "SCHEDULED"].includes(auction.status)), [auctions]);

  useEffect(() => {
    api<{ auctions: Auction[] }>("/api/auctions")
      .then((res) => setAuctions(res.auctions))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function interested(auctionId: string) {
    setMessage("");
    setError("");
    try {
      if (!localStorage.getItem("token")) throw new Error("Login is required to save interest.");
      await api(`/api/watchlist/${auctionId}`, { method: "POST" });
      setMessage("Auction added to your watchlist.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save interest");
    }
  }

  return (
    <main className="page">
      <div className="pageHeader">
        <div><h1>vutto-auctions-demo Events</h1><p>Live and upcoming bike auctions with online bidding and hub inspection support.</p></div>
      </div>
      <section className="eventStats">
        <div><Radio /><strong>{eventAuctions.filter((a) => a.status === "LIVE").length}</strong><span>Live now</span></div>
        <div><CalendarDays /><strong>{eventAuctions.filter((a) => a.status === "SCHEDULED").length}</strong><span>Upcoming</span></div>
        <div><MapPin /><strong>7</strong><span>Vutto hubs</span></div>
      </section>
      {message && <div className="alert success">{message}</div>}
      {error && <div className="alert error">{error}</div>}
      {loading ? <div className="skeleton tall" /> : (
        <section className="eventGrid">
          {eventAuctions.map((auction) => {
            const hub = hubForLocation(auction.bike.location);
            return (
              <article className="eventCard" key={auction.id}>
                <div className="eventMedia"><img src={auction.bike.photos[0]} alt={auction.bike.title} /><span className={`status ${auction.status.toLowerCase()}`}>{auction.status}</span></div>
                <div className="eventBody">
                  <h2>{hub.city} Certified Bike Auction</h2>
                  <p>{auction.bike.title}</p>
                  <div className="eventMeta"><span><MapPin size={16} /> {hub.name}</span><span><Clock size={16} /> {timeLeft(auction.endTime)}</span><span><Star size={16} /> Bike only</span></div>
                  <dl className="eventFacts"><div><dt>Current bid</dt><dd>{formatMoney(auction.currentBid ?? auction.bike.basePrice)}</dd></div><div><dt>Format</dt><dd>Online + hub inspection</dd></div><div><dt>Catalogue</dt><dd>{auction.bike.brand} {auction.bike.model}</dd></div></dl>
                  <div className="eventActions">
                    <Link className="button" to={`/auctions/${auction.id}`}><FileText size={18} /> View catalogue</Link>
                    <button className="button ghost" onClick={() => interested(auction.id)}>I am interested</button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}
