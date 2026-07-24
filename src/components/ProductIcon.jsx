import { FaBolt, FaHammer, FaGasPump, FaLeaf, FaTools } from "react-icons/fa";

const ICONS = {
  drill: FaBolt,
  hammerDrill: FaHammer,
  generator: FaGasPump,
  trimmer: FaLeaf,
};

export default function ProductIcon({ icon, className = "" }) {
  const Icon = ICONS[icon] || FaTools;
  return (
    <div className={`product-icon ${className}`}>
      <Icon />
    </div>
  );
}
