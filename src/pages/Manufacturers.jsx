import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { MANUFACTURERS } from "../data/products";
import Breadcrumbs from "../components/Breadcrumbs";

export default function Manufacturers() {
  const navigate = useNavigate();

  return (
    <div className="container page">
      <Breadcrumbs items={[{ label: "Виробники" }]} />
      <div className="page-title-block">
        <h1>Виробники</h1>
        <p>Оберіть бренд, щоб переглянути всі товари.</p>
      </div>

      <div className="manufacturers-grid">
        {MANUFACTURERS.map((m) => (
          <button
            key={m.slug}
            className="manufacturer-card"
            onClick={() => navigate(`/catalog?category=&brand=${m.slug}`)}
          >
            <div className="manufacturer-card__logo">
              <img
                src={`${import.meta.env.BASE_URL}${m.logo}`}
                alt={m.name}
                loading="lazy"
              />
            </div>
            <div className="manufacturer-card__content">
              <h3>{m.name}</h3>
              <p>{m.description}</p>
              <span className="manufacturer-card__link">
                Переглянути товари <FaArrowRight />
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
