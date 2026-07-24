import { FaMapMarkerAlt, FaPhoneAlt, FaClock, FaExternalLinkAlt, FaDirections } from "react-icons/fa";

const ADDRESS_QUERY = "вулиця Степана Бандери, 26, Самбір, Львівська область";

export default function VisitUs() {
  return (
    <section className="visit-us">
      <div className="container">
        <div className="visit-us__head">
          <h2 className="section__title">Завітайте до нас</h2>
          <p className="visit-us__subtitle">Магазин «Хата Майстра» у Самборі</p>
        </div>

        <div className="visit-us__grid">
          <div className="visit-us__panel">
            <h3 className="visit-us__panel-title">Контакти</h3>

            <div className="visit-us__item">
              <span className="visit-us__icon"><FaMapMarkerAlt /></span>
              <div>
                <h4>Адреса</h4>
                <p>вул. Степана Бандери, 26<br />Самбір, Львівська область</p>
              </div>
            </div>

            <div className="visit-us__item">
              <span className="visit-us__icon"><FaPhoneAlt /></span>
              <div>
                <h4>Телефон</h4>
                <p><a href="tel:+380970775613">+380 97 077 56 13</a></p>
              </div>
            </div>

            <div className="visit-us__item">
              <span className="visit-us__icon"><FaClock /></span>
              <div>
                <h4>Графік роботи</h4>
                <p>Пн-Сб: 09:00–18:00</p>
              </div>
            </div>
          </div>

          <div className="visit-us__map">
            <iframe
              title="Хата Майстра на карті"
              className="visit-us__map-frame"
              src={`https://www.google.com/maps?q=${encodeURIComponent(ADDRESS_QUERY)}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <div className="visit-us__map-card">
              <div className="visit-us__map-card-top">
                <h4>вулиця Степана Бандери, 26</h4>
                <a
                  className="visit-us__map-link"
                  href={`https://www.google.com/maps?q=${encodeURIComponent(ADDRESS_QUERY)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Відкрити на Google Maps"
                >
                  <FaExternalLinkAlt />
                </a>
                <a
                  className="visit-us__map-link visit-us__map-link--route"
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ADDRESS_QUERY)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Прокласти маршрут"
                >
                  <FaDirections />
                </a>
              </div>
              <p>вулиця Степана Бандери, 26,<br />Самбір, Львівська область,<br />Україна, 81400</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
