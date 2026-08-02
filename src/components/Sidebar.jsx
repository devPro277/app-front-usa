import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/admin/inventory", label: "Market", icon: "🛒" },
    { path: "/admin/students", label: "O'quvchilar", icon: "🎓" },
    { path: "/admin/teachers", label: "Ustozlar", icon: "👨‍🏫" },
    { path: "/admin/groups", label: "Guruhlar", icon: "👥" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Tizimdan chiqildingiz");
    navigate("/admin/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-[#1B365D] text-white p-5 flex flex-col justify-between shadow-xl">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 pb-6 mb-6 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl font-bold">
            U
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none">UniSphere</h1>
            <span className="text-xs text-blue-200">Academy Dashboard</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-white/15 text-white shadow-inner font-semibold"
                    : "text-blue-100/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout & Footer */}
      <div className="pt-4 border-t border-white/10 space-y-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-red-300 hover:bg-red-500/20 hover:text-red-100 transition-all text-sm"
        >
          <span>🚪</span>
          <span>Chiqish</span>
        </button>

        <div className="text-xs text-blue-200/60 text-center">
          © 2026 UniSphere Academy
        </div>
      </div>
    </aside>
  );
}