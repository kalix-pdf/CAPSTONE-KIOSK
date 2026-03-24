import { AdminLogin } from "./components/admin/AdminLogin";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { useAuth } from "./components/admin/AuthContext";
import { CounterDashboard } from "./components/admin/CounterDashboard";


export default function AdminApp() {
  const { role } = useAuth();

  if (role === 1) {
    return <AdminDashboard />;
  }

  else if (role === 2) {
    return <CounterDashboard />;
  }

  return (
    <AdminLogin />
  );
}
