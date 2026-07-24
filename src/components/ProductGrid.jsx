import ProductCard from "./ProductCard";

export default function ProductGrid({ items, emptyText = "Товарів не знайдено" }) {
  if (!items || items.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-state__icon">🔍</span>
        <p>{emptyText}</p>
      </div>
    );
  }
  return (
    <div className="products-grid">
      {items.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
