// import { useState } from "react";
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
// import { Activity, BarChart, Clock, FileText, Pill, RotateCcw, ShoppingCart, Tag, User } from "lucide-react";
// import { Badge } from "../../ui/badge"
// import { Button } from "../../ui/button";
// import { ActivityLogProps } from "../../../services/admin/activitylogs.api";
// import { toast } from "sonner";
// import { Product } from "../../../services/product.api";

// interface ActivityDialogProps {
//     selectedActivity: ActivityLogProps | null;
//     isActivityDetailOpen: boolean;
//     setIsActivityDetailOpen: (open: boolean) => void;
// }

// export const ActivityDialog = ({selectedActivity, isActivityDetailOpen, setIsActivityDetailOpen}: ActivityDialogProps) => {
    
//     const handleRestoreProduct = async (log: ActivityLogProps) => {
//         if (!log.metadata?.beforeValue) {
//             toast.error("Cannot restore: Product data not found");
//             return;
//         }

//         try {
//             const restoredProduct = log.metadata.beforeValue as Partial<Product>;

//             // toast.success(`Successfully restored ${productData.name}`);
      
//             setIsActivityDetailOpen(false);
//         } catch (error) {
//             toast.error("Failed to restore medication");
//         }
//     };

//     const handleRestoreCategory = async (log: ActivityLogProps) => {
//         if (!log.metadata?.category) {
//             toast.error("Cannot restore: Category name not found");
//             return;
//         }

//         try {
//             const categoryName = log.metadata.category;
            
//             toast.success(`Successfully restored category "${categoryName}"`);
            
//             setIsActivityDetailOpen(false);
//         } catch (error) {
//             toast.error("Failed to restore category");
//         }
//     };


//     return (
//         <Dialog open={isActivityDetailOpen} onOpenChange={setIsActivityDetailOpen}>
//             <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
//             <DialogHeader>
//                 <DialogTitle className="flex items-center gap-2">
//                 {selectedActivity && (() => {
//                     switch (selectedActivity.type) {
//                     case 1:
//                     case 3:
//                     case 5:
//                         return <Pill className="h-5 w-5" />;
//                     case 2:
//                     case 6:
//                         return <Tag className="h-5 w-5" />;
//                     case 3:
//                         return <BarChart className="h-5 w-5" />;
//                     case 7:
//                         return <ShoppingCart className="h-5 w-5" />;
//                     default:
//                         return <Activity className="h-5 w-5" />;
//                     }
//                 })()}
//                 Activity Details
//                 </DialogTitle>
//                 <DialogDescription>
//                 Complete information about this administrative action
//                 </DialogDescription>
//             </DialogHeader>

//             {selectedActivity && (
//                 <div className="space-y-6">
//                 {/* Header Info */}
//                 <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                     <div className="space-y-1">
//                     <div className="flex items-center gap-2">
//                         <Badge 
//                         variant="outline" 
//                         className={(() => {
//                             switch (selectedActivity.type) {
//                             case 1:
//                             case 2:
//                                 return 'bg-green-100 text-green-700 border-green-300';
//                             case 5:
//                             case 6:
//                                 return 'bg-red-100 text-red-700 border-red-300';
//                             case 3:
//                             case 3:
//                                 return 'bg-blue-100 text-blue-700 border-blue-300';
//                             default:
//                                 return 'bg-gray-100 text-gray-700 border-gray-300';
//                             }
//                         })()}
//                         >
//                         {selectedActivity.action}
//                         </Badge>
//                         <span className="text-xs text-gray-500">ID: {selectedActivity.id}</span>
//                     </div>
//                     <p className="font-medium">{selectedActivity.description}</p>
//                     </div>
//                     <div className="text-right text-sm text-gray-600">
//                     <div className="flex items-center gap-1">
//                         <User className="h-4 w-4" />
//                         {selectedActivity.user}
//                     </div>
//                     <div className="flex items-center gap-1 mt-1">
//                         <Clock className="h-4 w-4" />
//                         {selectedActivity.timestamp.toLocaleString('en-PH', {
//                         month: 'short',
//                         day: 'numeric',
//                         year: 'numeric',
//                         hour: '2-digit',
//                         minute: '2-digit',
//                         second: '2-digit'
//                         })}
//                     </div>
//                     </div>
//                 </div>

