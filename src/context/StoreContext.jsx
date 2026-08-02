import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import {
  collection,
  addDoc,
  setDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "../services/firebase";
import { seedProducts } from "../data/products";
import { sendOrderToTelegram } from "../services/telegram";
import { useToast } from "./ToastContext";

const StoreContext = createContext(null);

function readLS(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }) {
  const { showToast } = useToast();

  const [cart, setCart] = useState(() => readLS("khata_cart", []));
  const [favorites, setFavorites] = useState(() =>
    readLS("khata_favorites", []).map((id) => Number(id))
  );
  const [users, setUsers] = useState(() => readLS("khata_users", []));
  const [currentUser, setCurrentUser] = useState(() =>
    readLS("khata_current_user", null)
  );
  const [orders, setOrders] = useState(() => readLS("khata_orders", []));

  // Товари теж зберігаються у Firestore (колекція "products"), спільно для всіх.
  // Нові товари додаються через сторінку /admin — без редагування коду.
  const [products, setProducts] = useState([]);
  const [productsLoaded, setProductsLoaded] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("id", "asc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((docSnap) => ({
          ...docSnap.data(),
          firestoreId: docSnap.id,
        }));
        setProducts(list);
        setProductsLoaded(true);
      },
      (error) => {
        console.error("Помилка завантаження товарів з Firestore:", error);
        setProductsLoaded(true);
      }
    );
    return () => unsubscribe();
  }, []);

  // Коментарі до товарів зберігаються у Firestore (спільно для всіх користувачів),
  // а не в localStorage. Підписуємось на колекцію "comments" і слухаємо зміни в реальному часі.
  const [comments, setComments] = useState({});
  const [commentsLoaded, setCommentsLoaded] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "comments"), orderBy("date", "asc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const grouped = {};
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const productId = Number(data.productId);
          if (!grouped[productId]) grouped[productId] = [];
          grouped[productId].push({
            id: docSnap.id,
            name: data.name,
            text: data.text,
            rating: data.rating,
            date: data.date,
          });
        });
        setComments(grouped);
        setCommentsLoaded(true);
      },
      (error) => {
        console.error("Помилка завантаження коментарів з Firestore:", error);
        setCommentsLoaded(true);
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem("khata_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("khata_favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("khata_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("khata_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("khata_current_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("khata_current_user");
    }
  }, [currentUser]);

  const addToCart = useCallback(
    (productId, count = 1) => {
      const product = products.find((p) => p.id === productId);
      if (!product) return;
      setCart((prev) => {
        const existing = prev.find((item) => item.id === productId);
        if (existing) {
          return prev.map((item) =>
            item.id === productId
              ? { ...item, quantity: item.quantity + count }
              : item
          );
        }
        return [...prev, { ...product, quantity: count }];
      });
      showToast(`Товар додано в кошик (${count} шт.)`);
    },
    [products, showToast]
  );

  const removeFromCart = useCallback((productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const changeQuantity = useCallback(
    (productId, delta) => {
      setCart((prev) => {
        const item = prev.find((p) => p.id === productId);
        if (!item) return prev;
        const nextQty = item.quantity + delta;
        if (nextQty <= 0) {
          return prev.filter((p) => p.id !== productId);
        }
        return prev.map((p) =>
          p.id === productId ? { ...p, quantity: nextQty } : p
        );
      });
    },
    []
  );

  const clearCart = useCallback(() => setCart([]), []);

  const toggleFavorite = useCallback((productId) => {
    const id = Number(productId);
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }, []);

  const register = useCallback(
    ({ name, phone, email, password }) => {
      const cleanEmail = email.trim().toLowerCase();
      if (users.some((u) => u.email === cleanEmail)) {
        return { ok: false, error: "Користувач з такою поштою вже зареєстрований" };
      }
      const newUser = {
        name,
        phone,
        email: cleanEmail,
        password,
        registeredAt: new Date().toISOString(),
      };
      setUsers((prev) => [...prev, newUser]);
      const session = { name: newUser.name, phone: newUser.phone, email: newUser.email };
      setCurrentUser(session);
      showToast(`Ласкаво просимо, ${name.split(" ")[0]}!`);
      return { ok: true };
    },
    [users, showToast]
  );

  const login = useCallback(
    ({ email, password }) => {
      const cleanEmail = email.trim().toLowerCase();
      const user = users.find(
        (u) => u.email === cleanEmail && u.password === password
      );
      if (!user) {
        return { ok: false, error: "Невірна пошта або пароль" };
      }
      setCurrentUser({ name: user.name, phone: user.phone, email: user.email });
      showToast(`З поверненням, ${user.name.split(" ")[0]}!`);
      return { ok: true };
    },
    [users, showToast]
  );

  const logout = useCallback(() => {
    setCurrentUser(null);
    showToast("Ви вийшли з акаунту");
  }, [showToast]);

  const updateProfile = useCallback(
    ({ name, phone }) => {
      setCurrentUser((prev) => (prev ? { ...prev, name, phone } : prev));
      setUsers((prev) =>
        prev.map((u) =>
          currentUser && u.email === currentUser.email ? { ...u, name, phone } : u
        )
      );
    },
    [currentUser]
  );

  const submitOrder = useCallback(
    async ({ name, phone, email, delivery, address, payment, comment }) => {
      const order = {
        name,
        phone,
        email,
        delivery,
        address,
        payment,
        comment,
        items: cart,
        total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        date: new Date().toISOString(),
      };
      setOrders((prev) => [...prev, order]);

      // Фактична відправка в Telegram — не змінена
      sendOrderToTelegram(order);

      clearCart();
      return order;
    },
    [cart, clearCart]
  );

  const addComment = useCallback(
    async (productId, { name, text, rating }) => {
      const id = Number(productId);
      const newComment = {
        productId: id,
        name: (name || "Гість").trim(),
        text: text.trim(),
        rating: rating || 5,
        date: new Date().toISOString(),
      };
      try {
        await addDoc(collection(db, "comments"), newComment);
        showToast("Дякуємо! Ваш коментар додано.");
      } catch (error) {
        console.error("Не вдалося зберегти коментар у Firestore:", error);
        showToast("Не вдалося надіслати коментар. Спробуйте ще раз.");
      }
      return newComment;
    },
    [showToast]
  );

  const deleteComment = useCallback(
    async (productId, commentId) => {
      try {
        await deleteDoc(doc(db, "comments", String(commentId)));
      } catch (error) {
        console.error("Не вдалося видалити коментар у Firestore:", error);
        showToast("Не вдалося видалити коментар.");
      }
    },
    [showToast]
  );

  const addProduct = useCallback(
    async (productData) => {
      try {
        const nextId =
          products.length > 0 ? Math.max(...products.map((p) => Number(p.id) || 0)) + 1 : 1;
        const newProduct = { ...productData, id: nextId };
        await setDoc(doc(db, "products", String(nextId)), newProduct);
        showToast("Товар додано!");
        return { ok: true, product: newProduct };
      } catch (error) {
        console.error("Не вдалося зберегти товар у Firestore:", error);
        showToast("Не вдалося додати товар. Спробуйте ще раз.");
        return { ok: false };
      }
    },
    [products, showToast]
  );

  const updateProduct = useCallback(
    async (id, productData) => {
      const previous = products.find((p) => Number(p.id) === Number(id));
      try {
        await setDoc(doc(db, "products", String(id)), { ...productData, id: Number(id) });
        showToast("Товар оновлено!");
      } catch (error) {
        console.error("Не вдалося оновити товар у Firestore:", error);
        showToast("Не вдалося оновити товар.");
        return { ok: false };
      }
      // Якщо якісь фото були замінені/видалені під час редагування —
      // прибираємо старі файли у Storage, яких більше немає в новому списку.
      const oldImages = previous?.images?.length
        ? previous.images
        : previous?.image
        ? [previous.image]
        : [];
      const newImages = productData?.images?.length
        ? productData.images
        : productData?.image
        ? [productData.image]
        : [];
      oldImages
        .filter(
          (url) =>
            typeof url === "string" &&
            url.includes("firebasestorage") &&
            !newImages.includes(url)
        )
        .forEach((url) => {
          deleteObject(ref(storage, url)).catch(() => {});
        });
      return { ok: true };
    },
    [showToast, products]
  );

  const deleteProduct = useCallback(
    async (id) => {
      const target = products.find((p) => Number(p.id) === Number(id));
      try {
        await deleteDoc(doc(db, "products", String(id)));
        showToast("Товар видалено.");
      } catch (error) {
        console.error("Не вдалося видалити товар у Firestore:", error);
        showToast("Не вдалося видалити товар.");
        return;
      }
      // Прибираємо за собою фото товару у Storage (по-тихому, без
      // помилок для користувача — товар вже видалено).
      const imagesToClean = target?.images?.length
        ? target.images
        : target?.image
        ? [target.image]
        : [];
      imagesToClean
        .filter((url) => typeof url === "string" && url.includes("firebasestorage"))
        .forEach((url) => {
          deleteObject(ref(storage, url)).catch(() => {});
        });
    },
    [showToast, products]
  );

  // Одноразове "заселення" бази стартовим набором товарів (кнопка в адмінці).
  const seedProductsToFirestore = useCallback(async () => {
    try {
      for (const product of seedProducts) {
        await setDoc(doc(db, "products", String(product.id)), product);
      }
      showToast("Стартові товари завантажено в базу!");
      return { ok: true };
    } catch (error) {
      console.error("Не вдалося заселити товари у Firestore:", error);
      showToast("Не вдалося завантажити стартові товари.");
      return { ok: false };
    }
  }, [showToast]);

  const myOrders = useMemo(() => {
    if (!currentUser) return [];
    return orders
      .filter(
        (o) =>
          o.email?.toLowerCase() === currentUser.email.toLowerCase() ||
          o.phone?.replace(/\D/g, "").endsWith(currentUser.phone.replace(/\D/g, "").slice(-9))
      )
      .reverse();
  }, [orders, currentUser]);

  const cartTotalSum = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );
  const cartTotalCount = useMemo(
    () => cart.reduce((count, item) => count + item.quantity, 0),
    [cart]
  );

  const value = {
    cart,
    favorites,
    currentUser,
    myOrders,
    cartTotalSum,
    cartTotalCount,
    products,
    productsLoaded,
    addProduct,
    updateProduct,
    deleteProduct,
    seedProductsToFirestore,
    comments,
    commentsLoaded,
    addComment,
    deleteComment,
    addToCart,
    removeFromCart,
    changeQuantity,
    clearCart,
    toggleFavorite,
    register,
    login,
    logout,
    updateProfile,
    submitOrder,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
