import { useState, useEffect } from 'react';

const DEFAULT_PRODUCT_IMAGE = "https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=500";

export default function ProductFormModal({ initialValues, onSubmit, onCancel, isSubmitting }) {
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

    // Backend `name`, `xp_cost`, `stock`, `imageUrl` talab qiladi
    const finalImage = formData.image.trim() ? formData.image.trim() : DEFAULT_PRODUCT_IMAGE;

    try {
      await onSubmit({
        ...formData,
        name: formData.title.trim(),
        title: formData.title.trim(),
        price: Number(formData.price),
        xp_cost: Number(formData.price),
        stock: Number(formData.stock || 0),
        image: finalImage,
        imageUrl: finalImage,
      });
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Xatolik yuz berdi");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-slate-800 dark:text-slate-100">
      
      {/* 📸 Rasm Live Preview (Kiritilayotgan rasmni jonli ko'rsatish) */}
      <div className="flex justify-center">
        <div className="relative w-full h-36 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center p-2">
          <img 
            src={formData.image.trim() ? formData.image : DEFAULT_PRODUCT_IMAGE} 
            alt="Preview" 
            className="w-full h-full object-contain"
            onError={(e) => {
              // Agar noto'g'ri link kiritilsa xatolik bermasligi uchun
              e.target.src = DEFAULT_PRODUCT_IMAGE;
            }}
          />
          <span className="absolute bottom-2 right-2 text-[10px] bg-slate-800/80 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
            Oldindan ko'rish
          </span>
        </div>
      </div>

      {/* Mahsulot nomi */}
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
        {/* Narxi (XP) */}
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

        {/* Ombor soni */}
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

      {/* Rasm URL */}
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

      {/* Tavsif */}
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

      {/* Tugmalar */}
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