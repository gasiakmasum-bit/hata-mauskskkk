import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

export default function OrderSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state?.order;

  if (!order) return <Navigate to="/" replace />;

  return (
    <div className="container page order-success">
      <FaCheckCircle className="order-success__icon" />
      <h1>Дякуємо, {order.name}!</h1>
      <p>
        Ваше замовлення на суму <strong className="accent">{order.total} грн</strong> успішно оформлено.
      </p>
      <p className="order-success__meta">Доставка: {order.address}</p>
      <p className="order-success__meta">
        Наш менеджер зв'яжеться з вами за номером {order.phone} для підтвердження.
      </p>
      <button className="btn btn--primary btn--lg" onClick={() => navigate("/")}>
        Повернутись на головну
      </button>
    </div>
  );
}
