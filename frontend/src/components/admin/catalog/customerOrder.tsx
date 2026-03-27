// import { ChevronRight, Clock, User } from "lucide-react";

// export const customerOrder = () => {


//     return (
//         <div className="space-y-2 max-h-[600px] overflow-y-auto">
//             {customerOrderLogs.map((log) => {
//                 const isExpanded = expandedOrderId === log.id;
                
//                 return (
//                 <div key={log.id} className="border border-purple-200 bg-white rounded-lg overflow-hidden">
//                     <div 
//                     className="px-4 py-3 cursor-pointer hover:bg-purple-50 transition-colors flex items-center justify-between gap-3"
//                     onClick={() => setExpandedOrderId(isExpanded ? null : log.id)}
//                     >
//                     <div className="flex items-center gap-3 flex-1 min-w-0">
//                         <div className="bg-blue-50 px-3 py-1 rounded border border-blue-200">
//                         <span className="text-blue-900 font-semibold">#{log.metadata?.queueNumber || 'N/A'}</span>
//                         </div>
//                         <div className="flex-1 min-w-0">
//                         <span className="font-medium text-gray-900">{log.metadata?.customerName || 'Unknown'}</span>
//                         <span className="text-gray-400 mx-2">•</span>
//                         <span className="text-sm text-gray-600">{log.metadata?.itemCount || 0} item{(log.metadata?.itemCount || 0) !== 1 ? 's' : ''}</span>
//                         <span className="text-gray-400 mx-2">•</span>
//                         <span className="text-sm font-semibold text-green-700">₱{(log.metadata?.totalAmount || 0).toFixed(2)}</span>
//                         </div>
//                     </div>
//                     <div className="flex items-center gap-3">
//                         <span className="text-xs text-gray-500 flex items-center gap-1 whitespace-nowrap">
//                         <Clock className="h-3 w-3" />
//                         {log.timestamp.toLocaleString('en-PH', {
//                             month: 'short',
//                             day: 'numeric',
//                             hour: '2-digit',
//                             minute: '2-digit'
//                         })}
//                         </span>
//                         <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
//                     </div>
//                     </div>

//                     {isExpanded && log.metadata && (
//                     <div className="border-t border-purple-100 bg-purple-50/30 p-4 space-y-4">
//                         <div className="grid grid-cols-2 gap-3">
//                         {log.metadata.customerName && (
//                             <div className="bg-white p-3 rounded-lg border border-gray-200">
//                             <p className="text-xs text-gray-500 flex items-center gap-1 mb-1">
//                                 <User className="h-3 w-3" />
//                                 Customer Name
//                             </p>
//                             <p className="font-semibold text-sm">{log.metadata.customerName}</p>
//                             </div>
//                         )}
//                         {log.metadata.queueNumber && (
//                             <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
//                             <p className="text-xs text-gray-500 mb-1">Queue Number</p>
//                             <p className="text-blue-900 font-bold text-lg">#{log.metadata.queueNumber}</p>
//                             </div>
//                         )}
//                         {log.metadata.itemCount && (
//                             <div className="bg-white p-3 rounded-lg border border-gray-200">
//                             <p className="text-xs text-gray-500 mb-1">Total Items</p>
//                             <p className="font-semibold text-sm">{log.metadata.itemCount} item{log.metadata.itemCount !== 1 ? 's' : ''}</p>
//                             </div>
//                         )}
//                         {log.metadata.totalAmount !== undefined && (
//                             <div className="bg-green-50 p-3 rounded-lg border border-green-200">
//                             <p className="text-xs text-gray-500 mb-1">Total Amount</p>
//                             <p className="text-green-900 font-bold text-lg">₱{log.metadata.totalAmount.toFixed(2)}</p>
//                             </div>
//                         )}
//                         </div>
                        
//                         {log.metadata.items && Array.isArray(log.metadata.items) && (
//                         <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
//                             <div className="bg-gray-50 px-3 py-2 border-b">
//                             <p className="font-semibold text-sm">Order Items</p>
//                             </div>
//                             <div className="divide-y">
//                             {log.metadata.items.map((item: any, idx: number) => (
//                                 <div key={idx} className="px-3 py-2 flex items-center justify-between">
//                                 <div className="flex-1">
//                                     <p className="font-medium text-sm">{item.name}</p>
//                                     <p className="text-xs text-gray-500">Qty: {item.quantity} × ₱{item.price.toFixed(2)}</p>
//                                 </div>
//                                 <p className="font-semibold text-sm">₱{(item.price * item.quantity).toFixed(2)}</p>
//                                 </div>
//                             ))}
//                             </div>
//                         </div>
//                         )}

//                         <div className="text-xs text-gray-500 pt-2 border-t border-purple-100">
//                         <span className="flex items-center gap-1">
//                             <Clock className="h-3 w-3" />
//                             Order placed: {log.timestamp.toLocaleString('en-PH', {
//                             month: 'long',
//                             day: 'numeric',
//                             year: 'numeric',
//                             hour: '2-digit',
//                             minute: '2-digit',
//                             second: '2-digit'
//                             })}
//                         </span>
//                         </div>
//                     </div>
//                     )}
//                 </div>
//                 );
//             })}
//             </div>

//             {customerOrderLogs.length === 0 && (
//             <div className="text-center py-12">
//                 <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
//                 <p className="text-gray-600">No customer orders yet</p>
//                 <p className="text-gray-500 text-sm mt-2">Customer orders will appear here once placed</p>
//             </div>
//             )}
//     )
// }