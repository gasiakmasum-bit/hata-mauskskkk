import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaClock,
  FaTruck,
  FaSearch,
  FaPhoneAlt,
  FaTelegramPlane,
  FaViber,
  FaUser,
  FaHeart,
  FaShoppingCart,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useStore } from "../context/StoreContext";

const NAV_LINKS = [
  { to: "/", label: "Головна" },
  { to: "/catalog", label: "Каталог" },
  { to: "/promotions", label: "Акції" },
  { to: "/delivery", label: "Доставка і оплата" },
  { to: "/manufacturers", label: "Виробники" },
  { to: "/about", label: "Про магазин" },
  { to: "/contacts", label: "Контакти" },
];

export default function Header() {
  const navigate = useNavigate();
  const { favorites, cartTotalSum, cartTotalCount, currentUser } = useStore();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  function handleSearchSubmit(e) {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <>
      <div className="top-bar">
        <div className="container top-bar__inner">
          <div className="top-bar__left">
            <span><FaMapMarkerAlt /> м. Самбір, вул. Степана Бандери, 26</span>
            <span className="top-bar__hide-sm"><FaClock /> Пн-Нд 08:00 – 20:00</span>
          </div>
          <div className="top-bar__right">
            <span><FaTruck /> Доставка по всій Україні</span>
          </div>
        </div>
      </div>

      <header className="site-header">
        <div className="container site-header__inner">
          <button
            className="burger"
            aria-label="Меню"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>

          <Link to="/" className="logo" onClick={() => setQuery("")}>
            <picture>
              <source srcSet={`${import.meta.env.BASE_URL}img/logo.webp`} type="image/webp" />
              <img
                src={`${import.meta.env.BASE_URL}img/logo.png`}
                alt="Хата Майстра"
                className="logo__img"
                width="582"
                height="400"
              />
            </picture>
          </Link>

          <button
            className="catalog-btn"
            onClick={() => navigate("/catalog")}
          >
            <FaBars /> <span>Каталог товарів</span>
          </button>

          <form className="search" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Пошук товарів..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" aria-label="Пошук">
              <FaSearch />
            </button>
          </form>

          <div className="phone-block">
            <a href="tel:0970775613"><FaPhoneAlt /> 097 077 5613</a>
          </div>

          <div className="socials">
            <a href="viber://chat?number=%2B380970775613" aria-label="Viber">
              <FaViber />
            </a>
            <a href="https://t.me/masters_house_ua" aria-label="Telegram">
              <FaTelegramPlane />
            </a>
          </div>

          <Link to={currentUser ? "/cabinet" : "/login"} className="account-btn">
            <FaUser />
            <span>{currentUser ? currentUser.name.split(" ")[0] : "Увійти"}</span>
          </Link>

          <Link to="/favorites" className="icon-btn">
            <FaHeart />
            <span className="icon-btn__count">{favorites.length}</span>
          </Link>

          <Link to="/cart" className="icon-btn icon-btn--cart">
            <FaShoppingCart />
            <span className="icon-btn__label">{cartTotalSum} ₴</span>
            {cartTotalCount > 0 && (
              <span className="icon-btn__count">{cartTotalCount}</span>
            )}
          </Link>
        </div>
      </header>

      <nav className={`main-nav ${menuOpen ? "main-nav--open" : ""}`}>
        <div className="container main-nav__inner">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => {
                setQuery("");
                setMenuOpen(false);
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
