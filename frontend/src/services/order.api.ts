import { CheckoutProps } from "../components/customer/cart/checkout";
import { QueueTicketProps } from "../components/customer/order/QueueTicketProps";
import { AIResponse } from "./Props";
import { API_URL } from "./url.api";

export const CreateOrder = async ( cart: CheckoutProps[], phone_number: string, total_amount: number, scannedID?: number, extractedText?: AIResponse['extractedText']): Promise<any> => {
  const response = await fetch(`${API_URL}/api/order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: cart,
      phone_number,              
      total_amount,
      scannedID,
      extractedText
    }),
  });

  const data = await response.json(); 

  if (!response.ok) {
    throw new Error(data.error || data.message || "Failed to create order");
  }

  return data;
};

export const PrintReceipt = async({QueueNumber, phoneNumber, orderItems, totalAmount}: QueueTicketProps) => {
  const response = await fetch(`${API_URL}/api/print`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      QueueNumber,
      orderItems,
      totalAmount
    }),
  });

  const data = await response.json(); 

  if (!response.ok) {
    throw new Error(data.error || data.message || "Failed to create order");
  }

  return data;
}