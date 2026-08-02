import { Routes, Route, Navigate } from "react-router-dom";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";

// Admin sahifalari
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminMarket from "./pages/admin/AdminMarket";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminGroups from "./pages/admin/AdminGroups";

// Student sahifalari
import StudentLayout from "./layouts/StudentLayout";
import Dashboard from "./pages/student/Dashboard";
import Profile from "./pages/student/Profile";
import Store from "./pages/student/Store";

export default function App() {
  return (
    <Routes>
      {/* 1. ADMIN LOGIN */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* 2. ADMIN PROTECTED ROUTES */}
      <Route path="/admin" element={<AdminProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="market" element={<AdminMarket />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="teachers" element={<div>Ustozlar Sahifasi</div>} />
          <Route path="groups" element={<AdminGroups />} />
        </Route>
      </Route>

      {/* 3. STUDENT ROUTES */}
      <Route path="/" element={<StudentLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="store" element={<Store />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}