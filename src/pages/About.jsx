import Breadcrumbs from "../components/Breadcrumbs";

const STATS = [
  { value: "9+", label: "років на ринку" },
  { value: "10 000+", label: "товарів у каталозі" },
  { value: "50 000+", label: "задоволених клієнтів" },
  { value: "100%", label: "гарантія якості" },
];

export default function About() {
  return (
    <div className="container page">
      <Breadcrumbs items={[{ label: "Про компанію" }]} />
      <h1 className="page-title">Про компанію</h1>
      <p className="lead-text">
        <strong>Хата Майстра</strong> — це надійний магазин інструментів та будівельного
        обладнання. Ми працюємо з перевіреними виробниками та гарантуємо якість кожного товару.
      </p>
      <div className="stats-row">
        {STATS.map((s) => (
          <div className="stat-item" key={s.label}>
            <div className="stat-item__value">{s.value}</div>
            <div className="stat-item__label">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
