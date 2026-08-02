import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { FiShoppingBag, FiZap } from 'react-icons/fi';
import API from "../../api";

export default function StudentStore({ currentStudent }) {
  const [products, setProducts] = useState([]);
  const [studentXp, setStudentXp] = useState(currentStudent?.xp || 0);
  const [loading, setLoading] = useState(true);
  const [purchasingId, setPurchasingId] = useState(null);

  // 1. Mahsulotlarni backend'dan yuklab olish
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get('/products');
      
      // Backend qaytargan javob formatiga moslash
      const list = res.data?.data || (Array.isArray(res.data) ? res.data : []);
      setProducts(list);
    } catch (error) {
      console.error("Mahsulotlarni yuklashda xatolik:", error);
      toast.error("Do'kon mahsulotlarini yuklab bo'lmadi!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    if (currentStudent?.xp !== undefined) {
      setStudentXp(currentStudent.xp);
    }
  }, [currentStudent]);

  // 2. Sotib olish mantiqi (Backend routeringizga 100% mos)
  const handleBuy = async (product) => {
    const productId = product._id || product.id;
    const cost = product.xp_cost;

    // Frontend tomondan tezkor tekshiruvlar
    if (studentXp < cost) {
      return toast.error("XP balansingiz yetarli emas! ⚡");
    }

    if (product.stock <= 0) {
      return toast.error("Afsuski, ushbu mahsulot omborda tugagan!");
    }

    try {
      setPurchasingId(productId);

      // Backend route: POST /api/products/buy
      const response = await API.post('/products/buy', {
        productId: productId,
        studentId: currentStudent?._id || currentStudent?.id, // Yoki auth token bo'lsa backend o'zi aniqlaydi
        phone: currentStudent?.phone,
      });

      // Muvaffaqiyatli xariddan so'ng state'larni yangilash
      setStudentXp((prev) => prev - cost);
      setProducts((prev) =>
        prev.map((p) =>
          (p._id || p.id) === productId ? { ...p, stock: p.stock - 1 } : p
        )
      );

      toast.success(`Tabriklaymiz! "${product.name}" muvaffaqiyatli xarid qilindi! 🎉`);
    } catch (error) {
      console.error("Xarid qilishda xatolik:", error);
      toast.error(
        error.response?.data?.message || "Xaridni amalga oshirib bo'lmadi!"
      );
    } finally {
      setPurchasingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-3">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-xs font-semibold animate-pulse">
          Do'kon yuklanmoqda...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#0B132B] text-white px-4 pt-4 pb-24">
      <Toaster position="bottom-center" />

      {/* HEADER: O'quvchi XP Balansi */}
      <div className="flex items-center justify-between mb-5 bg-[#1C2541] border border-slate-800 p-4 rounded-2xl shadow-lg">
        <div>
          <h1 className="text-base font-extrabold flex items-center gap-2 text-white">
            Mukofotlar do'koni <FiShoppingBag className="text-orange-500" />
          </h1>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1 font-medium">
            Balansingiz:
            <span className="font-mono font-bold text-orange-400 text-sm flex items-center gap-0.5 ml-1">
              <FiZap className="text-orange-400 fill-orange-400" />
              {Number(studentXp).toLocaleString()} XP
            </span>
          </p>
        </div>
      </div>

      {/* MAHSULOTLAR GRIDI */}
      <div className="grid grid-cols-2 gap-3.5">
        {products.length > 0 ? (
          products.map((item) => {
            const prodId = item._id || item.id;
            const cost = item.xp_cost ?? 0;
            const canAfford = studentXp >= cost;
            const inStock = item.stock > 0;

            return (
              <div
                key={prodId}
                className="bg-[#1C2541] border border-slate-800 rounded-2xl p-3 flex flex-col justify-between shadow-sm overflow-hidden"
              >
                {/* RASM BLOKI - Proportion buzilmaydi */}
                <div className="w-full h-36 rounded-xl overflow-hidden bg-[#0B132B]/50 flex items-center justify-center p-2">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.src =
                        'https://via.placeholder.com/200x200/1C2541/FFFFFF?text=Rasm+Mavjud+Emas';
                    }}
                  />
                </div>

                {/* MAHSULOT MA'LUMOTLARI */}
                <div className="mt-3 flex flex-col flex-1 justify-between">
                  <div>
                    <h3
                      className="text-xs font-bold text-white line-clamp-1 mb-1.5"
                      title={item.name}
                    >
                      {item.name}
                    </h3>

                    <div className="flex items-center justify-between text-[11px] mb-3">
                      <span className="font-mono font-extrabold text-orange-400 text-sm">
                        {cost} XP
                      </span>
                      <span className="text-slate-400 font-medium">
                        {item.stock} dona
                      </span>
                    </div>
                  </div>

                  {/* SOTIB OLISH TUGMASI */}
                  <button
                    onClick={() => handleBuy(item)}
                    disabled={!canAfford || !inStock || purchasingId === prodId}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all active:scale-95 shadow-sm ${
                      !inStock
                        ? 'bg-slate-800/80 text-slate-500 cursor-not-allowed border border-slate-800'
                        : !canAfford
                        ? 'bg-slate-800/80 text-slate-400 cursor-not-allowed border border-slate-700/50'
                        : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/10'
                    }`}
                  >
                    {purchasingId === prodId
                      ? 'Olinmoqda...'
                      : !inStock
                      ? 'Tugagan'
                      : !canAfford
                      ? 'XP Yetarli emas'
                      : 'Sotib olish'}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-2 text-center py-12 bg-[#1C2541] border border-slate-800 rounded-2xl">
            <p className="text-xs text-slate-400 font-medium">
              Hozircha do'konda sotuvda mukofotlar yo'q.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}