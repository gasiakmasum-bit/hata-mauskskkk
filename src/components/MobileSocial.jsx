import { FaViber, FaTelegramPlane, FaWhatsapp, FaPhoneAlt } from "react-icons/fa";

export default function MobileSocial() {
  return (
    <div className="mobile-social">
      <a href="viber://chat?number=%2B380970775613" aria-label="Viber" className="mobile-social__btn mobile-social__btn--viber">
        <FaViber />
      </a>
      <a href="https://t.me/+380970775313" aria-label="Telegram" className="mobile-social__btn mobile-social__btn--telegram">
        <FaTelegramPlane />
      </a>
      <a href="https://wa.me/380970775613" aria-label="WhatsApp" className="mobile-social__btn mobile-social__btn--whatsapp">
        <FaWhatsapp />
      </a>
      <a href="tel:+380970775313" aria-label="Подзвонити" className="mobile-social__btn mobile-social__btn--phone">
        <FaPhoneAlt />
      </a>
    </div>
  );
}
