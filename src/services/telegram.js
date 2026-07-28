// =============================================================
// ВІДПРАВКА ЗАМОВЛЕННЯ В TELEGRAM
// Логіка, токен бота та chat_id перенесені без змін з оригінального script.js
// =============================================================

const TG_BOT_TOKEN = "8662647765:AAHqsnE0bmEhZTfI8kNrVj1CtoLF-35Vu4I";
const TG_CHAT_IDS = ["1581533094", "847811361"];

const DELIVERY_LABELS = {
  np: "Нова Пошта (відділення)",
  "np-courier": "Нова Пошта (кур'єр)",
  pickup: "Самовивіз",
};

const PAYMENT_LABELS = {
  cash: "Готівкою при отриманні",
  card: "Карткою онлайн",
  invoice: "На реквізити (ФОП)",
};

export async function sendOrderToTelegram(order) {
  const itemsText = order.items
    .map(
      (item) =>
        `• ${item.title} (Код товару: ${item.code || "—"}) — ${item.quantity} шт. × ${item.price} грн = ${
          item.price * item.quantity
        } грн`
    )
    .join("\n");

  const message = `🆕 НОВЕ ЗАМОВЛЕННЯ

👤 Ім'я: ${order.name}
📞 Телефон: ${order.phone}
✉ Email: ${order.email || "—"}

🚚 Доставка: ${DELIVERY_LABELS[order.delivery] || order.delivery}
📍 Адреса: ${order.address}
💳 Оплата: ${PAYMENT_LABELS[order.payment] || order.payment}

🛒 Товари:
${itemsText}

💰 Разом: ${order.total} грн

💬 Коментар: ${order.comment || "—"}
🕒 ${new Date(order.date).toLocaleString("uk-UA")}`;

  await Promise.all(
    TG_CHAT_IDS.map(async (chatId) => {
      try {
        const response = await fetch(
          `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text: message,
            }),
          }
        );
        const data = await response.json();
        if (!data.ok) {
          console.error(`Telegram API помилка (chat_id: ${chatId}):`, data);
        }
      } catch (err) {
        console.error(`Помилка відправки в Telegram (chat_id: ${chatId}):`, err);
      }
    })
  );
}
