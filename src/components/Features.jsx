import { FaTruck, FaShieldAlt, FaCreditCard, FaHeadset } from "react-icons/fa";

const FEATURES = [
  { icon: FaTruck, title: "Швидка доставка", text: "по всій Україні" },
  { icon: FaShieldAlt, title: "Офіційна гарантія", text: "від виробника" },
  { icon: FaCreditCard, title: "Зручна оплата", text: "готівкою та карткою" },
  { icon: FaHeadset, title: "Професійна", text: "консультація" },
];

export default function Features() {
  return (
    <div className="features-bar">
      <div className="container features-bar__grid">
        {FEATURES.map(({ icon: Icon, title, text }) => (
          <div className="feature-item" key={title}>
            <span className="feature-item__icon"><Icon /></span>
            <div>
              <h4>{title}</h4>
              <p>{text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
