import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { FaSignOutAlt, FaUserEdit, FaClipboardList, FaCheckCircle } from "react-icons/fa";
import { useStore } from "../context/StoreContext";

export default function Cabinet() {
  const { currentUser, myOrders, logout, updateProfile } = useStore();
  const [name, setName] = useState(currentUser?.name || "");
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setPhone(currentUser.phone);
    }
  }, [currentUser]);

  if (!currentUser) return <Navigate to="/login" replace />;

  function handleSave(e) {
    e.preventDefault();
    if (name.trim().length < 2) return;
    updateProfile({ name: name.trim(), phone: phone.trim() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="container page">
      <div className="breadcrumbs">
        <span>Головна</span> <span className="breadcrumbs__sep">/</span> <span>Особистий кабінет</span>
      </div>

      <div className="split-layout">
        <aside className="cabinet-card">
          <div className="cabinet-card__banner" />
          <div className="cabinet-card__body">
            <div className="cabinet-avatar">{currentUser.name.trim().charAt(0).toUpperCase()}</div>
            <div className="cabinet-card__name">{currentUser.name}</div>
            <div className="cabinet-card__email">{currentUser.email}</div>
            <button className="btn btn--outline btn--block" onClick={logout}>
              <FaSignOutAlt /> Вийти з акаунту
            </button>
          </div>
        </aside>

        <main className="cabinet-main">
          <form className="panel" onSubmit={handleSave}>
            <h3><FaUserEdit /> Мої дані</h3>
            <div className="form-row">
              <div className="form-field">
                <label>Ім'я та прізвище</label>
                <input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="form-field">
                <label>Телефон</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>
            <div className="form-field">
              <label>Email</label>
              <input value={currentUser.email} disabled />
            </div>
            <div className="form-actions">
              <button className="btn btn--primary" type="submit">Зберегти зміни</button>
              {saved && (
                <span className="save-confirm">
                  <FaCheckCircle /> Збережено
                </span>
              )}
            </div>
          </form>

          <div className="panel">
            <h3><FaClipboardList /> Мої замовлення ({myOrders.length})</h3>
            {myOrders.length === 0 ? (
              <div className="empty-state empty-state--sm">
                <span className="empty-state__icon">📦</span>
                <p className="muted">У вас поки немає замовлень.</p>
                <Link to="/catalog" className="btn btn--primary">До каталогу</Link>
              </div>
            ) : (
              myOrders.map((order, i) => (
                <div className="order-card" key={i}>
                  <div className="order-card__head">
                    <span>{new Date(order.date).toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" })}</span>
                    <strong className="accent">{order.total} грн</strong>
                  </div>
                  <div className="order-card__items">
                    {order.items.map((it, j) => (
                      <div key={j}>{it.title} × {it.quantity}</div>
                    ))}
                  </div>
                  <div className="order-card__address">Доставка: {order.address}</div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
