import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

export default function Rating({ value = 0, reviewsCount, size = "sm" }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < full) stars.push(<FaStar key={i} />);
    else if (i === full && half) stars.push(<FaStarHalfAlt key={i} />);
    else stars.push(<FaRegStar key={i} />);
  }
  return (
    <div className={`rating rating--${size}`}>
      <span className="rating__stars">{stars}</span>
      {reviewsCount !== undefined && (
        <span className="rating__count">({reviewsCount})</span>
      )}
    </div>
  );
}
