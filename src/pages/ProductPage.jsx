import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  FaHeart,
  FaRegHeart,
  FaShoppingCart,
  FaBolt,
  FaMinus,
  FaPlus,
  FaTruck,
  FaShieldAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { products } from "../data/products";
import { useStore } from "../context/StoreContext";
import Breadcrumbs from "../components/Breadcrumbs";
import ProductIcon from "../components/ProductIcon";
import Rating from "../components/Rating";

const TABS = [
  { key: "description", label: "Опис" },
  { key: "specs", label: "Характеристики" },
  { key: "equipment", label: "Комплектація" },
  { key: "reviews", label: "Відгуки" },
  { key: "delivery", label: "Доставка і оплата" },
];

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === Number(id));
  const { favorites, toggleFavorite, addToCart } = useStore();
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("description");

  if (!product) {
    return (
      <div className="container page">
        <p>Товар не знайдено.</p>
        <Link to="/catalog" className="btn btn--primary">До каталогу</Link>
      </div>
    );
  }

  const isFav = favorites.includes(Number(product.id));

  function handleBuyNow() {
    addToCart(product.id, qty);
    navigate("/checkout");
  }

  return (
    <div className="container page">
      <div className="product-page__top">
        <Breadcrumbs items={[{ label: "Каталог", to: "/catalog" }, { label: product.title }]} />
        <button className="btn btn--ghost" onClick={() => navigate(-1)}>
          ← До товарів
        </button>
      </div>

      <div className="product-page">
        <div className="product-page__gallery">
          <div className="product-page__main-image">
            {product.discount && <span className="product-card__badge">Акція</span>}
            <ProductIcon icon={product.icon} className="product-icon--lg" />
          </div>
        </div>

        <div className="product-page__info">
          <span className="product-page__brand">{product.brand}</span>
          <h1>{product.title}</h1>

          <div className="product-page__meta">
            <Rating value={product.rating} reviewsCount={product.reviewsCount} size="lg" />
            <span className="product-page__code">Код товару: {product.code}</span>
          </div>

          <div className="product-page__prices">
            <span className="product-page__price">{product.price} ₴</span>
            {product.oldPrice && (
              <span className="product-page__old-price">{product.oldPrice} ₴</span>
            )}
            {product.discount && (
              <span className="product-page__discount-pill">{product.discount}</span>
            )}
          </div>

          <span className="stock-chip">
            <FaCheckCircle /> {product.status}
          </span>

          <div className="product-page__actions">
            <div className="qty-control">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))}><FaMinus /></button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)}><FaPlus /></button>
            </div>
            <button className="btn btn--outline btn--lg" onClick={() => addToCart(product.id, qty)}>
              <FaShoppingCart /> Додати в кошик
            </button>
            <button className="btn btn--primary btn--lg" onClick={handleBuyNow}>
              <FaBolt /> Купити в 1 клік
            </button>
            <button className="btn btn--outline btn--icon" onClick={() => toggleFavorite(product.id)}>
              {isFav ? <FaHeart /> : <FaRegHeart />}
            </button>
          </div>

          <div className="product-page__perks">
            <span><FaTruck /> Доставка по всій Україні</span>
            <span><FaShieldAlt /> Офіційна гарантія від виробника</span>
          </div>
        </div>
      </div>

      <div className="product-tabs">
        <div className="product-tabs__head">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`product-tabs__btn ${tab === t.key ? "product-tabs__btn--active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="product-tabs__panel">
          {tab === "description" && <p>{product.description}</p>}

          {tab === "specs" && (
            <table>
              <tbody>
                {Object.entries(product.specs).map(([key, val]) => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {tab === "equipment" && <p>{product.equipment}</p>}

          {tab === "reviews" && (
            <div className="product-tabs__reviews">
              <Rating value={product.rating} reviewsCount={product.reviewsCount} size="lg" />
              <p className="muted">
                Детальні відгуки покупців ще не додані. Будьте першим, хто залишить відгук про
                цей товар!
              </p>
            </div>
          )}

          {tab === "delivery" && (
            <div>
              <p>
                Ми доставляємо товари по всій Україні через Нову Пошту (у відділення або
                кур'єром), а також можливий самовивіз з магазину.
              </p>
              <p>
                Оплата можлива готівкою при отриманні, карткою онлайн або за реквізитами для
                юридичних осіб.
              </p>
              <Link to="/delivery" className="btn btn--ghost">Детальніше про доставку і оплату →</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
