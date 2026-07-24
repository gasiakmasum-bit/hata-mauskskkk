import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container page empty-state empty-state--panel">
      <span className="empty-state__icon">🧰</span>
      <h1>404</h1>
      <p>Сторінку не знайдено.</p>
      <Link to="/" className="btn btn--primary">На головну</Link>
    </div>
  );
}
