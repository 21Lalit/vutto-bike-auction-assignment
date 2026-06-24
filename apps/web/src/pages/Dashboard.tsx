import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, Auction, InspectionRequest } from "../api/client";
import { AuctionCard } from "../components/AuctionCard";

export function Dashboard() {
  const [data, setData] = useState<{ active: Auction[]; won: Auction[]; lost: Auction[] } | null>(null);
  const [watchlist, setWatchlist] = useState<Auction[]>([]);
  const [requests, setRequests] = useState<InspectionRequest[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      api<{ active: Auction[]; won: Auction[]; lost: Auction[] }>("/api/users/me/auctions"),
      api<{ watchlist: Auction[] }>("/api/watchlist"),
      api<{ requests: InspectionRequest[] }>("/api/requests/me")
    ]).then(([auctionData, watchData, requestData]) => {
      setData(auctionData);
      setWatchlist(watchData.watchlist);
      setRequests(requestData.requests);
    }).catch((e) => setError(e.message));
  }, []);

  if (error) return <main className="page"><div className="alert error">{error}</div></main>;
  if (!data) return <main className="page"><div className="skeleton tall" /></main>;

  return (
    <main className="page">
      <div className="pageHeader"><div><h1>My auctions</h1><p>Track active bids, wins, and lost auctions.</p></div><Link className="button" to="/auctions">Find auctions</Link></div>
      <DashboardSection title="Watchlist" auctions={watchlist} />
      <section className="dashSection">
        <h2>Inspection and test-ride requests</h2>
        {requests.length ? <div className="requestList">{requests.map((request) => <div key={request.id} className="requestItem"><strong>{request.auction.bike.title}</strong><span>{request.type.replace("_", " ")} · {new Date(request.preferredDate).toLocaleString()} · {request.status}</span></div>)}</div> : <div className="empty">No requests yet.</div>}
      </section>
      <DashboardSection title="Active bids" auctions={data.active} />
      <DashboardSection title="Won auctions" auctions={data.won} />
      <DashboardSection title="Lost auctions" auctions={data.lost} />
    </main>
  );
}

function DashboardSection({ title, auctions }: { title: string; auctions: Auction[] }) {
  return (
    <section className="dashSection">
      <h2>{title}</h2>
      {auctions.length ? <div className="grid compact">{auctions.map((auction) => <AuctionCard key={auction.id} auction={auction} />)}</div> : <div className="empty">Nothing here yet.</div>}
    </section>
  );
}
