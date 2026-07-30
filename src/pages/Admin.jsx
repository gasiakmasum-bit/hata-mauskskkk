import { useRef, useState } from "react";
import { useStore } from "../context/StoreContext";
import Breadcrumbs from "../components/Breadcrumbs";
import { CATALOG_CATEGORIES, BRAND_LIST } from "../data/products";

// Простий пароль для доступу до адмінки. Змініть на своє слово —
// це не супернадійний захист, але зупинить випадкових відвідувачів.
const ADMIN_PASSWORD = "khata2026";

const ICON_OPTIONS = [
  { value: "drill", label: "Дриль / шурупокрут" },
  { value: "hammerDrill", label: "Перфоратор" },
  { value: "generator", label: "Генератор" },
  { value: "trimmer", label: "Садова техніка" },
  { value: "", label: "Інше (стандартна іконка)" },
];

const EMPTY_FORM = {
  title: "",
  brand: "",
  categories: [],
  price: "",
  oldPrice: "",
  code: "",
  rating: "5",
  reviewsCount: "0",
  discount: "",
  status: "В наявності",
  icon: "",
  images: [],
  description: "",
  equipment: "",
};

const MAX_PHOTOS = 5;

// Повертає масив категорій товару незалежно від того, у старому він
// форматі (одне поле category) чи в новому (масив categories).
function getProductCategories(product) {
  if (product.categories && product.categories.length > 0) return product.categories;
  if (product.category) return [product.category];
  return [];
}

