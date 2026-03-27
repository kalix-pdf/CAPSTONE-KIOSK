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
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const { logout } = useAuth();

  return (
    <><Toaster /> 
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
         <div>
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-gray-900 text-xl">Administrator Dashboard</h1>
            <div className="flex gap-4">
              <button className="border-red-300 border-2 text-sm rounded-md px-4 py-2 bg-red-100" onClick={logout}>Logout</button>
              <Badge variant="outline" className="text-black bg-lumot-100 border-lumot-600 px-4 py-2">
                Admin Staff
              </Badge>
            </div>
          </div>
          <p className="text-gray-600">Manage Pharmacy</p>
        </div>

        {/* Stats */}
        <TotalInventory
          totalCustomerOrder={totalCustomerOrder}
          setTotalCustomerOrder={setTotalCustomerOrder}/>

        {/* Management Tabs */}
        <Card className="py-6 border-lumot-900 bg-gray-100">
          <CardHeader>
            <CardTitle>Pharmacy Management</CardTitle>
            <CardDescription>Manage medications and categories</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="inventory">
              <TabsList className="grid w-full grid-cols-4 max-w-4xl">
                <TabsTrigger value="inventory">
                  <Pill className="h-4 w-4 mr-2" />
                  Medication Inventory
                </TabsTrigger>
                <TabsTrigger value="categories">
                  <Tag className="h-4 w-4 mr-2" />
                  Categories
                </TabsTrigger>
                <TabsTrigger value="activity">
                  <Activity className="h-4 w-4 mr-2" />
                  Admin Activity Log
                </TabsTrigger>
                <TabsTrigger value="orders">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Customer Orders
                </TabsTrigger>
              </TabsList>

              {/* Inventory Tab */}
              <TabsContent value="inventory" className="space-y-4 mt-6">
                <MedicationInventory />
              </TabsContent>

              {/* Categories Tab */}
              <TabsContent value="categories" className="space-y-4 mt-6">
                <Categories />
              </TabsContent>

              {/* Activity Log Tab */}
              <TabsContent value="activity" className="space-y-4 mt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Track all administrative actions and system events
                    </p>
                  </div>
                </div>
                <ActivityLogs/>
              </TabsContent>

              {/* Customer Orders Tab */}
              <TabsContent value="orders" className="space-y-4 mt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground">
                      View all customer orders placed through the kiosk
                    </p>
                    <p className="text-gray-500 mt-1">
                      Showing last {totalCustomerOrder} customer orders • Click to view details
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">
                    <ShoppingCart className="h-3 w-3 mr-1" />
                    {totalCustomerOrder} Orders
                  </Badge>
                </div>
                <CustomerOrder/>
                
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>    

      {/* Delete Category Confirmation Dialog */}
      
    </div>
    </>
  );
}
