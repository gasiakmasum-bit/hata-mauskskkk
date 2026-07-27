import { Link } from "react-router-dom";

export default function PromoBanners() {
  return (
    <section className="promo-banners">
      <div className="container promo-banners__grid">
        <div className="banner-card banner-card--dark">
          <img className="banner-card__photo" src={`${import.meta.env.BASE_URL}img/promo-generator.jpg`} alt="" aria-hidden="true" />
          <div className="banner-card__scrim" aria-hidden="true" />
          <div className="banner-card__content">
            <span className="banner-card__subtitle">ЗНИЖКИ НА</span>
            <h3>ГЕНЕРАТОРИ<br />ДО -20%</h3>
            <Link to="/promotions" className="btn btn--primary">Перейти до акції</Link>
          </div>
        </div>

        <div className="banner-card banner-card--orange">
          <img className="banner-card__photo" src={`${import.meta.env.BASE_URL}img/promo-spring.jpg`} alt="" aria-hidden="true" />
          <div className="banner-card__scrim banner-card__scrim--orange" aria-hidden="true" />
          <div className="banner-card__content">
            <h3>ВЕСНЯНІ ЗНИЖКИ<br />НА САДОВУ ТЕХНІКУ</h3>
            <Link to="/catalog" className="btn btn--dark">Дивитись</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