//                 {/* Summary */}
//                 {selectedActivity.details && (
//                     <div className="space-y-2">
//                     <h4 className="font-semibold text-sm text-gray-700">Summary</h4>
//                     <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
//                         <p className="text-sm font-mono">{selectedActivity.details}</p>
//                     </div>
//                     </div>
//                 )}

//                 {/* Metadata Section */}
//                 {selectedActivity.metadata && (
//                     <div className="space-y-4">
//                     {/* Changes */}
//                     {selectedActivity.metadata.changes && selectedActivity.metadata.changes.length > 0 && (
//                         <div className="space-y-2">
//                         <h4 className="font-semibold text-sm text-gray-700">Changes Made</h4>
//                         <div className="space-y-2">
//                             {selectedActivity.metadata.changes.map((change, idx) => (
//                             <div key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
//                                 <div className="flex items-center justify-between mb-2">
//                                 <span className="font-medium text-sm">{change.field}</span>
//                                 </div>
//                                 <div className="grid grid-cols-2 gap-4">
//                                 <div>
//                                     <p className="text-xs text-gray-500 mb-1">Before</p>
//                                     <div className="p-2 bg-red-50 border border-red-200 rounded text-sm">
//                                     <code className="text-red-700">{String(change.before)}</code>
//                                     </div>
//                                 </div>
//                                 <div>
//                                     <p className="text-xs text-gray-500 mb-1">After</p>
//                                     <div className="p-2 bg-green-50 border border-green-200 rounded text-sm">
//                                     <code className="text-green-700">{String(change.after)}</code>
//                                     </div>
//                                 </div>
//                                 </div>
//                             </div>
//                             ))}
//                         </div>
//                         </div>
//                     )}

//                     {/* Product Info */}
//                     {selectedActivity.metadata.productName && (
//                         <div className="space-y-2">
//                         <h4 className="font-semibold text-sm text-gray-700">Product Information</h4>
//                         <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-2">
//                             <div className="flex justify-between">
//                             <span className="text-sm text-gray-600">Product Name:</span>
//                             <span className="text-sm font-medium">{selectedActivity.metadata.productName}</span>
//                             </div>
//                             {selectedActivity.metadata.category && (
//                             <div className="flex justify-between">
//                                 <span className="text-sm text-gray-600">Category:</span>
//                                 <Badge variant="outline">{selectedActivity.metadata.category}</Badge>
//                             </div>
//                             )}
//                             {selectedActivity.metadata.productId && (
//                             <div className="flex justify-between">
//                                 <span className="text-sm text-gray-600">Product ID:</span>
//                                 <code className="text-sm font-mono bg-white px-2 py-1 rounded">{selectedActivity.metadata.productId}</code>
//                             </div>
//                             )}
//                         </div>
//                         </div>
//                     )}

//                     {/* After Value (for new products) */}
//                     {selectedActivity.metadata.afterValue && !selectedActivity.metadata.changes && typeof selectedActivity.metadata.afterValue === 'object' && (
//                         <div className="space-y-2">
//                         <h4 className="font-semibold text-sm text-gray-700">Product Details (New)</h4>
//                         <div className="p-3 bg-green-50 border border-green-200 rounded-lg space-y-2">
//                             {Object.entries(selectedActivity.metadata.afterValue).map(([key, value]) => (
//                             <div key={key} className="flex justify-between">
//                                 <span className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
//                                 <span className="text-sm font-medium">
//                                 {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : 
//                                 typeof value === 'number' && key === 'price' ? `₱${value.toFixed(2)}` :
//                                 String(value)}
//                                 </span>
//                             </div>
//                             ))}
//                         </div>
//                         </div>
//                     )}

