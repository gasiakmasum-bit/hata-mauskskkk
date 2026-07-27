import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaFire, FaTools } from "react-icons/fa";

export default function Hero() {
  const navigate = useNavigate();
  return (
    <section className="hero">
      <div className="hero__grid" aria-hidden="true" />
      <div className="container hero__inner">
        <div className="hero__text">
          <span className="hero__badge">
            <FaFire /> Знижки до -30%
          </span>
          <h1 className="hero__title">
            Все для <span>майстра.</span>
            <br />
            В одному місці.
          </h1>
          <p className="hero__lead">
            Електроінструмент, генератори, мототехніка, компресори,
            бетономішалки, садова техніка та тисячі інших товарів від
            перевірених брендів.
          </p>
          <div className="hero__actions">
            <button
              className="btn btn--primary btn--lg"
              onClick={() => navigate("/catalog")}
            >
              Каталог <FaArrowRight />
            </button>
            <button
              className="btn btn--ghost btn--lg"
              onClick={() => navigate("/promotions")}
            >
              Акції
            </button>
          </div>
        </div>

        <div className="hero__photo-card">
          <span className="hero__photo-label">
            <FaTools /> Хата Майстра
          </span>
          <div className="hero__photo-ground" aria-hidden="true" />
          <img
            src={`${import.meta.env.BASE_URL}img/hero-generator.png`}
            alt="Генератор Vitals та набір електроінструменту"
            className="hero__photo-img"
          />
          <div className="hero__photo-glow" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
