import { useStore } from "../context/StoreContext";
import ProductGrid from "../components/ProductGrid";
import Breadcrumbs from "../components/Breadcrumbs";

export default function Favorites() {
  const { favorites, products } = useStore();
  const favProducts = products.filter((p) => favorites.includes(Number(p.id)));

  return (
    <div className="container page">
      <Breadcrumbs items={[{ label: "Улюблені товари" }]} />
      <h1 className="page-title">Улюблені товари ❤</h1>
      <ProductGrid items={favProducts} emptyText="У вас поки немає улюблених товарів" />
    </div>
  );
}
