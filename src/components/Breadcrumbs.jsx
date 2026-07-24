import { Link } from "react-router-dom";

export default function Breadcrumbs({ items }) {
  return (
    <div className="breadcrumbs">
      <Link to="/">Головна</Link>
      {items.map((item, i) => (
        <span key={i}>
          <span className="breadcrumbs__sep">/</span>
          {item.to ? <Link to={item.to}>{item.label}</Link> : <span>{item.label}</span>}
        </span>
      ))}
    </div>
  );
}
