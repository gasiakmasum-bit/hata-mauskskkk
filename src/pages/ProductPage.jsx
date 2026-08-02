import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import {
  FaHeart,
  FaRegHeart,
  FaShoppingCart,
  FaBolt,
  FaMinus,
  FaPlus,
  FaTruck,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaRegStar,
  FaTrash,
  FaUserCircle,
  FaTimes,
} from "react-icons/fa";
import { db } from "../services/firebase";
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
  const {
    products,
    productsLoaded,
    favorites,
    toggleFavorite,
    addToCart,
    comments,
    addComment,
    deleteComment,
    currentUser,
  } = useStore();

  // Товар з повного каталогу (з живого підпису onSnapshot, реактивний —
  // наприклад, миттєво покаже нові коментарі/зміни адміном).
  const productFromList = products.find((p) => p.id === Number(id));

  // Поки весь каталог ще вантажиться (особливо одразу після F5), окремо
  // й напряму тягнемо ОДИН потрібний товар — так картка показується
  // швидко, а не чекає, поки підвантажиться весь список товарів.
  const [directProduct, setDirectProduct] = useState(null);
  const [directLoading, setDirectLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setDirectProduct(null);
    setDirectLoading(true);
    getDoc(doc(db, "products", String(id)))
      .then((snap) => {
        if (!cancelled && snap.exists()) {
          setDirectProduct({ ...snap.data(), firestoreId: snap.id });
        }
      })
      .catch((error) => {
        console.error("Не вдалося швидко завантажити товар:", error);
      })
      .finally(() => {
        if (!cancelled) setDirectLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  // Пріоритет — живим даним з каталогу (щойно вони підвантажаться),
  // а до того часу показуємо те, що прийшло напряму.
  const product = productFromList || directProduct;
  const stillLoading = !product && !productsLoaded && directLoading;

  const [qty, setQty] = useState(1);
  const [activePhoto, setActivePhoto] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef(null);
  const touchDeltaX = useRef(0);

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  }

  function handleTouchMove(e) {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  }

  function handleTouchEnd() {
    if (!product?.images || product.images.length < 2) return;
    const SWIPE_THRESHOLD = 40;
    if (touchDeltaX.current > SWIPE_THRESHOLD) {
      setActivePhoto((i) => (i - 1 + product.images.length) % product.images.length);
    } else if (touchDeltaX.current < -SWIPE_THRESHOLD) {
      setActivePhoto((i) => (i + 1) % product.images.length);
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
  }

  function goToPrevPhoto() {
    if (!product?.images || product.images.length < 2) return;
    setActivePhoto((i) => (i - 1 + product.images.length) % product.images.length);
  }

  function goToNextPhoto() {
    if (!product?.images || product.images.length < 2) return;
    setActivePhoto((i) => (i + 1) % product.images.length);
  }

  useEffect(() => {
    setActivePhoto(0);
    setLightboxOpen(false);
  }, [id]);

  useEffect(() => {
    if (!lightboxOpen) return;
    function handleKeyDown(e) {
      if (e.key === "Escape") setLightboxOpen(false);
      else if (e.key === "ArrowLeft") goToPrevPhoto();
      else if (e.key === "ArrowRight") goToNextPhoto();
    }
    document.addEventListener("keydown", handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxOpen, product?.images?.length]);
  const [tab, setTab] = useState("description");
  const [commentName, setCommentName] = useState(currentUser?.name || "");
  const [commentText, setCommentText] = useState("");
  const [commentRating, setCommentRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [commentError, setCommentError] = useState("");

  if (!product) {
    if (stillLoading) {
      return (
        <div className="container page">
          <div className="product-page product-page--skeleton">
            <div className="skeleton skeleton--image" />
            <div className="product-page__info">
              <div className="skeleton skeleton--line skeleton--w40" />
              <div className="skeleton skeleton--line skeleton--w80" style={{ height: 32 }} />
              <div className="skeleton skeleton--line skeleton--w30" />
              <div className="skeleton skeleton--line skeleton--w60" style={{ height: 40, marginTop: 16 }} />
              <div className="skeleton skeleton--line skeleton--w100" style={{ height: 100 }} />
            </div>
          </div>
        </div>
      );
    }
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
          <div
            className="product-page__main-image"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {product.discount && <span className="product-card__badge">Акція</span>}
            {product.images?.length > 0 ? (
              <img
                src={product.images[activePhoto] || product.images[0]}
                alt={product.title}
                className="product-page__photo product-page__photo--zoomable"
                onClick={() => setLightboxOpen(true)}
              />
            ) : product.image ? (
              <img
                src={product.image}
                alt={product.title}
                className="product-page__photo product-page__photo--zoomable"
                onClick={() => setLightboxOpen(true)}
              />
            ) : (
              <ProductIcon icon={product.icon} className="product-icon--lg" />
            )}
            {product.images?.length > 1 && (
              <>
                <button
                  type="button"
                  className="product-page__nav-arrow product-page__nav-arrow--prev"
                  aria-label="Попереднє фото"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevPhoto();
                  }}
                >
                  <FaChevronLeft />
                </button>
                <button
                  type="button"
                  className="product-page__nav-arrow product-page__nav-arrow--next"
                  aria-label="Наступне фото"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNextPhoto();
                  }}
                >
                  <FaChevronRight />
                </button>
              </>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="product-page__thumbs">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  className={`product-page__thumb ${i === activePhoto ? "active" : ""}`}
                  onClick={() => setActivePhoto(i)}
                >
                  <img src={img} alt={`${product.title} ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
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
            <span className="product-page__warranty-row">
              <img
                src={`${import.meta.env.BASE_URL}img/garant-36.svg`}
                alt="Офіційна гарантія 36 місяців"
                title="Офіційна гарантія 36 місяців"
                className="product-page__warranty"
                loading="lazy"
              />
              Офіційна гарантія від виробника
            </span>
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

      {lightboxOpen && (product.images?.length > 0 || product.image) && (
        <div
          className="lightbox-overlay"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            className="lightbox__close"
            aria-label="Закрити"
            onClick={() => setLightboxOpen(false)}
          >
            <FaTimes />
          </button>

          <div
            className="lightbox"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {product.images?.length > 1 && (
              <button
                type="button"
                className="lightbox__arrow lightbox__arrow--prev"
                aria-label="Попереднє фото"
                onClick={goToPrevPhoto}
              >
                <FaChevronLeft />
              </button>
            )}

            <img
              src={(product.images?.[activePhoto]) || product.image}
              alt={product.title}
              className="lightbox__image"
            />

            {product.images?.length > 1 && (
              <button
                type="button"
                className="lightbox__arrow lightbox__arrow--next"
                aria-label="Наступне фото"
                onClick={goToNextPhoto}
              >
                <FaChevronRight />
              </button>
            )}
          </div>

          <div className="lightbox__footer" onClick={(e) => e.stopPropagation()}>
            <span className="lightbox__caption">{product.title}</span>
            {product.images?.length > 1 && (
              <span className="lightbox__counter">
                {activePhoto + 1} of {product.images.length}
              </span>
            )}
          </div>

          {product.images?.length > 1 && (
            <div className="lightbox__thumbs" onClick={(e) => e.stopPropagation()}>
              {product.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  className={`lightbox__thumb ${i === activePhoto ? "active" : ""}`}
                  onClick={() => setActivePhoto(i)}
                >
                  <img src={img} alt={`${product.title} ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
