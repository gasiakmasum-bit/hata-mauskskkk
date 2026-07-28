import { Link } from "react-router-dom";
import { FaTelegramPlane, FaViber, FaInstagram, FaFacebookF, FaTiktok, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-grid container">
        <div className="footer-col footer-col--brand">
          <div className="logo-block">
            <picture>
              <source srcSet={`${import.meta.env.BASE_URL}img/logo.webp`} type="image/webp" />
              <img
                src={`${import.meta.env.BASE_URL}img/logo.png`}
                alt="Хата Майстра"
                className="logo-block__img"
                width="582"
                height="400"
                loading="lazy"
              />
            </picture>
            <p>ВСЕ ДЛЯ БУДІВНИЦТВА ТА РЕМОНТУ</p>
          </div>
          <div className="social-block">
            <a href="https://www.facebook.com/share/1BrPE2HDod/?mibextid=wwXIfr" aria-label="Facebook" className="social-block__icon social-block__icon--facebook"><FaFacebookF /></a>
            <a href="https://www.instagram.com/masters_house_ua?igsh=MW83eXVybXo4azkxbg%3D%3D&utm_source=qr" aria-label="Instagram" className="social-block__icon social-block__icon--instagram"><FaInstagram /></a>
            <a href="https://www.tiktok.com/@masters_house_ua?_r=1&_t=ZS-98CLDkEvkY8" aria-label="TikTok" className="social-block__icon social-block__icon--tiktok"><FaTiktok /></a>
            <a href="https://t.me/masters_house_ua" aria-label="Telegram" className="social-block__icon social-block__icon--telegram"><FaTelegramPlane /></a>
            <a href="https://wa.me/380970775613" aria-label="WhatsApp" className="social-block__icon social-block__icon--whatsapp"><FaWhatsapp /></a>
            <a href="viber://chat?number=%2B380970775613" aria-label="Viber" className="social-block__icon social-block__icon--viber"><FaViber /></a>
          </div>
        </div>

        <div className="footer-col">
          <h3>КАТАЛОГ</h3>
          <ul>
            <li><Link to="/catalog">Електроінструмент</Link></li>
            <li><Link to="/catalog">Садова техніка</Link></li>
            <li><Link to="/catalog">Будівельне обладнання</Link></li>
            <li><Link to="/catalog">Ручний інструмент</Link></li>
            <li><Link to="/catalog">Зварювальне обладнання</Link></li>
            <li><Link to="/catalog">Все для дому</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>ПОКУПЦЮ</h3>
          <ul>
            <li><Link to="/delivery">Доставка і оплата</Link></li>
            <li><Link to="/promotions">Акції</Link></li>
            <li><Link to="/favorites">Улюблені товари</Link></li>
            <li><Link to="/cabinet">Особистий кабінет</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>КОМПАНІЯ</h3>
          <ul>
            <li><Link to="/about">Про компанію</Link></li>
            <li><Link to="/manufacturers">Виробники</Link></li>
            <li><Link to="/contacts">Контакти</Link></li>
          </ul>
        </div>

        <div className="footer-col footer-col--contacts">
          <h3>КОНТАКТИ</h3>
          <p>вулиця Степана Бандери, 26, Самбір, Львівська область, 81400</p>
          <p><a href="tel:0970775613">097 077 5613</a></p>
          <p><a href="mailto:info@hatamaystra.com.ua">info@hatamaystra.com.ua</a></p>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom__inner">
          <span>&copy; {new Date().getFullYear()} Хата Майстра. Всі права захищені.</span>
          <div className="footer-bottom__links">
            <a href="#">Політика конфіденційності</a>
            <a href="#">Користувацька угода</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
