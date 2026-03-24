// AppRouter.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./components/admin/AuthContext";
import { QueueDisplay } from "./components/QueueDisplay";

import CustomerApp from "./CustomerApp";
import AdminApp from "./AdminApp";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/customer" replace />} />
      <Route path="/customer/*" element={<CustomerApp />} />
      <Route path="/admin/*" element={<AuthProvider> <AdminApp /> </AuthProvider>} />
      <Route path="/QueueDisplay/*" element={<QueueDisplay />} />
    </Routes>
  );
}