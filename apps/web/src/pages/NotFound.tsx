import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <main className="page notFound">
      <div className="empty">
        <h1>Page not found</h1>
        <p className="muted">The route does not exist or the auction link is no longer available.</p>
        <div className="actions">
          <Link className="button" to="/auctions">Browse auctions</Link>
          <Link className="button ghost" to="/">Home</Link>
        </div>
      </div>
    </main>
  );
}
