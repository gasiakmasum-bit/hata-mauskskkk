import { Link } from "react-router-dom";
import { BRAND_LIST } from "../data/products";

export default function Brands() {
  return (
    <section className="brands-section">
      <div className="container brands-section__head">
        <h2>Популярні бренди</h2>
        <Link to="/manufacturers">Всі бренди →</Link>
      </div>
      <div className="container brands-grid">
        {BRAND_LIST.map((brand) => (
          <div className="brand-chip" key={brand}>
            {brand}
          </div>
        ))}
      </div>
    </section>
  );
}
