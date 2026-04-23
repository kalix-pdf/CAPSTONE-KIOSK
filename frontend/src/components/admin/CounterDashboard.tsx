import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Users, Clock, CheckCircle } from "lucide-react";
import { Badge } from "../ui/badge";
import { useEffect, useState } from "react";
import { QueueTicket } from "../../services/Props";
import { fetchOrders, fetchTotalCompletedToday } from "../../services/fetchData.api";
import { QueueManagement } from "./QueueManagement";
import { useAdminSocket } from "../../services/streams/socket";
import { useAuth } from "./AuthContext";

export function CounterDashboard() {
  const MINUTES_PER_ITEM = 2;
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<QueueTicket[]>([]);
  const [completedToday, setCompletedToday] = useState<{ total: number }  | null>(null);
  const waitingQueue = orders?.filter(ticket => ticket.status === 1);
  const { logout } = useAuth();

  useAdminSocket({
    ORDER_CREATED: (newOrder) => {
      setOrders((prev) => {
        const exists = prev.some((o) => o.order_id === newOrder.order_id);
        if (exists) return prev;
        return [...prev, newOrder];
      });
    },
    ORDER_UPDATED: (updatedOrder) => {
      setOrders((prev) =>
        prev.map((o) => (o.order_id === updatedOrder.order_id ? updatedOrder : o))
      );
      // if (updatedOrder.status === 3) {
      //   setCompletedToday((prev) => ({ total: (prev?.total ?? 0) + 1 }));
      // }
    },
  });

  useEffect(() => { Promise.all([ fetchTotalCompletedToday(), 
    fetchOrders([1, 2])]).then(([completedResult, ordersResult]) => {
        setCompletedToday(completedResult[0]); 
        setOrders(ordersResult); }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-gray-900 text-xl">Counter Dashboard</h1>
            <div className="flex gap-4">
              <button className="border-red-300 border-2 text-sm rounded-md px-4 py-2 bg-red-100" onClick={logout}>Logout</button>
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 px-4 py-2">
                Counter Staff
              </Badge>
            </div>
          </div>
          <p className="text-gray-600">Manage customer queue and process orders</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card padded className="border-orange-400 bg-gradient-to-br from-orange-50 to-orange-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Waiting in Queue</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-gray-900">{waitingQueue?.length}</div>
              <p className="text-muted-foreground">
                Customers waiting
              </p>
            </CardContent>
          </Card>

          <Card padded className="border-purple-500 bg-gradient-to-br from-blue-100 via-green-100 to-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Est. Wait Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-gray-900">{MINUTES_PER_ITEM} min</div>
              <p className="text-muted-foreground">
                Average waiting time per 1 product 1 customer
              </p>
            </CardContent>
          </Card>

          <Card padded className="border-lumot-900 bg-gradient-to-br from-green-100 via-white-200 to-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Completed Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-gray-900">{completedToday?.total}</div>
              <p className="text-muted-foreground">
                Orders processed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Queue Management */}
        <Card padded className="border-yellow-500">
          <CardHeader>
            <CardTitle>Queue Management</CardTitle>
            <CardDescription>
              Call and process customer orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <QueueManagement
              orders={orders}
              completedToday={completedToday}
              waitingQueue={waitingQueue}
              // currentlyServing={currentlyServing}
              // currentlyServing={currentlyServing}
              // onCallNext={onCallNext}
              // onMarkCompleted={onMarkCompleted}
              // onMarkNoShow={onMarkNoShow}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
