import { FaStar } from "react-icons/fa";

const TESTIMONIALS = [
  {
    text: "Замовляв бензогенератор Forte напередодні відключень світла. Приїхав швидко, менеджер сам передзвонив і уточнив, чи вистачить потужності під холодильник і котел. Все працює другий місяць без нарікань.",
    name: "Олександр",
    city: "Самбір",
    rating: 5,
    date: "лютий 2026",
  },
  {
    text: "Брала перфоратор Sturmax для ремонту у ванній. Спочатку хвилювалась, чи потягне бетонну стіну, але хлопці в магазині все пояснили і не впарювали дорожчу модель. Працює чудово, звук не такий гучний, як думала.",
    name: "Ірина",
    city: "Львів",
    rating: 5,
    date: "січень 2026",
  },
  {
    text: "Замовляв шуруповерт Vitals онлайн. Відправили того ж дня Новою поштою, отримав за добу. Акумулятор тримає заряд довше, ніж очікував за такі гроші. Раджу.",
    name: "Михайло",
    city: "Дрогобич",
    rating: 5,
    date: "березень 2026",
  },
  {
    text: "Купували з чоловіком бензопилу Rebiner для дачі. Один раз довелось звертатись з питанням по гарантії — обміняли без зайвих питань за 3 дні. Приємно, коли сервіс не для галочки.",
    name: "Наталія",
    city: "Стрий",
    rating: 4,
    date: "квітень 2026",
  },
  {
    text: "Великий вибір ручного інструменту, ціни адекватні для нашого регіону. Консультант допоміг підібрати набір торцевих головок під конкретне авто, не було такого, щоб \"беріть, що є\".",
    name: "Роман",
    city: "Трускавець",
    rating: 5,
    date: "грудень 2025",
  },
  {
    text: "Зварювальний апарат Werk брав з доставкою по передоплаті — трохи хвилювався, чи все буде чесно. Приїхав вчасно, в цілій упаковці, продавець ще й відео інструкцію скинув у Вайбер.",
    name: "Богдан",
    city: "Червоноград",
    rating: 5,
    date: "лютий 2026",
  },
];

export default function Testimonials() {
  return (
    <section className="testimonials-section">
      <div className="container testimonials-section__head">
        <h2 className="section__title">Відгуки наших клієнтів</h2>
        <p className="testimonials-section__subtitle">Нам довіряють по всій Україні</p>
      </div>
      <div className="container testimonials-grid">
        {TESTIMONIALS.map((t) => (
          <div className="testimonial-card" key={t.name + t.city}>
            <div className="testimonial-card__stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <FaStar key={i} className={i < t.rating ? "" : "testimonial-card__star--off"} />
              ))}
            </div>
            <p className="testimonial-card__text">"{t.text}"</p>
            <div className="testimonial-card__author">
              <strong>{t.name}</strong>
              <span>{t.city} · {t.date}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
