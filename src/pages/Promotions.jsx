import { products } from "../data/products";
import ProductGrid from "../components/ProductGrid";
import Breadcrumbs from "../components/Breadcrumbs";

export default function Promotions() {
  const discounted = products.filter((p) => p.discount);
  return (
    <div className="container page">
      <Breadcrumbs items={[{ label: "Акції" }]} />
      <h1 className="page-title">Акції</h1>
      <ProductGrid items={discounted} />
    </div>
  );
}
