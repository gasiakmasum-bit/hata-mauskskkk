import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";

export default function Register() {
  const { register } = useStore();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (name.trim().length < 2) return setError("Вкажіть ім'я (мін. 2 символи)");
    const phoneDigits = phone.replace(/\D/g, "");
    if (!/^(380\d{9}|0\d{9})$/.test(phoneDigits)) return setError("Введіть коректний номер телефону");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError("Введіть коректний email");
    if (password.length < 6) return setError("Пароль має містити мінімум 6 символів");

    const result = register({ name: name.trim(), phone: phone.trim(), email, password });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate("/cabinet");
  }

  return (
    <div className="container page auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Реєстрація</h1>
        <div className="form-field">
          <label>Ім'я та прізвище *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ваше ім'я" />
        </div>
        <div className="form-field">
          <label>Телефон *</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+380 XX XXX XX XX" />
        </div>
        <div className="form-field">
          <label>Email *</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@mail.com" />
        </div>
        <div className="form-field">
          <label>Пароль * (мін. 6 символів)</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        {error && <span className="form-error">{error}</span>}
        <button className="btn btn--primary btn--block" type="submit">Зареєструватись</button>
        <p className="auth-card__switch">
          Вже маєте акаунт? <Link to="/login">Увійти</Link>
        </p>
      </form>
    </div>
  );
}
