import { keyboardActivate } from "../common/keyboard";
import { OnScreenKeyboard } from "../common/OnScreenKeyboard";
import { getTextSizeClass } from "../common/textSize";
import { toast } from "sonner";
import { Card, CardContent } from "../../ui/card";
import { AlertTriangle, MessageSquare, Minus, Phone, Plus, ShoppingCart, Ticket, Trash2 } from "lucide-react";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Separator } from "../../ui/separator";
import { Input } from "../../ui/input";
import { handleCheckout } from "./checkout";
import { useCart } from "./GlobalCart";
import { useState } from "react";
import { QueueTicketProps } from "../order/QueueTicketProps";
import { QueueTicket } from "../order/QueueTicket";

export const Cart = () => {
    const { showKeyboard, setShowKeyboard, keyboardField, setKeyboardField, keyboardValue, setKeyboardValue } = keyboardActivate();
    const { cart, removeFromCart, updateQuantity, clearCart, scannedID, extractedText } = useCart();
    const [ticketData, setTicketData] = useState<QueueTicketProps | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [phoneNumber] = useState("");

    const handlequantity = (productId: number, change: number) => {
        const item = cart.find(i => i.id === productId);
        if (!item) return;

        if (item.quantity + change <= 0) {
            removeFromCart(productId);
        } else {
            updateQuantity(productId, item.quantity + change);
        }
    };

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getTotalItems = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    return (
        <>
        <div className="mt-8 space-y-6">
            {cart.length > 0 ? (
            <>
            <div className="space-y-4">
                    {cart.map((item) => {
                        const stock = item?.stock || 0;
                        const isOutOfStock = stock === 0;
                        const isLowStock = stock < item.quantity && stock > 0;

                        return (
                            <Card key={item.id} className={`border-2 ${isOutOfStock ? "border-red-400 bg-red-50" : isLowStock
                                    ? "border-yellow-400 bg-yellow-50"
                                    : "border-blue-200"}`}>
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h4 className="text-lg text-gray-900 font-bold">
                                                    {item.name}
                                                </h4>

                                                {isOutOfStock && (
                                                    <Badge variant="destructive" className="text-sm px-3 py-1">
                                                        Out of Stock </Badge>)}

                                                {isLowStock && (
                                                    <Badge variant="outline" className="text-sm px-3 py-1 bg-yellow-100 text-yellow-800 border-yellow-400">
                                                        Only {stock} available</Badge>)}

                                                <Badge variant="outline" className={`text-sm px-3 py-1 font-semibold ${item.type === 1
                                                        ? "bg-purple-50 text-purple-700 border-purple-300"
                                                        : "bg-amber-50 text-amber-700 border-amber-300"}`}> {item.type === 1 ? "Branded" : "Generic"}
                                                    {/* {item.type === 0 ? t.branded : t.generic} */}</Badge>
                                            </div>

                                            <p className="text-sm text-gray-600 mt-1"> {item.dosage} </p>

                                            <p className="text-base text-gray-900 font-semibold mt-2"> ₱
                                                {item.price.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2, })}{" "} each
                                            </p>

                                            {isOutOfStock && (
                                                <p className="text-red-700 text-sm mt-2 flex items-center gap-1 font-semibold">
                                                    <AlertTriangle className="h-4 w-4" /> Remove this item to checkout </p>)}

                                            {isLowStock && (
                                                <p className="text-yellow-700 text-sm mt-2 flex items-center gap-1 font-semibold">
                                                    <AlertTriangle className="h-4 w-4" /> Reduce quantity to {stock} or less
                                                </p>)}
                                        </div>

                                        <Button size="sm" variant="ghost" onClick={() => removeFromCart(item.id)}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-100"> <Trash2 className="h-5 w-5" /> </Button>
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center gap-3">
                                            <Button size="sm" variant="outline" onClick={() => handlequantity(item.id, -1)}
                                                className="h-10 w-10"> <Minus className="h-4 w-4" /> </Button>
                                            <span className={`w-12 text-center text-xl font-bold ${isLowStock ? "text-yellow-900" : "text-gray-900"}`}>
                                                {item.quantity} </span>

                                            <Button size="sm" variant="outline" onClick={() => handlequantity(item.id, 1)}
                                                disabled={stock <= item.quantity} className="h-10 w-10"> <Plus className="h-4 w-4" /> </Button>
                                        </div>

                                        <div className="text-xl text-blue-600 font-bold">
                                            ₱ {(item.price * item.quantity).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2, })}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
                <Separator className="my-4" />
            {/* {t.totalItems} */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-2 border-blue-300 space-y-2">
                <div className="flex justify-between items-center">
                <span className={`${getTextSizeClass("text-base")} font-semibold text-gray-900`}>Total Items</span> 
                <span className={`${getTextSizeClass("text-xl")} font-bold text-blue-600`}>{getTotalItems()}</span>
                </div>
                <div className="flex justify-between items-center">
                <span className={`${getTextSizeClass("text-base")} font-semibold text-gray-900`}>Total Price</span>
                <span className={`${getTextSizeClass("text-2xl")} font-bold text-blue-600`}>₱{getTotalPrice().toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <h3 className="text-blue-900 font-bold text-xl flex items-center gap-2">
                <MessageSquare className="h-6 w-6" /> SMS sent Notificaiton </h3>
                <p className="text-blue-700 text-sm mt-1"> Optional: Enter your mobile number to get notified when your queue number is ready </p>
            </div>

            {/* {t.customerName} */}

            {/* <div className="space-y-2">
                <Label htmlFor="customerName" className={`text-gray-900 font-bold ${getTextSizeClass("text-base")} block`}> </Label>
                <Input id="customerName" value="Your Name" readOnly
                    onClick={() => { setKeyboardField("name"); setKeyboardValue(""); setShowKeyboard(true);
                }} className={`border-2 border-blue-300 focus:border-blue-500 bg-white ${getTextSizeClass("text-lg")} py-3 px-4 rounded-lg cursor-pointer`} />
            </div> */}

            {/* {t.phoneNumber} */}

            <div className="space-y-2">
                <div className="relative"> <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-600" />
                    <Input id="phoneNumber" type="tel" placeholder="+63 XXX XXX XXXX" value={keyboardField === "phone" ? keyboardValue : phoneNumber}
                        readOnly onClick={() => { setKeyboardField("phone"); setKeyboardValue(phoneNumber);
                        setShowKeyboard(true); } } className={`border-2 border-blue-300 focus:border-blue-500 bg-white ${getTextSizeClass("text-lg")} py-3 pl-12 pr-4 rounded-lg cursor-pointer`} />
                </div>
                <div className="bg-yellow-50 border border-yellow-300 p-3 rounded-lg">
                    <p className="text-yellow-900 text-sm flex items-center gap-2 font-semibold">
                        <MessageSquare className="h-4 w-4" /> You'll receive your queue number via SMS </p>
                </div>
            </div>
            
            {cart.some(item => { const product = cart.find(p => p.id === item.id);
                return product?.quantity === 0; }) && (
            <div className="bg-red-50 border-2 border-red-300 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div> <p className="text-red-900">
                        <strong>Cannot Checkout</strong> </p>
                        <p className="text-red-700 text-sm mt-1">
                            Your cart contains out-of-stock items. Please remove them before proceeding. </p>
                    </div>
                </div>
            </div>
            )}
            
            {/* speak(t.orderAndGetQueue); */}
            {/* {t.orderAndGetQueue} */}
            <Button onClick={async () => { try { setIsLoading(true);
                const ticketData = await handleCheckout(cart, keyboardValue, scannedID, extractedText);
                setTicketData(ticketData);
                clearCart(); } catch (error) { 
                    toast.error(error instanceof Error ? error.message : "Checkout failed please try again later"); } }} 
                className={`w-full ${getTextSizeClass("text-base")}`}
                size="lg" disabled={ cart.length === 0 ||  cart.some(item => {
                const product = cart.find(p => p.id === item.id);
                return product?.quantity === 0; })} > <Ticket className="h-5 w-5 mr-2" /> Place Order
            </Button>
        </>) : (
            <div className="text-center py-12">
                <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Your cart is empty</p>
                <p className="text-gray-500 mt-2">Add medications to get started</p>
            </div>
        )
    }
        </div>
        <OnScreenKeyboard isOpen={showKeyboard}
            onClose={() => {
                setShowKeyboard(false);
            }}
            onInput={(value) => setKeyboardValue(value)}
            initialValue={keyboardValue}
            title="Enter Phone Number"
            type="tel" />

        {ticketData && (
            <QueueTicket
                QueueNumber={ticketData.QueueNumber}
                phoneNumber={ticketData.phoneNumber}
                // orderID={ticketData.orderID}
                orderItems={ticketData.orderItems}
                totalAmount={ticketData.totalAmount}
                />
        )}
    </>
    );
    
}

