import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import ProductGrid from "../components/ProductGrid";
import { CATALOG_CATEGORIES, CATALOG_BRANDS } from "../data/products";
import { useStore } from "../context/StoreContext";

const MAX_PRICE = 25000;

export default function Catalog() {
  const { products } = useStore();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "";

  const [category, setCategory] = useState(initialCategory);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [brands, setBrands] = useState([]);
  const [sort, setSort] = useState("popular");

  function toggleBrand(brand) {
    setBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  }

  function resetFilters() {
    setCategory("");
    setMinPrice(0);
    setMaxPrice(MAX_PRICE);
    setBrands([]);
    setSort("popular");
  }

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const matchPrice = p.price >= minPrice && p.price <= maxPrice;
      const matchBrand = brands.length === 0 || brands.includes(p.brand);
      const matchCategory = !category || p.category === category;
      return matchPrice && matchBrand && matchCategory;
    });

    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    else list = [...list].sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));

    return list;
  }, [products, category, minPrice, maxPrice, brands, sort]);

  return (
    <div className="container page">
      <Breadcrumbs items={[{ label: "Каталог" }]} />

      <div className="catalog-layout">
        <aside className="catalog-sidebar">
          <h3 className="catalog-sidebar__title">Категорії</h3>
          <ul className="catalog-categories">
            <li>
              <button
                className={category === "" ? "active" : ""}
                onClick={() => setCategory("")}
              >
                Всі товари
              </button>
            </li>
            {CATALOG_CATEGORIES.map((cat) => (
              <li key={cat}>
                <button
                  className={category === cat ? "active" : ""}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>

          <hr />

          <h3 className="catalog-sidebar__title">Фільтр</h3>
          <div className="filter-block">
            <label>Ціна, грн</label>
            <input
              type="range"
              min="0"
              max={MAX_PRICE}
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
            <div className="filter-block__range-inputs">
              <span>від</span>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value) || 0)}
              />
              <span>до</span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value) || MAX_PRICE)}
              />
            </div>
          </div>

          <hr />

          <h3 className="catalog-sidebar__title">Бренд</h3>
          <div className="filter-block filter-block--checkboxes">
            {CATALOG_BRANDS.map((brand) => (
              <label key={brand}>
                <input
                  type="checkbox"
                  checked={brands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                />
                {brand}
              </label>
            ))}
          </div>

          <button className="btn btn--outline btn--block" onClick={resetFilters}>
            Скинути фільтри
          </button>
        </aside>

        <main className="catalog-main">
          <div className="catalog-main__head">
            <h1>{category || "Всі товари"}</h1>
            <div className="sort-select">
              <span>Сортування:</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="popular">Популярні</option>
                <option value="price-asc">Від дешевих до дорогих</option>
                <option value="price-desc">Від дорогих до дешевих</option>
              </select>
            </div>
          </div>

          <ProductGrid items={filtered} emptyText="Товарів за вибраними фільтрами не знайдено" />
        </main>
      </div>
    </div>
  );
}
