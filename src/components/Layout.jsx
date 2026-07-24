import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import MobileSocial from "./MobileSocial";

export default function Layout() {
  return (
    <div className="site">
      <Header />
      <main className="site-main">
        <Outlet />
      </main>
      <Footer />
      <MobileSocial />
    </div>
  );
}
