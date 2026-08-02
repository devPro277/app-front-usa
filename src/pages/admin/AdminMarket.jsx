import { useEffect, useState } from 'react';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from '../../services/adminApi';

const DEFAULT_PRODUCT_IMAGE = "https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=500";

// ========================================================
// 1. MAHSULOT QO'SHISH VA TAHRIRLASH FORMASI KOMPONENTI
// ========================================================
function ProductFormModal({ initialValues, onSubmit, onCancel, isSubmitting }) {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    stock: '',
    image: '',
    description: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialValues) {
      setFormData({
        title: initialValues.title || initialValues.name || '',
        price: initialValues.price ?? initialValues.cost ?? initialValues.xp_cost ?? '',
        stock: initialValues.stock ?? initialValues.quantity ?? '',
        image: initialValues.image || initialValues.imageUrl || '',
        description: initialValues.description || '',
      });
    }
  }, [initialValues]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError("Mahsulot nomini kiriting");
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setError("To'g'ri XP narxini kiriting");
      return;
    }

    const finalImage = formData.image.trim() ? formData.image.trim() : DEFAULT_PRODUCT_IMAGE;

    try {
      const payload = {
        title: formData.title.trim(),
        name: formData.title.trim(),
        price: Number(formData.price),
        cost: Number(formData.price),
        xp_cost: Number(formData.price),
        stock: Number(formData.stock || 0),
        quantity: Number(formData.stock || 0),
        description: formData.description.trim(),
        image: finalImage,
        imageUrl: finalImage,
      };

      await onSubmit(payload);
    } catch (err) {
      console.error("🟢 Form submit error:", err);
      setError(err?.response?.data?.message || err?.message || "Xatolik yuz berdi");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-slate-800 dark:text-slate-100">
      
      {/* 📸 Rasm Preview */}
      <div className="flex justify-center">
        <div className="relative h-36 w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center p-2">
          <img 
            src={formData.image.trim() ? formData.image.trim() : DEFAULT_PRODUCT_IMAGE} 
            alt="Preview" 
            className="h-full w-full object-contain"
            onError={(e) => {
              e.target.src = DEFAULT_PRODUCT_IMAGE;
            }}
          />
          <span className="absolute bottom-2 right-2 text-[10px] bg-slate-800/80 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
            Oldindan ko'rish
          </span>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-slate-300">
          Mahsulot nomi *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Masalan: UniSphere Stiker to'plami"
          className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-orange-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 dark:focus:border-orange-500"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-slate-300">
            Narxi (XP) *
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="150"
            className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2 font-mono text-sm text-slate-900 outline-none focus:border-orange-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 dark:focus:border-orange-500"
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-slate-300">
            Ombordagi soni (shtuk) *
          </label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="10"
            className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2 font-mono text-sm text-slate-900 outline-none focus:border-orange-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 dark:focus:border-orange-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-slate-300">
          Rasm havolasi (URL)
        </label>
        <input
          type="url"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="https://example.com/item.png"
          className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-orange-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 dark:focus:border-orange-500"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-slate-300">
          Tavsif (Qisqacha)
        </label>
        <textarea
          name="description"
          rows="2"
          value={formData.description}
          onChange={handleChange}
          placeholder="Mahsulot haqida qisqacha ma'lumot..."
          className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-sm text-slate-900 outline-none focus:border-orange-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 dark:focus:border-orange-500"
        />
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 dark:bg-red-950/80 dark:text-red-300 border dark:border-red-800">
          {error}
        </p>
      )}

      <div className="mt-2 flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-xl border border-gray-300 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          Bekor qilish
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 rounded-xl bg-orange-500 py-2.5 text-sm font-semibold text-white transition-opacity hover:bg-orange-600 disabled:opacity-60"
        >
          {isSubmitting ? 'Saqlanmoqda...' : initialValues ? 'Saqlash' : 'Qo\'shish'}
        </button>
      </div>
    </form>
  );
}

