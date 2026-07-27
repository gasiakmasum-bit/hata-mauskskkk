import { Link, useNavigate } from "react-router-dom";
import { FaMinus, FaPlus, FaTimes } from "react-icons/fa";
import { useStore } from "../context/StoreContext";
import ProductIcon from "../components/ProductIcon";
import Breadcrumbs from "../components/Breadcrumbs";

export default function Cart() {
  const navigate = useNavigate();
  const { cart, changeQuantity, removeFromCart, cartTotalSum, cartTotalCount } = useStore();

  return (
    <div className="container page">
      <Breadcrumbs items={[{ label: "Кошик" }]} />
      <h1 className="page-title">
        Ваш кошик <span className="accent">({cartTotalCount})</span>
      </h1>

      {cart.length === 0 ? (
        <div className="empty-state empty-state--panel">
          <span className="empty-state__icon">🛒</span>
          <h2>Ваш кошик порожній</h2>
          <p>Ви ще не додали жодного товару до кошика.</p>
          <button className="btn btn--primary" onClick={() => navigate("/catalog")}>
            Перейти до покупок
          </button>
        </div>
      ) : (
        <div className="split-layout">
          <div className="cart-list">
            {cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="cart-item__info">
                  <div className="cart-item__thumb">
                    {item.images?.[0] || item.image ? (
                      <img
                        src={item.images?.[0] || item.image}
                        alt={item.title}
                        className="cart-item__photo"
                      />
                    ) : (
                      <ProductIcon icon={item.icon} />
                    )}
                  </div>
                  <div>
                    <h4>{item.title}</h4>
                    <div className="cart-item__unit-price">
                      Ціна: <strong>{item.price} грн</strong>
                    </div>
                  </div>
                </div>

                <div className="cart-item__actions">
                  <div className="qty-control">
                    <button onClick={() => changeQuantity(item.id, -1)}><FaMinus /></button>
                    <span>{item.quantity}</span>
                    <button onClick={() => changeQuantity(item.id, 1)}><FaPlus /></button>
                  </div>
                  <div className="cart-item__total">{item.price * item.quantity} грн</div>
                  <button
                    className="icon-remove"
                    aria-label="Видалити"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <aside className="order-summary">
            <h3>Сума замовлення</h3>
            <div className="order-summary__row">
              <span>Товари ({cartTotalCount} шт.)</span>
              <strong>{cartTotalSum} грн</strong>
            </div>
            <div className="order-summary__row">
              <span>Доставка</span>
              <span className="text-success">за тарифами перевізника</span>
            </div>
            <hr />
            <div className="order-summary__total">
              <span>Разом до сплати:</span>
              <strong>{cartTotalSum} грн</strong>
            </div>
            <button className="btn btn--primary btn--block" onClick={() => navigate("/checkout")}>
              Оформити замовлення
            </button>
            <Link to="/catalog" className="btn btn--outline btn--block">
              Продовжити покупки
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
