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
  FaStar,
  FaRegStar,
  FaTrash,
  FaUserCircle,
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
  const { favorites, toggleFavorite, addToCart, comments, addComment, deleteComment, currentUser } =
    useStore();
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("description");
  const [commentName, setCommentName] = useState(currentUser?.name || "");
  const [commentText, setCommentText] = useState("");
  const [commentRating, setCommentRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [commentError, setCommentError] = useState("");

  if (!product) {
    return (
      <div className="container page">
        <p>Товар не знайдено.</p>
        <Link to="/catalog" className="btn btn--primary">До каталогу</Link>
      </div>
    );
  }

  const isFav = favorites.includes(Number(product.id));
  const productComments = comments[Number(product.id)] || [];
  const commentsAvgRating = productComments.length
    ? productComments.reduce((sum, c) => sum + c.rating, 0) / productComments.length
    : product.rating;

  function handleBuyNow() {
    addToCart(product.id, qty);
    navigate("/checkout");
  }

  function handleSubmitComment(e) {
    e.preventDefault();
    if (!commentText.trim()) {
      setCommentError("Напишіть текст коментаря.");
      return;
    }
    addComment(product.id, {
      name: commentName,
      text: commentText,
      rating: commentRating,
    });
    setCommentText("");
    setCommentRating(5);
    setCommentError("");
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
              {t.key === "reviews" && productComments.length > 0 && (
                <span className="product-tabs__count">{productComments.length}</span>
              )}
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
              <div className="reviews-summary">
                <Rating value={commentsAvgRating} reviewsCount={productComments.length} size="lg" />
              </div>

              {productComments.length === 0 ? (
                <p className="muted">
                  Відгуків ще немає. Будьте першим, хто залишить коментар про цей товар!
                </p>
              ) : (
                <ul className="comments-list">
                  {[...productComments].reverse().map((c) => (
                    <li className="comment-item" key={c.id}>
                      <div className="comment-item__avatar">
                        <FaUserCircle />
                      </div>
                      <div className="comment-item__body">
                        <div className="comment-item__head">
                          <span className="comment-item__name">{c.name}</span>
                          <span className="comment-item__date">
                            {new Date(c.date).toLocaleDateString("uk-UA")}
                          </span>
                        </div>
                        <Rating value={c.rating} size="sm" />
                        <p className="comment-item__text">{c.text}</p>
                      </div>
                      <button
                        type="button"
                        className="comment-item__delete"
                        title="Видалити коментар"
                        onClick={() => deleteComment(product.id, c.id)}
                      >
                        <FaTrash />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <form className="comment-form" onSubmit={handleSubmitComment}>
                <h3>Залишити коментар</h3>
                <div className="comment-form__stars">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      type="button"
                      key={n}
                      className="comment-form__star"
                      onMouseEnter={() => setHoverRating(n)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setCommentRating(n)}
                      aria-label={`Оцінка ${n} з 5`}
                    >
                      {n <= (hoverRating || commentRating) ? <FaStar /> : <FaRegStar />}
                    </button>
                  ))}
                </div>
                <div className="form-row">
                  <div className="form-field">
                    <label>Ім'я</label>
                    <input
                      type="text"
                      placeholder="Ваше ім'я"
                      value={commentName}
                      onChange={(e) => setCommentName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-field">
                  <label>Коментар</label>
                  <textarea
                    rows={4}
                    placeholder="Поділіться враженням про товар..."
                    value={commentText}
                    onChange={(e) => {
                      setCommentText(e.target.value);
                      if (commentError) setCommentError("");
                    }}
                  />
                </div>
                {commentError && <p className="comment-form__error">{commentError}</p>}
                <button type="submit" className="btn btn--primary">
                  Надіслати коментар
                </button>
              </form>
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
