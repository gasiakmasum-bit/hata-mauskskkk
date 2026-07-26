import { Link } from "react-router-dom";
import { MANUFACTURERS } from "../data/products";

export default function Brands() {
  return (
    <section className="brands-section">
      <div className="container brands-section__head">
        <h2>Популярні бренди</h2>
        <Link to="/manufacturers">Всі бренди →</Link>
      </div>
      <div className="container brands-grid">
        {MANUFACTURERS.map((brand) => (
          <Link
            to={`/catalog?category=&brand=${brand.slug}`}
            className="brand-chip"
            key={brand.slug}
            title={brand.name}
          >
            <img
              src={`${import.meta.env.BASE_URL}${brand.logo}`}
              alt={brand.name}
              loading="lazy"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
