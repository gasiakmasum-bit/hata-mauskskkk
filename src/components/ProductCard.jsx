import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";
import ProductIcon from "./ProductIcon";
import Rating from "./Rating";
import { useStore } from "../context/StoreContext";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { favorites, toggleFavorite, addToCart } = useStore();
  const isFav = favorites.includes(Number(product.id));

  return (
    <div className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
      {product.discount && <span className="product-card__badge">{product.discount}</span>}
      <button
        className="product-card__fav"
        aria-label="Улюблене"
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(product.id);
        }}
      >
        {isFav ? <FaHeart /> : <FaRegHeart />}
      </button>

      <div className="product-card__media">
        {product.images?.[0] || product.image ? (
          <img
            src={product.images?.[0] || product.image}
            alt={product.title}
            className="product-card__photo"
          />
        ) : (
          <ProductIcon icon={product.icon} />
        )}
      </div>

      <div className="product-card__body">
        <span className="product-card__brand">{product.brand}</span>
        <h3 className="product-card__title">{product.title}</h3>
        <Rating value={product.rating} reviewsCount={product.reviewsCount} />

        <div className="product-card__prices">
          <span className="product-card__price">{product.price} ₴</span>
          {product.oldPrice && (
            <span className="product-card__old-price">{product.oldPrice} ₴</span>
          )}
        </div>

        <button
          className="btn btn--primary btn--block"
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product.id);
          }}
        >
          <FaShoppingCart /> У кошик
        </button>
      </div>
    </div>
  );
}
