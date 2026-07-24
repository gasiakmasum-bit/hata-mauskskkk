import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";

export default function Login() {
  const { login } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const result = login({ email, password });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate("/cabinet");
  }

  return (
    <div className="container page auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Вхід в акаунт</h1>
        <div className="form-field">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@mail.com" />
        </div>
        <div className="form-field">
          <label>Пароль</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        {error && <span className="form-error">{error}</span>}
        <button className="btn btn--primary btn--block" type="submit">Увійти</button>
        <p className="auth-card__switch">
          Ще немає акаунту? <Link to="/register">Зареєструватись</Link>
        </p>
      </form>
    </div>
  );
}
