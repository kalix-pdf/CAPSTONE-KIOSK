import { CartItem } from "./GlobalCart";
import { CreateOrder } from "../../../services/order.api";
import { QueueTicketProps } from "../order/QueueTicketProps";
import { AIResponse } from "../../../services/Props";

export interface CheckoutProps {
    item_name: string;
    quantity: number;
    product_id: number;
    total_amount: number;
}

export const handleCheckout = async (cart: CartItem[], phoneNumber: string, scannedID?: number, extractedText?: AIResponse['extractedText']): Promise<QueueTicketProps> => {
    if (await validateCheckout(cart, phoneNumber)) {
        throw new Error("Validation failed. Please check your inputs.");
    }
    
    const order_items: CheckoutProps[] = cart.map(item => ({ item_name: item.name, quantity: item.quantity, total_amount: item.total_amount, product_id: item.id }));
    const total_amount = cart.reduce((sum, item) => sum + item.total_amount, 0);

     try {
        const result = await CreateOrder(order_items, phoneNumber, total_amount, scannedID, extractedText);

        if (!result) {
            throw new Error("Failed to create order. Please try again.");
        }

        return {
            QueueNumber: result.QueueNumber,
            phoneNumber: phoneNumber,
            orderID: result.orderId,
            orderItems: order_items,
            totalAmount: total_amount
        };
        
    } catch (error) {
        throw error;
    } 
}

function validateCheckout(cart: CartItem[], phoneNumber: string, prescriptionData?: any[]): Promise<any> {
    
    if (phoneNumber.trim() !== "") {
        const cleanNumber = phoneNumber.replace(/\D/g, '');
        if (cleanNumber.length !== 12 || !cleanNumber.startsWith("639")) {
            return Promise.reject(new Error("Invalid phone number. Please enter a valid mobile number starting with +639."));
        }
    }

    // Check stock availability
    const lowStockItems: string[] = [];
    
    cart.forEach(item => {
    const product = cart.find(p => p.id === item.id);
        if (product) {
            if (product.quantity < item.quantity) {
                lowStockItems.push(`${item.name} (only ${product.quantity} available)`);
            }
        }
    });

    if (lowStockItems.length > 0) {
        return Promise.reject(new Error(`Low stock: ${lowStockItems.join(", ")}`));
    }

    return Promise.resolve();
}


    // if (onCreateOrder) {
        // const ticket = onCreateOrder(cart, phoneNumber);
      // Add prescription data if available
            // if (currentPrescriptionData) {
            //     (await ticket).prescriptionData = {
            //     scannedImageUrl: currentPrescriptionData.scannedImageUrl,
            //     extractedText: currentPrescriptionData.extractedText,
            //     medications: currentPrescriptionData.medications.map(med => ({
            //         id: med.id,
            //         name: med.name,
            //         dosage: med.dosage,
            //         quantity: cart.find(item => item.id === med.id)?.quantity || 1,
            //         price: med.price
            //     })),
            //     scanDate: currentPrescriptionData.scanDate
            //     };
            // }

      // Add all order items with stock status
            // (await
            //     // Add all order items with stock status
            //     ticket).orderItems = cart.map(item => {
            //     const product = products.find(p => p.id === item.id);
            //     return {
            //     id: item.id,
            //     name: item.name,
            //     dosage: item.dosage,
            //     quantity: item.quantity,
            //     price: item.price,
            //     availableStock: product?.stock || 0,
            //     isOutOfStock: product?.stock === 0,
            //     isLowStock: product ? product.stock < item.quantity : false
            //     };
            // });
            
            // setOrderTicket(await ticket);
            // setShowTicketDialog(true);
      
      // Clear cart and prescription data
            // setCart([]);
            // setPhoneNumber("");
            // setCurrentPrescriptionData(null);
            // setIsCartOpen(false);
        // }
    // };