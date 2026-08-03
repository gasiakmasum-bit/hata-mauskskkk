import { useSearchParams } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import ProductGrid from "../components/ProductGrid";
import Breadcrumbs from "../components/Breadcrumbs";

export default function SearchResults() {
  const { products } = useStore();
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") || "").toLowerCase().trim();

  const filtered = query
    ? products.filter((p) => {
        const title = String(p.title || "").toLowerCase();
        const brand = String(p.brand || "").toLowerCase();
        const category = String(p.category || "").toLowerCase();
        const code = String(p.code || "").toLowerCase();
        return (
          title.includes(query) ||
          brand.includes(query) ||
          category.includes(query) ||
          code.includes(query)
        );
      })
    : products;

  return (
    <div className="container page">
      <Breadcrumbs items={[{ label: "Результати пошуку" }]} />
      <h1 className="page-title">Результати пошуку: "{searchParams.get("q") || ""}"</h1>
      <ProductGrid items={filtered} />
    </div>
  );
}