export default function Admin() {
  const {
    products,
    productsLoaded,
    addProduct,
    updateProduct,
    deleteProduct,
    seedProductsToFirestore,
  } = useStore();

  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem("khata_admin_authed") === "1"
  );
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");

  const [form, setForm] = useState(EMPTY_FORM);
  const [specs, setSpecs] = useState([{ key: "", value: "" }]);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Якщо editingId не порожній — форма працює в режимі редагування
  // вже існуючого товару (замість додавання нового).
  const [editingId, setEditingId] = useState(null);
  const formRef = useRef(null);

  async function handlePhotoChange(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const currentCount = form.images.length;
    const availableSlots = MAX_PHOTOS - currentCount;
    if (availableSlots <= 0) {
      setFormError(`Максимум ${MAX_PHOTOS} фото на один товар`);
      e.target.value = "";
      return;
    }

    const filesToProcess = files.slice(0, availableSlots);
    const invalidFile = filesToProcess.find((f) => !f.type.startsWith("image/"));
    if (invalidFile) {
      setFormError("Оберіть тільки файли зображень (jpg, png, webp тощо)");
      return;
    }

    setFormError("");
    setUploadingPhoto(true);
    try {
      const dataUrls = await Promise.all(
        filesToProcess.map((f) => compressImage(f, 700, 0.65))
      );
      setForm((prev) => ({ ...prev, images: [...prev.images, ...dataUrls] }));
      if (files.length > availableSlots) {
        setFormError(
          `Додано лише ${availableSlots} фото — досягнуто ліміту ${MAX_PHOTOS} на товар`
        );
      }
    } catch (error) {
      console.error("Не вдалося обробити фото:", error);
      setFormError("Не вдалося обробити одне з фото. Спробуйте ще раз.");
    } finally {
      setUploadingPhoto(false);
      e.target.value = "";
    }
  }

  function removePhoto(index) {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  }

  // Стискає й зменшує фото прямо в браузері (без завантаження на сервер),
  // щоб воно вміщалось у документ Firestore (ліміт ~1 МБ на товар).
  function compressImage(file, maxSize, quality) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Не вдалося прочитати файл"));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error("Не вдалося завантажити зображення"));
        img.onload = () => {
          let { width, height } = img;
          if (width > height && width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          } else if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", quality));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function handleLogin(e) {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      sessionStorage.setItem("khata_admin_authed", "1");
      setAuthed(true);
      setAuthError("");
    } else {
      setAuthError("Невірний пароль");
    }
  }

  function updateSpec(index, field, value) {
    setSpecs((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  function addSpecRow() {
    setSpecs((prev) => [...prev, { key: "", value: "" }]);
  }

  function removeSpecRow(index) {
    setSpecs((prev) => prev.filter((_, i) => i !== index));
  }

  function toggleCategory(cat) {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }));
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setSpecs([{ key: "", value: "" }]);
    setFormError("");
    setEditingId(null);
  }

  // Заповнює форму даними вже існуючого товару та перемикає її
  // в режим редагування.
  function startEdit(product) {
    setForm({
      title: product.title || "",
      brand: product.brand || "",
      categories: getProductCategories(product),
      price: product.price != null ? String(product.price) : "",
      oldPrice: product.oldPrice != null ? String(product.oldPrice) : "",
      code: product.code || "",
      rating: product.rating != null ? String(product.rating) : "5",
      reviewsCount: product.reviewsCount != null ? String(product.reviewsCount) : "0",
      discount: product.discount || "",
      status: product.status || "В наявності",
      icon: product.icon || "",
      images:
        product.images && product.images.length > 0
          ? product.images
          : product.image
          ? [product.image]
          : [],
      description: product.description || "",
      equipment: product.equipment || "",
    });

    const specEntries = Object.entries(product.specs || {});
    setSpecs(
      specEntries.length > 0
        ? specEntries.map(([key, value]) => ({ key, value }))
        : [{ key: "", value: "" }]
    );

    setFormError("");
    setEditingId(product.id);

    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");

    if (uploadingPhoto) return setFormError("Зачекайте, поки завантажиться фото");
    if (!form.title.trim()) return setFormError("Вкажіть назву товару");
    if (!form.brand.trim()) return setFormError("Вкажіть бренд");
    if (form.categories.length === 0) return setFormError("Оберіть хоча б одну категорію");
    const priceNum = Number(form.price);
    if (!priceNum || priceNum <= 0) return setFormError("Вкажіть коректну ціну");

    const specsObj = {};
    specs.forEach(({ key, value }) => {
      if (key.trim()) specsObj[key.trim()] = value.trim();
    });

    const payload = {
      title: form.title.trim(),
      brand: form.brand.trim(),
      categories: form.categories,
      // Перше з обраних категорій зберігаємо і в старому полі "category" —
      // для сумісності з рештою сайту та старими товарами.
      category: form.categories[0],
      price: priceNum,
      oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
      code: form.code.trim(),
      rating: Number(form.rating) || 5,
      reviewsCount: Number(form.reviewsCount) || 0,
      discount: form.discount.trim() || null,
      status: form.status,
      icon: form.icon,
      image: form.images[0] || null,
      images: form.images,
      specs: specsObj,
      description: form.description.trim(),
      equipment: form.equipment.trim(),
    };

    setSubmitting(true);
    const result = editingId
      ? await updateProduct(editingId, payload)
      : await addProduct(payload);
    setSubmitting(false);

    if (result.ok) {
      resetForm();
    }
  }

  async function handleDelete(id) {
    if (window.confirm("Видалити цей товар назавжди?")) {
      if (editingId === id) resetForm();
      await deleteProduct(id);
    }
  }

  async function handleSeed() {
    if (
      window.confirm(
        "Завантажити стартовий набір із 4 товарів у базу? Це варто робити лише один раз, на самому початку."
      )
    ) {
      await seedProductsToFirestore();
    }
  }

  if (!authed) {
    return (
      <div className="container page auth-page">
        <form className="auth-card" onSubmit={handleLogin}>
          <h1>Адмінка</h1>
          <div className="form-field">
            <label>Пароль</label>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Введіть пароль"
              autoFocus
            />
          </div>
          {authError && <span className="form-error">{authError}</span>}
          <button className="btn btn--primary btn--block" type="submit">
            Увійти
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="container page">
      <Breadcrumbs items={[{ label: "Адмінка" }]} />
      <h1 className="page-title">Керування товарами</h1>

      {productsLoaded && products.length === 0 && (
        <div className="form-field" style={{ marginBottom: 24 }}>
          <p>
            У базі поки немає жодного товару. Можете почати зі стартового набору
            (4 приклади) або одразу додати свій перший товар нижче.
          </p>
          <button className="btn btn--secondary" onClick={handleSeed} type="button">
            Завантажити стартовий набір товарів
          </button>
        </div>
      )}

      <form
        className="auth-card"
        style={{ maxWidth: 640 }}
        onSubmit={handleSubmit}
        ref={formRef}
      >
        <h2>{editingId ? `Редагування товару #${editingId}` : "Додати новий товар"}</h2>

        <div className="form-field">
          <label>Назва товару *</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Наприклад: Дриль-шурупокрут Sturmax CD18"
          />
        </div>

        <div className="form-field">
          <label>Фото товару (можна декілька, до {MAX_PHOTOS})</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoChange}
            disabled={uploadingPhoto || form.images.length >= MAX_PHOTOS}
          />
          {uploadingPhoto && <p style={{ marginTop: 6 }}>Обробка фото...</p>}
          {form.images.length > 0 && !uploadingPhoto && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 10 }}>
              {form.images.map((img, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <img
                    src={img}
                    alt={`Фото ${i + 1}`}
                    style={{
                      width: 90,
                      height: 90,
                      objectFit: "cover",
                      borderRadius: 8,
                      display: "block",
                      border: i === 0 ? "2px solid var(--orange)" : "none",
                    }}
                  />
                  {i === 0 && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: 2,
                        left: 2,
                        fontSize: 10,
                        background: "rgba(0,0,0,0.6)",
                        color: "#fff",
                        padding: "1px 4px",
                        borderRadius: 4,
                      }}
                    >
                      Головне
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    style={{
                      position: "absolute",
                      top: -6,
                      right: -6,
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      border: "none",
                      background: "#d33",
                      color: "#fff",
                      cursor: "pointer",
                      lineHeight: "20px",
                      padding: 0,
                    }}
                    aria-label="Видалити фото"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-field">
          <label>Бренд *</label>
          <input
            list="brand-list"
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
            placeholder="Sturmax, Vitals, Forte..."
          />
          <datalist id="brand-list">
            {BRAND_LIST.map((b) => (
              <option key={b} value={b} />
            ))}
          </datalist>
        </div>

        <div className="form-field">
          <label>Категорії * (можна обрати декілька)</label>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px 16px",
              padding: "10px 12px",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 8,
            }}
          >
            {CATALOG_CATEGORIES.map((cat) => (
              <label
                key={cat}
                style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 400 }}
              >
                <input
                  type="checkbox"
                  checked={form.categories.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                />
                {cat}
              </label>
            ))}
          </div>
          {form.categories.length > 0 && (
            <p style={{ marginTop: 6, opacity: 0.7, fontSize: 13 }}>
              Обрано: {form.categories.join(", ")}
            </p>
          )}
        </div>

        <div className="form-field">
          <label>Ціна (грн) *</label>
          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="2999"
          />
        </div>

        <div className="form-field">
          <label>Стара ціна (грн, необов'язково — для знижки)</label>
          <input
            type="number"
            value={form.oldPrice}
            onChange={(e) => setForm({ ...form, oldPrice: e.target.value })}
            placeholder="3999"
          />
        </div>

        <div className="form-field">
          <label>Напис знижки (необов'язково)</label>
          <input
            value={form.discount}
            onChange={(e) => setForm({ ...form, discount: e.target.value })}
            placeholder="-20%"
          />
        </div>

        <div className="form-field">
          <label>Артикул / код товару</label>
          <input
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            placeholder="123456"
          />
        </div>

        <div className="form-field">
          <label>Наявність</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="В наявності">В наявності</option>
            <option value="Немає в наявності">Немає в наявності</option>
          </select>
        </div>

        <div className="form-field">
          <label>Іконка товару</label>
          <select
            value={form.icon}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
          >
            {ICON_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label>Характеристики</label>
          {specs.map((spec, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input
                style={{ flex: 1 }}
                value={spec.key}
                onChange={(e) => updateSpec(i, "key", e.target.value)}
                placeholder="Напруга"
              />
              <input
                style={{ flex: 1 }}
                value={spec.value}
                onChange={(e) => updateSpec(i, "value", e.target.value)}
                placeholder="18 В"
              />
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => removeSpecRow(i)}
              >
                ✕
              </button>
            </div>
          ))}
          <button type="button" className="btn btn--secondary" onClick={addSpecRow}>
            + Додати характеристику
          </button>
        </div>

        <div className="form-field">
          <label>Опис товару</label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Короткий опис товару для покупців..."
          />
        </div>

        <div className="form-field">
          <label>Комплектація</label>
          <textarea
            rows={2}
            value={form.equipment}
            onChange={(e) => setForm({ ...form, equipment: e.target.value })}
            placeholder="Що входить у комплект..."
          />
        </div>

        {formError && <span className="form-error">{formError}</span>}

        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn--primary btn--block" type="submit" disabled={submitting}>
            {submitting ? "Зберігаємо..." : editingId ? "Зберегти зміни" : "Додати товар"}
          </button>
          {editingId && (
            <button
              className="btn btn--secondary"
              type="button"
              onClick={resetForm}
              disabled={submitting}
            >
              Скасувати
            </button>
          )}
        </div>
      </form>

      <h2 style={{ marginTop: 40 }}>
        Товари в базі {productsLoaded ? `(${products.length})` : ""}
      </h2>
      {!productsLoaded && <p>Завантаження...</p>}
      {productsLoaded && (
        <div style={{ marginTop: 16 }}>
          {products.map((p) => (
            <div
              key={p.firestoreId || p.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                padding: "10px 0",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                background: editingId === p.id ? "rgba(255,255,255,0.05)" : "transparent",
              }}
            >
              <span>
                #{p.id} — {p.title} ({p.price} ₴)
                <br />
                <span style={{ opacity: 0.6, fontSize: 13 }}>
                  {getProductCategories(p).join(", ") || "без категорії"}
                </span>
              </span>
              <span style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <button className="btn btn--secondary" type="button" onClick={() => startEdit(p)}>
                  Редагувати
                </button>
                <button
                  className="btn btn--secondary"
                  type="button"
                  onClick={() => handleDelete(p.id)}
                >
                  Видалити
                </button>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