//                     {/* Before Value (for deleted products) */}
//                     {selectedActivity.type === 5 && selectedActivity.metadata.beforeValue && typeof selectedActivity.metadata.beforeValue === 'object' && (
//                         <div className="space-y-2">
//                         <h4 className="font-semibold text-sm text-gray-700">Deleted Product Details</h4>
//                         <div className="p-3 bg-red-50 border border-red-200 rounded-lg space-y-2">
//                             {Object.entries(selectedActivity.metadata.beforeValue).map(([key, value]) => (
//                             <div key={key} className="flex justify-between">
//                                 <span className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
//                                 <span className="text-sm font-medium">
//                                 {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : 
//                                 typeof value === 'number' && key === 'price' ? `₱${value.toFixed(2)}` :
//                                 String(value)}
//                                 </span>
//                             </div>
//                             ))}
//                         </div>
//                         </div>
//                     )}

//                     {/* Before & After (for updated products with changes) - Show complete data */}
//                     {selectedActivity.type === 3 && selectedActivity.metadata.beforeValue && selectedActivity.metadata.afterValue && (
//                         <div className="space-y-2">
//                         <h4 className="font-semibold text-sm text-gray-700">Complete Product Comparison</h4>
//                         <div className="grid grid-cols-2 gap-4">
//                             {/* Before */}
//                             <div className="space-y-2">
//                             <p className="text-xs font-semibold text-gray-500 uppercase">Before Update</p>
//                             <div className="p-3 bg-red-50 border border-red-200 rounded-lg space-y-2">
//                                 {Object.entries(selectedActivity.metadata.beforeValue).map(([key, value]) => (
//                                 <div key={key} className="space-y-1">
//                                     <span className="text-xs text-gray-600 capitalize block">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
//                                     <span className="text-sm font-medium block">
//                                     {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : 
//                                     typeof value === 'number' && key === 'price' ? `₱${value.toFixed(2)}` :
//                                     typeof value === 'number' && key === 'stock' ? `${value} units` :
//                                     String(value)}
//                                     </span>
//                                 </div>
//                                 ))}
//                             </div>
//                             </div>
//                             {/* After */}
//                             <div className="space-y-2">
//                             <p className="text-xs font-semibold text-gray-500 uppercase">After Update</p>
//                             <div className="p-3 bg-green-50 border border-green-200 rounded-lg space-y-2">
//                                 {Object.entries(selectedActivity.metadata.afterValue).map(([key, value]) => (
//                                 <div key={key} className="space-y-1">
//                                     <span className="text-xs text-gray-600 capitalize block">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
//                                     <span className="text-sm font-medium block">
//                                     {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : 
//                                     typeof value === 'number' && key === 'price' ? `₱${value.toFixed(2)}` :
//                                     typeof value === 'number' && key === 'stock' ? `${value} units` :
//                                     String(value)}
//                                     </span>
//                                 </div>
//                                 ))}
//                             </div>
//                             </div>
//                         </div>
//                         </div>
//                     )}

//                     {/* Order Items */}
//                     {selectedActivity.metadata.items && Array.isArray(selectedActivity.metadata.items) && (
//                         <div className="space-y-2">
//                         <h4 className="font-semibold text-sm text-gray-700">Order Items</h4>
//                         <div className="border border-gray-200 rounded-lg overflow-hidden">
//                             <table className="w-full text-sm">
//                             <thead className="bg-gray-50">
//                                 <tr>
//                                 <th className="px-3 py-2 text-left">Item</th>
//                                 <th className="px-3 py-2 text-center">Qty</th>
//                                 <th className="px-3 py-2 text-right">Price</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {selectedActivity.metadata.items.map((item: any, idx: number) => (
//                                 <tr key={idx} className="border-t border-gray-200">
//                                     <td className="px-3 py-2">{item.name}</td>
//                                     <td className="px-3 py-2 text-center">{item.quantity}</td>
//                                     <td className="px-3 py-2 text-right font-mono">₱{item.price.toFixed(2)}</td>
//                                 </tr>
//                                 ))}
//                             </tbody>
//                             {selectedActivity.metadata.totalAmount && (
//                                 <tfoot className="bg-gray-50 border-t-2 border-gray-300">
//                                 <tr>
//                                     <td colSpan={2} className="px-3 py-2 font-semibold">Total</td>
//                                     <td className="px-3 py-2 text-right font-semibold font-mono">
//                                     ₱{selectedActivity.metadata.totalAmount.toFixed(2)}
//                                     </td>
//                                 </tr>
//                                 </tfoot>
//                             )}
//                             </table>
//                         </div>
//                         </div>
//                     )}

