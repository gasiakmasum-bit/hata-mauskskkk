import { useState } from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from "react-icons/fa";
import Breadcrumbs from "../components/Breadcrumbs";
import { useToast } from "../context/ToastContext";

export default function Contacts() {
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const phoneDigits = phone.replace(/\D/g, "");
    const phoneValid = /^(380\d{9}|0\d{9})$/.test(phoneDigits);

    if (name.trim().length < 2 || !phoneValid) {
      setError(true);
      return;
    }
    setError(false);
    showToast("Дякуємо! Ваше повідомлення надіслано.");
    setName("");
    setPhone("");
    setMessage("");
  }

  return (
    <div className="container page">
      <Breadcrumbs items={[{ label: "Контакти" }]} />
      <h1 className="page-title">Контакти</h1>

      <div className="split-layout">
        <div className="contacts-info">
          <p><FaMapMarkerAlt /> вулиця Степана Бандери, 26, Самбір, Львівська область, 81400</p>
          <p><FaPhoneAlt /> <a href="tel:0961234567">+38 (096) 123 45 67</a></p>
          <p><FaPhoneAlt /> <a href="tel:0661234567">+38 (066) 123 45 67</a></p>
          <p><FaEnvelope /> <a href="mailto:info@hatamaystra.com.ua">info@hatamaystra.com.ua</a></p>
          <p><FaClock /> Пн-Нд 08:00 – 20:00</p>
        </div>

        <form className="panel contact-form" onSubmit={handleSubmit}>
          <h3>Напишіть нам</h3>
          <input placeholder="Ваше ім'я" value={name} onChange={(e) => setName(e.target.value)} />
          <input placeholder="Ваш телефон" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <textarea rows="4" placeholder="Ваше повідомлення" value={message} onChange={(e) => setMessage(e.target.value)} />
          {error && <span className="form-error">Заповніть ім'я та телефон коректно</span>}
          <button className="btn btn--primary" type="submit">Надіслати</button>
        </form>
      </div>
    </div>
  );
}
