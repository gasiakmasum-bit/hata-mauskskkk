import Hero from "../components/Hero";
import Features from "../components/Features";
import ProductGrid from "../components/ProductGrid";
import PromoBanners from "../components/PromoBanners";
import Brands from "../components/Brands";
import Testimonials from "../components/Testimonials";
import VisitUs from "../components/VisitUs";
import { useStore } from "../context/StoreContext";

export default function Home() {
  const { products } = useStore();
  return (
    <>
      <Hero />
      <Features />
      <section className="section">
        <div className="container">
          <h2 className="section__title">Популярні товари</h2>
          <ProductGrid items={products.slice(0, 8)} />
        </div>
      </section>
      <PromoBanners />
      <Brands />
      <Testimonials />
      <VisitUs />
    </>
  );
}
