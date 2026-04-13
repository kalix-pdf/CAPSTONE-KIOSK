import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { ActivityLogs } from "./catalog/ActivityLogs";
import { Pill, Tag, Activity, ShoppingCart } from "lucide-react";
import { TotalInventory } from "./TotalInventory";
import { MedicationInventory } from "./catalog/MedicationInventory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Categories } from "./catalog/Categories";
import { Toaster } from "sonner";
import { useAuth } from "./AuthContext";
import { CustomerOrder } from "./catalog/customerOrder";

export function AdminDashboard() {
  const [totalCustomerOrder, setTotalCustomerOrder] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("inventory");
  const { logout } = useAuth();

  const navItems = [
    { key: "inventory", label: "Medication Inventory", icon: <Pill className="h-4 w-4 mr-3" />, group: "Inventory" },
    { key: "categories", label: "Categories", icon: <Tag className="h-4 w-4 mr-3" />, group: "Inventory" },
    { key: "orders", label: "Customer Orders", icon: <ShoppingCart className="h-4 w-4 mr-3" />, group: "Operations" },
    { key: "activity", label: "Admin Activity Log", icon: <Activity className="h-4 w-4 mr-3" />, group: "Operations" },
  ];

  const groups = [...new Set(navItems.map(i => i.group))];

  return (
    <><Toaster /> 
    <div className="flex min-h-screen bg-gray-50">
      <aside className="border-r border-gray-200 p-8 bg-lumot-900 text-white flex justify-between flex-col">
        <div className="px-5 py-5 border-b border-white">
          <h2 className="text-lg font-medium">Pharmacy Admin</h2>
          <p className="mt-0.5 mb-1">Management Portal</p>
        </div>

        <nav className="flex-1 py-3">
          {groups.map(group => (
            <div key={group}>
              <p className="px-5 py-2 text-sm uppercase tracking-widest text-gray-400 font-medium">
                {group}
              </p>
              {navItems.filter(i => i.group === group).map(item => (
                <button key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`w-full flex items-center gap-2.5 px-6 py-2.5 p-2 border-l-2 transition-colors
                    ${activeTab === item.key
                      ? "bg-white rounded-2xl text-black border-violet-500 font-medium"
                      : "border-transparent hover:bg-gray-50 hover:text-gray-800"
                    }`}>
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-white space-y-2">
          <Badge variant="outline" className="text-black bg-lumot-100 border-lumot-600 px-3 py-1 w-full justify-center">
            Manage Account
          </Badge>
          <button className="w-full border border-red-300 rounded-md px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100"
            onClick={logout}>
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden overflow-y-auto h-100vh space-y-2">
        <header className="bg-lumot-900 text-white border-b border-gray-200 px-8 py-4 flex justify-between">
          <div>
            <h1 className="text-xl">Administrator Dashboard</h1>
            <p className="mt-0.5">Manage Pharmacy</p>
          </div>
          <div>
            <img src="/images/logo-white.png" className="object-cover w-16" alt="" />
          </div>
        </header> 

        <main className="flex-1 p-8 overflow-y-auto space-y-6">
          <TotalInventory
            totalCustomerOrder={totalCustomerOrder}
            setTotalCustomerOrder={setTotalCustomerOrder}/>

          <Card className="border-lumot-900 bg-gray-100 py-6">
            <CardHeader>
              <CardTitle>Manage medications and categories</CardTitle>
            </CardHeader>
            <CardContent>
              {activeTab === "inventory" && <MedicationInventory />}
              {activeTab === "categories" && <Categories />}
              {activeTab === "orders" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground">View all customer orders placed through the kiosk</p>
                      <p className="text-gray-500 mt-1 text-sm">
                        Showing last {totalCustomerOrder} customer orders • Click to view details
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      {totalCustomerOrder} Orders
                    </Badge>
                  </div>
                  <CustomerOrder />
                </div>
              )}
              {activeTab === "activity" && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Track all administrative actions and system events
                  </p>
                  <ActivityLogs />
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>    

    </div>
    </>
  );
}
