import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import API from '../api';

const Market = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Qo'shish formasi state'lari
  const [name, setName] = useState('');
  const [xpCost, setXpCost] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Edit (Tahrirlash) state'lari
  const [editingProduct, setEditingProduct] = useState(null);
  const [editName, setEditName] = useState('');
  const [editXpCost, setEditXpCost] = useState('');
  const [editStock, setEditStock] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');

  // 1. Mahsulotlarni olish
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get('/products');
      const list = res.data?.data || (Array.isArray(res.data) ? res.data : []);
      setProducts(list);
    } catch (error) {
      console.error("Mahsulotlarni yuklashda xatolik:", error);
      toast.error("Mahsulotlar ro'yxatini olib bo'lmadi!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. Yangi mahsulot qo'shish
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!name.trim() || !xpCost || stock === '' || !imageUrl.trim()) {
      return toast.error("Iltimos, barcha maydonlarni to'ldiring!");
    }

    try {
      setSubmitting(true);
      const payload = {
        name: name.trim(),
        xp_cost: Number(xpCost),
        stock: Number(stock),
        imageUrl: imageUrl.trim(),
      };

      const res = await API.post('/products', payload);
      const newProd = res.data?.data || res.data;

      setProducts((prev) => [newProd, ...prev]);

      // Formani tozalash
      setName('');
      setXpCost('');
      setStock('');
      setImageUrl('');
      toast.success("Mahsulot muvaffaqiyatli qo'shildi!");
    } catch (error) {
      console.error("Mahsulot qo'shishda xatolik:", error);
      toast.error(error.response?.data?.message || "Xatolik yuz berdi!");
    } finally {
      setSubmitting(false);
    }
  };

  // 3. Edit modalni ochish
  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setEditName(product.name || '');
    setEditXpCost(product.xp_cost ?? product.xpCost ?? '');
    setEditStock(product.stock ?? 0);
    setEditImageUrl(product.imageUrl || '');
  };

  // 4. Tahrirlangan ma'lumotlarni saqlash (PUT)
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    const productId = editingProduct._id || editingProduct.id;

    try {
      setSubmitting(true);
      const payload = {
        name: editName.trim(),
        xp_cost: Number(editXpCost),
        stock: Number(editStock),
        imageUrl: editImageUrl.trim(),
      };

      const res = await API.put(`/products/${productId}`, payload);
      const updated = res.data?.data || res.data;

      setProducts((prev) =>
        prev.map((p) => ((p._id || p.id) === productId ? { ...p, ...updated } : p))
      );

      setEditingProduct(null);
      toast.success("Mahsulot muvaffaqiyatli yangilandi!");
    } catch (error) {
      console.error("Yangilashda xatolik:", error);
      toast.error(error.response?.data?.message || "Xatolik yuz berdi!");
    } finally {
      setSubmitting(false);
    }
  };

  // 5. Mahsulotni o'chirish
  const handleDelete = async (id) => {
    if (!window.confirm("Ushbu mahsulotni o'chirmoqchimisiz?")) return;

    try {
      await API.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => (p._id || p.id) !== id));
      toast.success("Mahsulot muvaffaqiyatli o'chirildi!");
    } catch (error) {
      console.error("O'chirishda xatolik:", error);
      toast.error("Mahsulotni o'chirishda xatolik yuz berdi!");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#1B365D] p-6 max-w-7xl mx-auto space-y-10 relative">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#FFFFFF',
            color: '#1B365D',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
            fontWeight: '600',
            fontSize: '14px',
            boxShadow: '0 10px 15px -3px rgba(27, 54, 93, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#F97316',
              secondary: '#FFFFFF',
            },
          },
        }}
      />

      {/* Header */}
      <div className="border-b border-gray-100 pb-5 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1B365D] tracking-tight">
            Market Boshqaruvi
          </h1>
          <p className="text-sm text-[#1B365D]/70 mt-1 font-medium">
            O'quvchilar uchun XP sovg'alarini va omborni boshqarish paneli
          </p>
        </div>
      </div>

      {/* YANGI MAHSULOT QO'SHISH FORMASI */}
      <form
        onSubmit={handleAddProduct}
        className="bg-[#FFFFFF] border border-gray-200/80 p-6 rounded-2xl flex flex-col gap-5 shadow-sm"
      >
        <h2 className="text-base font-bold text-[#1B365D] flex items-center gap-2">
          <span>✨</span> Yangi mahsulot qo'shish
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Mahsulot nomi (masalan: UniSphere Futbolkasi)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-200 bg-gray-50/50 p-3 rounded-xl text-[#1B365D] placeholder:text-gray-400 focus:outline-none focus:border-[#1B365D] focus:bg-[#FFFFFF] transition-all text-sm"
          />
          <input
            type="number"
            placeholder="XP Narxi (masalan: 500)"
            value={xpCost}
            onChange={(e) => setXpCost(e.target.value)}
            className="border border-gray-200 bg-gray-50/50 p-3 rounded-xl text-[#1B365D] placeholder:text-gray-400 focus:outline-none focus:border-[#1B365D] focus:bg-[#FFFFFF] transition-all text-sm"
          />
          <input
            type="number"
            placeholder="Soni (Stock)"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="border border-gray-200 bg-gray-50/50 p-3 rounded-xl text-[#1B365D] placeholder:text-gray-400 focus:outline-none focus:border-[#1B365D] focus:bg-[#FFFFFF] transition-all text-sm"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Rasm manzili (URL: https://...)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="border border-gray-200 bg-gray-50/50 p-3 rounded-xl text-[#1B365D] placeholder:text-gray-400 focus:outline-none focus:border-[#1B365D] focus:bg-[#FFFFFF] transition-all w-full text-sm pr-12"
            />
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Preview"
                className="absolute right-2 top-2 w-8 h-8 rounded-lg object-cover border"
                onError={(e) => (e.target.style.display = 'none')}
              />
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto bg-[#F97316] hover:bg-[#ea580c] disabled:opacity-50 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-md active:scale-95 whitespace-nowrap text-sm flex items-center justify-center gap-2"
          >
            {submitting ? 'Saqlanmoqda...' : "+ Qo'shish"}
          </button>
        </div>
      </form>

      {/* MAHSULOTLAR RO'YXATI */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <p className="text-[#1B365D]/60 animate-pulse text-sm font-medium">
            Mahsulotlar yuklanmoqda...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length > 0 ? (
            products.map((item, index) => {
              const productId = item._id || item.id || index;
              const cost = item.xp_cost ?? item.xpCost ?? 0;

              return (
                <div
                  key={productId}
                  className="bg-[#FFFFFF] border border-gray-200/80 rounded-2xl overflow-hidden hover:border-[#1B365D]/30 transition-all duration-200 flex flex-col justify-between group shadow-sm hover:shadow-md"
                >
                  <div className="w-full h-52 bg-gray-50/60 p-4 flex items-center justify-center relative overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src =
                          'https://via.placeholder.com/300x200/ffffff/1B365D?text=Rasm+Mavjud+Emas';
                      }}
                    />
                    <span className="absolute top-3 right-3 text-xs font-bold px-3 py-1 bg-[#1B365D] text-white rounded-full shadow-sm">
                      Omborda: {item.stock} ta
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-[#1B365D] mb-1 line-clamp-1">
                        {item.name}
                      </h3>
                      <div className="flex items-center justify-between my-2">
                        <span className="text-[#F97316] font-extrabold text-xl tracking-tight">
                          {Number(cost).toLocaleString()} XP
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="w-full bg-[#1B365D]/5 text-[#1B365D] border border-[#1B365D]/10 py-2 rounded-xl hover:bg-[#1B365D] hover:text-white font-semibold text-xs transition-all duration-200 active:scale-95 flex items-center justify-center gap-1"
                      >
                        ✏️ Tahrirlash
                      </button>
                      <button
                        onClick={() => handleDelete(productId)}
                        className="w-full bg-red-50 text-red-600 border border-red-100 py-2 rounded-xl hover:bg-red-600 hover:text-white font-semibold text-xs transition-all duration-200 active:scale-95 flex items-center justify-center gap-1"
                      >
                        🗑️ O'chirish
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-16 bg-[#FFFFFF] border border-dashed border-gray-200 rounded-2xl">
              <p className="text-[#1B365D]/60 text-sm font-medium">
                Hozircha marketda mahsulotlar mavjud emas.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAHRIRLASH MODAL OYNASI */}
      {editingProduct && (
        <div className="fixed inset-0 bg-[#1B365D]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border border-gray-100 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-[#1B365D] mb-4 flex items-center gap-2">
              <span>✏️</span> Mahsulotni tahrirlash
            </h3>

            <form onSubmit={handleUpdateProduct} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-[#1B365D]/80 mb-1 block">
                  Mahsulot nomi
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full border border-gray-200 p-3 rounded-xl text-[#1B365D] bg-gray-50/50 focus:bg-[#FFFFFF] focus:outline-none focus:border-[#1B365D] text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#1B365D]/80 mb-1 block">
                    XP Narxi
                  </label>
                  <input
                    type="number"
                    value={editXpCost}
                    onChange={(e) => setEditXpCost(e.target.value)}
                    className="w-full border border-gray-200 p-3 rounded-xl text-[#1B365D] bg-gray-50/50 focus:bg-[#FFFFFF] focus:outline-none focus:border-[#1B365D] text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#1B365D]/80 mb-1 block">
                    Soni (Stock)
                  </label>
                  <input
                    type="number"
                    value={editStock}
                    onChange={(e) => setEditStock(e.target.value)}
                    className="w-full border border-gray-200 p-3 rounded-xl text-[#1B365D] bg-gray-50/50 focus:bg-[#FFFFFF] focus:outline-none focus:border-[#1B365D] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1B365D]/80 mb-1 block">
                  Rasm URL/Base64
                </label>
                <input
                  type="text"
                  value={editImageUrl}
                  onChange={(e) => setEditImageUrl(e.target.value)}
                  className="w-full border border-gray-200 p-3 rounded-xl text-[#1B365D] bg-gray-50/50 focus:bg-[#FFFFFF] focus:outline-none focus:border-[#1B365D] text-sm"
                />
              </div>

              <div className="flex gap-3 justify-end mt-4 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-[#1B365D]/70 hover:bg-gray-50 text-sm font-semibold transition"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#ea580c] disabled:opacity-50 text-white font-bold text-sm transition shadow-md"
                >
                  {submitting ? 'Saqlanmoqda...' : 'Saqlash'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Market;