// ========================================================
// 2. ASOSIY ADMIN MARKET SAHIFASI
// ========================================================
export default function AdminMarket() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadProducts() {
    try {
      const data = await getProducts();
      // 🔒 XAVFSIZLIK: API'dan kelgan javob massiv bo'lsa o'zini, 
      // aks holda data.products yoki data.data massivini olamiz
      if (Array.isArray(data)) {
        setProducts(data);
      } else if (data && Array.isArray(data.products)) {
        setProducts(data.products);
      } else if (data && Array.isArray(data.data)) {
        setProducts(data.data);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Mahsulotlarni yuklashda xatolik:", err);
      setProducts([]);
    }  finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleAddProduct(values) {
    setIsSubmitting(true);
    try {
      if (addProduct) await addProduct(values);
      setIsAddModalOpen(false);
      await loadProducts();
    } catch (err) {
      console.error("Add Product Error:", err);
      const msg = err?.response?.data?.message || err?.message || "400 Bad Request";
      alert("Xatolik yuz berdi: " + msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdateProduct(values) {
    if (!editingProduct) return;
    setIsSubmitting(true);
    try {
      const pId = editingProduct.id || editingProduct._id;
      if (updateProduct) await updateProduct(pId, values);
      setEditingProduct(null);
      await loadProducts();
    } catch (err) {
      alert("Xatolik yuz berdi: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setIsSubmitting(true);
    try {
      const pId = deleteTarget.id || deleteTarget._id;
      if (deleteProduct) await deleteProduct(pId);
      setDeleteTarget(null);
      await loadProducts();
    } catch (err) {
      alert("Xatolik yuz berdi: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  }

  // 🔒 XAVFSIZ FILTER: products har doim massiv ekanligi kafolatlanadi
  const safeProductsList = Array.isArray(products) ? products : [];
  const filteredProducts = safeProductsList.filter((p) =>
    (p.title || p.name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">
            UniSphere Do'kon Ombori
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            O'quvchilar XP ballarga xarid qilishi mumkin bo'lgan sovg'alar va mahsulotlar nazorati
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600 shadow-lg shadow-orange-500/20"
        >
          <span>+</span> Yangi mahsulot
        </button>
      </div>

      <div className="mt-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Mahsulot nomi bo'yicha qidirish..."
          className="w-full max-w-md rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition-colors focus:border-orange-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-orange-500"
        />
      </div>

      {loading ? (
        <div className="mt-8 text-center text-sm text-slate-400">Yuklanmoqda...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
          Hozircha omborda mahsulotlar yo'q yoki topilmadi.
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((p) => {
            const pId = p.id || p._id;
            const stockCount = p.stock ?? p.quantity ?? 0;
            const isOutOfStock = stockCount <= 0;

            return (
              <div
                key={pId}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-slate-700/70 dark:bg-slate-800"
              >
                <div>
                  {/* 🖼️ Tuzatilgan rasm konteyneri */}
                  <div className="relative mb-3 flex h-44 w-full items-center justify-center overflow-hidden rounded-xl bg-slate-100 p-2 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                    {p.image || p.imageUrl ? (
                      <img
                        src={p.image || p.imageUrl}
                        alt={p.title || p.name}
                        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <span className="text-4xl">🎁</span>
                    )}

                    <span
                      className={`absolute right-2 top-2 rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold ${
                        isOutOfStock
                          ? 'bg-red-500 text-white'
                          : 'bg-slate-900/70 text-white backdrop-blur-md dark:bg-slate-800/80'
                      }`}
                    >
                      {isOutOfStock ? "Tugagan" : `${stockCount} ta bor`}
                    </span>
                  </div>

                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {p.title || p.name}
                  </h3>
                  {p.description && (
                    <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                      {p.description}
                    </p>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-700/60">
                  <span className="font-mono text-base font-bold text-orange-500 dark:text-orange-400">
                    {p.price ?? p.cost ?? p.xp_cost ?? 0} XP
                  </span>

                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setEditingProduct(p)}
                      className="rounded-lg bg-slate-100 p-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                      title="Tahrirlash"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => setDeleteTarget(p)}
                      className="rounded-lg bg-red-50 p-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-950/60"
                      title="O'chirish"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODALLAR */}
      <Modal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Omborga yangi mahsulot qo'shish"
      >
        <ProductFormModal
          onSubmit={handleAddProduct}
          onCancel={() => setIsAddModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>

      <Modal
        open={Boolean(editingProduct)}
        onClose={() => setEditingProduct(null)}
        title="Mahsulotni tahrirlash"
      >
        {editingProduct && (
          <ProductFormModal
            initialValues={editingProduct}
            onSubmit={handleUpdateProduct}
            onCancel={() => setEditingProduct(null)}
            isSubmitting={isSubmitting}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Mahsulotni o'chirish"
        message={`"${deleteTarget?.title || deleteTarget?.name}" mahsulotini ombordan o'chirib tashlamoqchimisiz?`}
        confirmLabel="Ha, o'chirish"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}