import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaFire, FaBolt } from "react-icons/fa";

export default function Hero() {
  const navigate = useNavigate();
  return (
    <section className="hero">
      <div className="hero__grid" aria-hidden="true" />
      <div className="hero__beam" aria-hidden="true" />
      <span className="hero__spark hero__spark--1" aria-hidden="true"><FaBolt /></span>
      <span className="hero__spark hero__spark--2" aria-hidden="true"><FaBolt /></span>
      <div className="container hero__inner">
        <div className="hero__text">
          <span className="hero__badge hero__reveal" style={{ "--d": "0s" }}>
            <FaFire /> Знижки до -30%
          </span>
          <h1 className="hero__title hero__reveal" style={{ "--d": "0.08s" }}>
            Все для <span>майстра.</span>
            <br />
            В одному місці.
          </h1>
          <p className="hero__lead hero__reveal" style={{ "--d": "0.16s" }}>
            Електроінструмент, генератори, мототехніка, компресори,
            бетономішалки, садова техніка та тисячі інших товарів від
            перевірених брендів.
          </p>
          <div className="hero__actions hero__reveal" style={{ "--d": "0.24s" }}>
            <button
              className="btn btn--primary btn--lg btn--shine"
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

        <div className="hero__photo-stage-wrap hero__reveal hero__reveal--photo" style={{ "--d": "0.12s" }}>
          <div className="hero__photo-spotlight" aria-hidden="true" />
          <div className="hero__photo-podium" aria-hidden="true" />
          <span className="hero__photo-pulse hero__photo-pulse--1" aria-hidden="true" />
          <span className="hero__photo-pulse hero__photo-pulse--2" aria-hidden="true" />
          <div className="hero__photo-stage" aria-hidden="true">
            <img
              src={`${import.meta.env.BASE_URL}img/hero-generator.png`}
              alt="Генератор Vitals та набір електроінструменту"
              className="hero__photo-img"
            />
            <img
              src={`${import.meta.env.BASE_URL}img/hero-generator.png`}
              alt=""
              aria-hidden="true"
              className="hero__photo-reflection"
            />
          </div>
          <div className="hero__photo-ground" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
