import { ReactNode, useEffect, useMemo, useState } from "react";
import { AlertTriangle, BadgeCheck, CalendarCheck, ChevronLeft, ChevronRight, ClipboardCheck, CreditCard, FileCheck2, FileText, Gauge, Heart, KeyRound, ListChecks, MapPin, PackageCheck, Settings2, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { API_URL, api, Auction } from "../api/client";
import { useAuth } from "../state/AuthContext";
import { formatKm, formatMoney, timeLeft } from "../utils";

function labelize(key: string) {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
}

function detailEntries(record?: Record<string, string>) {
  return Object.entries(record ?? {}).filter(([, value]) => Boolean(value));
}

function DetailPanel({ title, icon, items }: { title: string; icon: ReactNode; items: [string, string][] }) {
  if (!items.length) return null;
  return (
    <section className="infoPanel">
      <h2>{icon}{title}</h2>
      <dl className="detailList">
        {items.map(([key, value]) => <div key={key}><dt>{labelize(key)}</dt><dd>{value}</dd></div>)}
      </dl>
    </section>
  );
}

function ListPanel({ title, icon, items, tone = "check" }: { title: string; icon: ReactNode; items?: string[]; tone?: "check" | "issue" | "doc" }) {
  if (!items?.length) return null;
  return (
    <section className={`infoPanel ${tone}`}>
      <h2>{icon}{title}</h2>
      <ul className="checkList">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </section>
  );
}

export function AuctionDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [auction, setAuction] = useState<Auction | null>(null);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [activePhoto, setActivePhoto] = useState(0);
  const [watching, setWatching] = useState(false);
  const [finance, setFinance] = useState({ downPayment: 20000, months: 24, rate: 10 });
  const [request, setRequest] = useState({
    type: "INSPECTION",
    preferredDate: new Date(Date.now() + 24 * 60 * 60_000).toISOString().slice(0, 16),
    note: ""
  });
  const minBid = useMemo(() => auction ? (auction.currentBid ?? auction.bike.basePrice) + (auction.currentBid ? auction.minimumIncrement : 0) : 0, [auction]);
  const photos = auction?.bike.photos ?? [];
  const monthlyEstimate = useMemo(() => {
    if (!auction) return 0;
    const principal = Math.max((auction.currentBid ?? auction.bike.basePrice) - Number(finance.downPayment || 0), 0);
    const monthlyRate = Number(finance.rate || 0) / 100 / 12;
    const months = Math.max(Number(finance.months || 1), 1);
    if (!monthlyRate) return Math.ceil(principal / months);
    return Math.ceil((principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1));
  }, [auction, finance]);

  useEffect(() => {
    if (!id) return;
    api<{ auction: Auction }>(`/api/auctions/${id}`).then((r) => { setAuction(r.auction); setActivePhoto(0); setAmount(String((r.auction.currentBid ?? r.auction.bike.basePrice) + r.auction.minimumIncrement)); }).catch((e) => setError(e.message));
    if (localStorage.getItem("token")) {
      api<{ watching: boolean }>(`/api/watchlist/${id}`).then((r) => setWatching(r.watching)).catch(() => setWatching(false));
    }
    const socket = io(API_URL);
    socket.emit("auction:join", id);
    socket.on("bid:new", ({ bid, auction: updated }) => {
      setAuction((current) => current && ({ ...current, ...updated, bids: [bid, ...current.bids] }));
    });
    socket.on("auction:updated", (updated) => setAuction((current) => current && ({ ...current, ...updated })));
    return () => { socket.emit("auction:leave", id); socket.disconnect(); };
  }, [id]);

  async function submitBid(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setMessage("");
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Login is required to bid");
      await api(`/api/auctions/${id}/bids`, { method: "POST", body: JSON.stringify({ amount: Number(amount) }) });
      setMessage("Bid placed successfully.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bid failed");
    }
  }

  async function toggleWatchlist() {
    setError(""); setMessage("");
    try {
      if (!user) throw new Error("Login is required to save auctions");
      if (watching) {
        await api(`/api/watchlist/${id}`, { method: "DELETE" });
        setWatching(false);
        setMessage("Removed from watchlist.");
      } else {
        await api(`/api/watchlist/${id}`, { method: "POST" });
        setWatching(true);
        setMessage("Saved to watchlist.");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update watchlist");
    }
  }

  async function submitRequest(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setMessage("");
    try {
      if (!user) throw new Error("Login is required to request an inspection");
      await api(`/api/watchlist/${id}/requests`, { method: "POST", body: JSON.stringify(request) });
      setMessage("Request sent to the auction team.");
      setRequest({ ...request, note: "" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not send request");
    }
  }

  function movePhoto(direction: -1 | 1) {
    setActivePhoto((current) => {
      if (!photos.length) return 0;
      return (current + direction + photos.length) % photos.length;
    });
  }

  if (error && !auction) return <main className="page"><div className="alert error">{error}</div></main>;
  if (!auction) return <main className="page"><div className="skeleton tall" /></main>;

  const details = auction.bike.details ?? {};
  const hasDossier = Boolean(
    detailEntries(details.technical).length ||
    detailEntries(details.ownership).length ||
    detailEntries(details.service).length ||
    detailEntries(details.inspection).length ||
    detailEntries(details.commercial).length ||
    details.documents?.length ||
    details.features?.length ||
    details.included?.length ||
    details.knownIssues?.length
  );

  return (
    <main className="page detail">
      <section className="gallery carouselGallery" aria-label={`${auction.bike.title} photo gallery`}>
        <div className="carouselStage">
          <img className="primaryImage" src={photos[activePhoto]} alt={`${auction.bike.title} photo ${activePhoto + 1}`} />
          {photos.length > 1 && <>
            <button className="carouselControl prev" type="button" onClick={() => movePhoto(-1)} aria-label="Previous photo"><ChevronLeft size={24} /></button>
            <button className="carouselControl next" type="button" onClick={() => movePhoto(1)} aria-label="Next photo"><ChevronRight size={24} /></button>
            <span className="photoCounter">{activePhoto + 1} / {photos.length}</span>
          </>}
        </div>
        {photos.length > 1 && <div className="thumbnailRail" aria-label="Select photo">
          {photos.map((photo, index) => (
            <button className={index === activePhoto ? "active" : ""} type="button" key={photo} onClick={() => setActivePhoto(index)} aria-label={`Show photo ${index + 1}`}>
              <img src={photo} alt="" />
            </button>
          ))}
        </div>}
      </section>
      <section className="detailGrid">
        <div>
          <span className={`status ${auction.status.toLowerCase()}`}>{auction.status}</span>
          <h1>{auction.bike.title}</h1>
          <p>{auction.bike.description}</p>
          <div className="valuePills">
            <span><MapPin size={16} /> {auction.bike.location}</span>
            <span><Gauge size={16} /> {formatKm(auction.bike.mileage)}</span>
            <span><Sparkles size={16} /> {auction.bike.condition}</span>
            <span><CreditCard size={16} /> Base {formatMoney(auction.bike.basePrice)}</span>
          </div>
          <dl className="specs">
            <div><dt>Brand</dt><dd>{auction.bike.brand}</dd></div><div><dt>Model</dt><dd>{auction.bike.model}</dd></div>
            <div><dt>Year</dt><dd>{auction.bike.year}</dd></div><div><dt>Mileage</dt><dd>{formatKm(auction.bike.mileage)}</dd></div>
            <div><dt>Condition</dt><dd>{auction.bike.condition}</dd></div><div><dt>Location</dt><dd>{auction.bike.location}</dd></div>
            {auction.bike.reservePrice ? <div><dt>Reserve</dt><dd>{formatMoney(auction.bike.reservePrice)}</dd></div> : null}
          </dl>
          <div className="confidencePanel">
            <div><BadgeCheck /><strong>Certified inspection</strong><span>Condition, photos, and specs are admin-reviewed before bidding.</span></div>
            <div><FileCheck2 /><strong>Ownership handoff</strong><span>Winner gets document and transfer guidance after auction close.</span></div>
            <div><CreditCard /><strong>Finance signal</strong><span>Estimated EMI starts near {formatMoney(Math.ceil((auction.currentBid ?? auction.bike.basePrice) / 24))}/mo for planning.</span></div>
            <div><ShieldCheck /><strong>Late-bid protection</strong><span>Server rejects bids after the auction deadline and below increment.</span></div>
          </div>
          <div className="sectionTitle"><h2>Vehicle dossier</h2><p>Inspection, ownership, service, documents, and auction handoff details for bid confidence.</p></div>
          {hasDossier ? (
            <>
              <div className="detailSectionGrid">
                <DetailPanel title="Technical specs" icon={<Settings2 size={20} />} items={detailEntries(details.technical)} />
                <DetailPanel title="Ownership" icon={<KeyRound size={20} />} items={detailEntries(details.ownership)} />
                <DetailPanel title="Service condition" icon={<Wrench size={20} />} items={detailEntries(details.service)} />
                <DetailPanel title="Inspection checks" icon={<ClipboardCheck size={20} />} items={detailEntries(details.inspection)} />
              </div>
              <div className="detailSectionGrid">
                <ListPanel title="Documents verified" icon={<FileText size={20} />} items={details.documents} tone="doc" />
                <ListPanel title="Features" icon={<ListChecks size={20} />} items={details.features} />
                <ListPanel title="Included with sale" icon={<PackageCheck size={20} />} items={details.included} />
                <ListPanel title="Known notes" icon={<AlertTriangle size={20} />} items={details.knownIssues} tone="issue" />
              </div>
              <DetailPanel title="Auction readiness" icon={<ShieldCheck size={20} />} items={detailEntries(details.commercial)} />
            </>
          ) : <div className="empty">Detailed inspection dossier will be uploaded by the auction team before live bidding.</div>}
          <h2>Bid history</h2>
          <div className="history">{auction.bids.length ? auction.bids.map((bid) => <div key={bid.id}><span>{bid.user?.name ?? "Bidder"}</span><strong>{formatMoney(bid.amount)}</strong></div>) : <p className="muted">No bids yet.</p>}</div>
        </div>
        <aside className="bidPanel">
          <button className={`button full ${watching ? "saved" : ""}`} type="button" onClick={toggleWatchlist}><Heart size={18} fill={watching ? "currentColor" : "none"} /> {watching ? "Saved to watchlist" : "Save auction"}</button>
          <p className="muted">Current highest bid</p>
          <h2>{formatMoney(auction.currentBid ?? auction.bike.basePrice)}</h2>
          <p className="countdown">{timeLeft(auction.endTime)}</p>
          <form onSubmit={submitBid}>
            <label>Bid amount<input type="number" min={minBid} value={amount} onChange={(e) => setAmount(e.target.value)} /></label>
            <button className="button full" disabled={!user || auction.status !== "LIVE" || Number(amount) < minBid}>Place bid</button>
          </form>
          {message && <div className="alert success">{message}</div>}
          {error && <div className="alert error">{error}</div>}
          <form className="requestBox" onSubmit={submitRequest}>
            <strong><CalendarCheck size={18} /> Request support</strong>
            <select value={request.type} onChange={(e) => setRequest({ ...request, type: e.target.value })}>
              <option value="INSPECTION">Inspection</option>
              <option value="TEST_RIDE">Test ride</option>
              <option value="VIDEO_CALL">Video call</option>
            </select>
            <input type="datetime-local" value={request.preferredDate} onChange={(e) => setRequest({ ...request, preferredDate: e.target.value })} />
            <textarea maxLength={500} placeholder="What should the team check?" value={request.note} onChange={(e) => setRequest({ ...request, note: e.target.value })} />
            <button className="button full" disabled={!user}>Send request</button>
          </form>
          <div className="financeBox">
            <strong><CreditCard size={18} /> Payment planner</strong>
            <label>Down payment<input type="number" min="0" value={finance.downPayment} onChange={(e) => setFinance({ ...finance, downPayment: Number(e.target.value) })} /></label>
            <div className="two"><label>Months<input type="number" min="1" value={finance.months} onChange={(e) => setFinance({ ...finance, months: Number(e.target.value) })} /></label><label>APR %<input type="number" min="0" value={finance.rate} onChange={(e) => setFinance({ ...finance, rate: Number(e.target.value) })} /></label></div>
            <p className="financeResult">{formatMoney(monthlyEstimate)} / month</p>
          </div>
          <div className="rules"><strong>Auction rules</strong><p>Minimum increment is {formatMoney(auction.minimumIncrement)}. Late bids and bids below the minimum are rejected by the server.</p></div>
        </aside>
      </section>
    </main>
  );
}