//                     {/* Additional Metadata */}
//                     {selectedActivity.metadata.customerName && (
//                         <div className="space-y-2">
//                         <h4 className="font-semibold text-sm text-gray-700">Customer Information</h4>
//                         <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-2">
//                             <div className="flex justify-between">
//                             <span className="text-sm text-gray-600">Customer Name:</span>
//                             <span className="text-sm font-medium">{selectedActivity.metadata.customerName}</span>
//                             </div>
//                             {selectedActivity.metadata.queueNumber && (
//                             <div className="flex justify-between">
//                                 <span className="text-sm text-gray-600">Queue Number:</span>
//                                 <Badge variant="outline">#{selectedActivity.metadata.queueNumber}</Badge>
//                             </div>
//                             )}
//                         </div>
//                         </div>
//                     )}

//                     {/* Category metadata */}
//                     {/* {selectedActivity.type.includes('category') && selectedActivity.metadata.totalCategories && (
//                         <div className="space-y-2">
//                         <h4 className="font-semibold text-sm text-gray-700">Category Statistics</h4>
//                         <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
//                             <div className="flex justify-between">
//                             <span className="text-sm text-gray-600">Total Categories:</span>
//                             <Badge variant="outline">{selectedActivity.metadata.totalCategories}</Badge>
//                             </div>
//                         </div>
//                         </div>
//                     )} */}

//                     {/* Category Lists (Before/After) */}
//                     {selectedActivity.type == 4 && selectedActivity.metadata.beforeValue && selectedActivity.metadata.afterValue && (
//                         <div className="space-y-2">
//                         <h4 className="font-semibold text-sm text-gray-700">Category Changes</h4>
//                         <div className="grid grid-cols-2 gap-4">
//                             <div className="space-y-2">
//                             <p className="text-xs font-semibold text-gray-500 uppercase">Before ({selectedActivity.metadata.beforeValue.count})</p>
//                             <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
//                                 <div className="flex flex-wrap gap-1">
//                                 {selectedActivity.metadata.beforeValue.categories.map((cat: string, idx: number) => (
//                                     <Badge key={idx} variant="outline" className={'bg-red-200 border-red-400'}>
//                                     {cat}
//                                     </Badge>
//                                 ))}
//                                 </div>
//                             </div>
//                             </div>
//                             <div className="space-y-2">
//                             <p className="text-xs font-semibold text-gray-500 uppercase">After ({selectedActivity.metadata.afterValue.count})</p>
//                             <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
//                                 <div className="flex flex-wrap gap-1">
//                                 {selectedActivity.metadata.afterValue.categories.map((cat: string, idx: number) => (
//                                     <Badge key={idx} variant="outline" className={'bg-green-200 border-green-400'}>
//                                     {cat}
//                                     </Badge>
//                                 ))}
//                                 </div>
//                             </div>
//                             </div>
//                         </div>
//                         </div>
//                     )}
//                     </div>
//                 )}

//                 {/* Footer */}
//                 <div className="flex justify-between pt-4 border-t">
//                     <div className="flex gap-2">
//                     {selectedActivity.type === 5 && selectedActivity.metadata?.beforeValue && (
//                         <Button variant="outline" className="bg-green-50 hover:bg-green-100 text-green-700 border-green-300"
//                             onClick={() => handleRestoreProduct(selectedActivity)}>
//                         <RotateCcw className="h-4 w-4 mr-2" /> Restore Product </Button>
//                     )}
//                     {selectedActivity.type === 6 && selectedActivity.metadata?.category && (
//                         <Button variant="outline" className="bg-green-50 hover:bg-green-100 text-green-700 border-green-300"
//                             onClick={() => handleRestoreCategory(selectedActivity)}>
//                         <RotateCcw className="h-4 w-4 mr-2" /> Restore Category </Button>
//                     )}
//                     </div>
//                     <Button onClick={() => setIsActivityDetailOpen(false)}>
//                         Close </Button>
//                 </div>
//                 </div>
//             )}
//             </DialogContent>
//         </Dialog>
//     );
// }