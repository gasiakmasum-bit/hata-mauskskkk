import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { searchCities, searchWarehouses } from "../services/novaPoshta";
import Breadcrumbs from "../components/Breadcrumbs";

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, cartTotalSum, cartTotalCount, submitOrder } = useStore();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [delivery, setDelivery] = useState("np");
  const [payment, setPayment] = useState("cash");
  const [comment, setComment] = useState("");

  const [cityQuery, setCityQuery] = useState("");
  const [cityRef, setCityRef] = useState(null);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);

  const [warehouseQuery, setWarehouseQuery] = useState("");
  const [warehouseRef, setWarehouseRef] = useState(null);
  const [warehouseSuggestions, setWarehouseSuggestions] = useState([]);
  const [showWarehouseSuggestions, setShowWarehouseSuggestions] = useState(false);

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const cityTimer = useRef(null);
  const warehouseTimer = useRef(null);

  useEffect(() => {
    if (cart.length === 0) navigate("/cart");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCityRef(null);
    setWarehouseQuery("");
    setWarehouseRef(null);
    clearTimeout(cityTimer.current);
    if (cityQuery.trim().length < 2) {
      setCitySuggestions([]);
      setShowCitySuggestions(false);
      return;
    }
    cityTimer.current = setTimeout(async () => {
      const results = await searchCities(cityQuery.trim());
      setCitySuggestions(results[0]?.Addresses || []);
      setShowCitySuggestions(true);
    }, 300);
    return () => clearTimeout(cityTimer.current);
  }, [cityQuery]);

  useEffect(() => {
    setWarehouseRef(null);
    clearTimeout(warehouseTimer.current);
    if (!cityRef) return;
    warehouseTimer.current = setTimeout(async () => {
      const results = await searchWarehouses(cityRef, warehouseQuery.trim());
      setWarehouseSuggestions(results || []);
      setShowWarehouseSuggestions(true);
    }, 300);
    return () => clearTimeout(warehouseTimer.current);
  }, [warehouseQuery, cityRef]);

  function pickCity(item) {
    setCityQuery(`${item.MainDescription}, ${item.Area}`);
    setCityRef(item.DeliveryCity);
    setShowCitySuggestions(false);
  }

  function pickWarehouse(w) {
    setWarehouseQuery(w.Description);
    setWarehouseRef(w.Ref);
    setShowWarehouseSuggestions(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = {};

    if (name.trim().length < 2) nextErrors.name = "Вкажіть ім'я (мін. 2 символи)";

    const phoneDigits = phone.replace(/\D/g, "");
    if (!/^(380\d{9}|0\d{9})$/.test(phoneDigits)) nextErrors.phone = "Введіть коректний номер телефону";

    if (email.trim() !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Введіть коректний email";
    }

    let deliveryAddress = "";
    if (delivery === "pickup") {
      deliveryAddress = "Самовивіз: м. Луцьк, вул. Ковельська, 123";
    } else {
      if (!cityRef || cityQuery.trim().length < 2) nextErrors.city = "Оберіть місто зі списку";
      if (delivery === "np") {
        if (!warehouseRef) nextErrors.warehouse = "Оберіть відділення зі списку";
        deliveryAddress = `${cityQuery}, ${warehouseQuery}`;
      } else {
        deliveryAddress = `Кур'єром у м. ${cityQuery}`;
      }
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    const order = await submitOrder({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      delivery,
      address: deliveryAddress,
      payment,
      comment: comment.trim(),
    });
    setSubmitting(false);
    navigate("/order-success", { state: { order } });
  }

  return (
    <div className="container page">
      <Breadcrumbs items={[{ label: "Кошик", to: "/cart" }, { label: "Оформлення замовлення" }]} />
      <h1 className="page-title">Оформлення замовлення</h1>

      <form className="split-layout" onSubmit={handleSubmit} noValidate>
        <div className="checkout-form">
          <div className="panel">
            <h3>Контактні дані</h3>
            <div className="form-row">
              <div className="form-field">
                <label>Ім'я та прізвище *</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ваше ім'я" />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>
              <div className="form-field">
                <label>Телефон *</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+380 XX XXX XX XX" />
                {errors.phone && <span className="form-error">{errors.phone}</span>}
              </div>
            </div>
            <div className="form-field">
              <label>Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@mail.com" />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>
          </div>

          <div className="panel">
            <h3>Доставка</h3>
            <div className="form-field">
              <label>Спосіб доставки</label>
              <select value={delivery} onChange={(e) => setDelivery(e.target.value)}>
                <option value="np">Нова Пошта (відділення)</option>
                <option value="np-courier">Нова Пошта (кур'єр)</option>
                <option value="pickup">Самовивіз зі магазину</option>
              </select>
            </div>

            {delivery !== "pickup" ? (
              <>
                <div className="form-field autocomplete-field">
                  <label>Місто *</label>
                  <input
                    value={cityQuery}
                    autoComplete="off"
                    placeholder="Почніть вводити назву міста"
                    onChange={(e) => setCityQuery(e.target.value)}
                    onFocus={() => citySuggestions.length && setShowCitySuggestions(true)}
                    onBlur={() => setTimeout(() => setShowCitySuggestions(false), 150)}
                  />
                  {showCitySuggestions && (
                    <div className="autocomplete-list">
                      {citySuggestions.length === 0 ? (
                        <div className="autocomplete-empty">Нічого не знайдено</div>
                      ) : (
                        citySuggestions.map((item, i) => (
                          <div key={i} className="autocomplete-item" onMouseDown={() => pickCity(item)}>
                            <strong>{item.MainDescription}</strong> <span>{item.Area}</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                  {errors.city && <span className="form-error">{errors.city}</span>}
                </div>

                {delivery === "np" && (
                  <div className="form-field autocomplete-field">
                    <label>Відділення *</label>
                    <input
                      value={warehouseQuery}
                      autoComplete="off"
                      disabled={!cityRef}
                      placeholder={cityRef ? "Почніть вводити номер або адресу відділення" : "Спочатку оберіть місто"}
                      onChange={(e) => setWarehouseQuery(e.target.value)}
                      onFocus={() => cityRef && setShowWarehouseSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowWarehouseSuggestions(false), 150)}
                    />
                    {showWarehouseSuggestions && (
                      <div className="autocomplete-list">
                        {warehouseSuggestions.length === 0 ? (
                          <div className="autocomplete-empty">Відділень не знайдено</div>
                        ) : (
                          warehouseSuggestions.map((w) => (
                            <div key={w.Ref} className="autocomplete-item" onMouseDown={() => pickWarehouse(w)}>
                              {w.Description}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                    {errors.warehouse && <span className="form-error">{errors.warehouse}</span>}
                  </div>
                )}
              </>
            ) : (
              <p className="pickup-note">
                📍 Забрати можна за адресою: <strong>м. Луцьк, вул. Ковельська, 123</strong>, Пн-Нд 08:00–20:00
              </p>
            )}
          </div>

          <div className="panel">
            <h3>Оплата</h3>
            <div className="radio-group">
              <label>
                <input type="radio" checked={payment === "cash"} onChange={() => setPayment("cash")} /> Готівкою при отриманні
              </label>
              <label>
                <input type="radio" checked={payment === "card"} onChange={() => setPayment("card")} /> Оплата карткою онлайн
              </label>
              <label>
                <input type="radio" checked={payment === "invoice"} onChange={() => setPayment("invoice")} /> Оплата на реквізити (ФОП)
              </label>
            </div>
          </div>

          <div className="panel">
            <label>Коментар до замовлення</label>
            <textarea rows="3" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Побажання щодо доставки чи товару" />
          </div>
        </div>

        <aside className="order-summary">
          <h3>Ваше замовлення</h3>
          <div className="order-summary__items">
            {cart.map((item) => (
              <div className="order-summary__row" key={item.id}>
                <span>{item.title} × {item.quantity}</span>
                <strong>{item.price * item.quantity} грн</strong>
              </div>
            ))}
          </div>
          <hr />
          <div className="order-summary__row">
            <span>Товари ({cartTotalCount} шт.)</span>
            <strong>{cartTotalSum} грн</strong>
          </div>
          <div className="order-summary__total">
            <span>Разом:</span>
            <strong>{cartTotalSum} грн</strong>
          </div>
          <button type="submit" className="btn btn--primary btn--block" disabled={submitting}>
            {submitting ? "Надсилаємо…" : "Підтвердити замовлення"}
          </button>
          <Link to="/cart" className="btn btn--outline btn--block">← До кошика</Link>
        </aside>
      </form>
    </div>
  );
}
