import { useState, useEffect } from "react";
import { BarChart, DollarSign, Pill } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { TotalInventoryProps } from "../../services/Props";
import { fetchTotalInventory } from "../../services/fetchData.api";

interface props {
  totalCustomerOrder: number | null;
  setTotalCustomerOrder: (value: number) => void;
}

export const TotalInventory = ({totalCustomerOrder, setTotalCustomerOrder}: props) => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<TotalInventoryProps | undefined>(undefined);
    
      useEffect(() => {
        fetchTotalInventory()
          .then(res => {
            setStats(res[0]); 
            setTotalCustomerOrder(res[0].total_order);
          })
          .catch(console.error)
          .finally(() => setLoading(false));
      }, []); 
    
      if (loading) return <p>Loading...</p>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="py-6 border-orange-400">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Total Medications</CardTitle>
              <Pill className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-gray-900">{stats?.total_medication}</div>
              <p className="text-muted-foreground">
                Active in inventory
              </p>
            </CardContent>
          </Card>

          <Card className="py-6 border-lumot-600">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Total Inventory Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-gray-900">
                ₱{stats?.total_value_price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-muted-foreground">
                Current stock value </p>
            </CardContent>
          </Card>

          <Card className="py-6 border-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Total Customer Order</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-gray-900">{Number(stats?.total_order)}</div>
            </CardContent>
          </Card>
        </div>
    );
}