import { useSearchParams } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import ProductGrid from "../components/ProductGrid";
import Breadcrumbs from "../components/Breadcrumbs";

export default function SearchResults() {
  const { products } = useStore();
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") || "").toLowerCase().trim();

  const filtered = products.filter(
    (p) => p.title.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query)
  );

  return (
    <div className="container page">
      <Breadcrumbs items={[{ label: "Результати пошуку" }]} />
      <h1 className="page-title">Результати пошуку: "{searchParams.get("q") || ""}"</h1>
      <ProductGrid items={filtered} />
    </div>
  );
}
