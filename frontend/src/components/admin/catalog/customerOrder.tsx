import { ChevronRight, Clock, ShoppingCart, User } from "lucide-react";
import { useEffect, useState } from "react";
import { customerOrderProps } from "../../../services/Props";
import { fetchCompletedOrders } from "../../../services/fetchData.api";

export const CustomerOrder = () => {
    const [customerOrderLogs, setCustomerOrderLogs] = useState<customerOrderProps[]>([]);
    const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null)

    useEffect(() => {
        getOrdersAPI();
    }, []);

    const getOrdersAPI = async() => {
        const result = await fetchCompletedOrders();
        setCustomerOrderLogs(result);
    }

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleString('en-PH', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
    });

    return (
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {customerOrderLogs.map((log) => {
                const isExpanded = expandedOrderId === log.order_id;
                
                return (
                <div key={log.order_id} className="border border-purple-200 bg-white rounded-lg overflow-hidden">
                    <div  className="px-4 py-3 cursor-pointer hover:bg-purple-50 transition-colors flex items-center justify-between gap-3"
                        onClick={() => setExpandedOrderId(isExpanded ? null : log.order_id)}>
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="bg-blue-50 px-3 py-1 rounded border border-blue-200">
                        <span className="text-blue-900 font-semibold">#{log.queue_number || 'N/A'}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                        <span className="font-medium text-gray-900">{log.status === 3 ? "Completed" : "No Show"}</span>
                        <span className="text-gray-400 mx-2">•</span>
                        <span className="text-gray-600">{log.total_quantity || 0} quantity</span>
                        <span className="text-gray-400 mx-2">•</span>
                        <span className="font-semibold text-green-700">₱{(log.total_amount || 0).toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-gray-500 flex items-center gap-1 whitespace-nowrap">
                        <Clock className="h-3 w-3" /> {formatDate(log.created_at)}
                        </span>
                        <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </div>
                    </div>

                    {isExpanded && log.products && (
                    <div className="border-t border-purple-100 bg-purple-50/30 p-4 space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                        {log.queue_number && (
                            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                            <p className="text-gray-500 mb-1">Queue Number</p>
                            <p className="text-blue-900 font-bold text-lg">#{log.queue_number}</p>
                            </div>
                        )}
                        {log.total_quantity && (
                            <div className="bg-white p-3 rounded-lg border border-gray-200">
                            <p className="text-gray-500 mb-1">Total Items</p>
                            <p className="font-semibold text-sm">{log.total_quantity} item{log.total_quantity !== 1 ? 's' : ''}</p>
                            </div>
                        )}
                        {log.total_amount !== undefined && (
                            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                            <p className="text-gray-500 mb-1">Total Amount</p>
                            <p className="text-green-900 font-bold text-lg">₱{log.total_amount.toFixed(2)}</p>
                            </div>
                        )}
                        </div>
                        
                        {log.products && (
                        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                            <div className="bg-gray-50 px-3 py-2 border-b">
                            <p className="font-semibold text-sm">Order Items</p>
                            </div>
                            <div className="divide-y">
                            {log.products.map((item: any, idx: number) => (
                                <div key={idx} className="px-3 py-2 flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="font-medium capitalize">{item.product_name}</p>
                                    <p className="text-gray-500">Qty: {item.quantity} × ₱{item.price.toFixed(2)}</p>
                                </div>
                                <p className="font-semibold text-xl">₱{(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                            </div>
                        </div>
                        )}

                        <div className="text-gray-500 pt-2 border-t border-purple-100">
                        <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Order placed: {formatDate(log.created_at)}
                        </span>
                        </div>
                    </div>
                    )}
                </div>
                );
            })}

            {customerOrderLogs.length === 0 && (
                <div className="text-center py-12">
                    <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">No customer orders yet</p>
                    <p className="text-gray-500 text-sm mt-2">Customer orders will appear here once placed</p>
                </div>
            )}
        </div>
    )
}