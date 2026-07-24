import Breadcrumbs from "../components/Breadcrumbs";

export default function Delivery() {
  return (
    <div className="container page">
      <Breadcrumbs items={[{ label: "Доставка і оплата" }]} />
      <h1 className="page-title">Доставка і оплата</h1>
      <div className="lead-text">
        <h3>Доставка</h3>
        <p>
          Ми доставляємо товари по всій Україні через Нову Пошту (у відділення або кур'єром), а
          також можливий самовивіз з магазину.
        </p>
        <h3>Оплата</h3>
        <p>
          Оплата можлива готівкою при отриманні, карткою онлайн або за реквізитами для юридичних
          осіб.
        </p>
      </div>
    </div>
  );
}
