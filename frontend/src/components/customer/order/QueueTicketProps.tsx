import { CheckoutProps } from "../cart/checkout";

export interface QueueTicketProps {
  QueueNumber: number;
  phoneNumber?: string;
  orderID: number;
  totalAmount: number;
  orderItems: CheckoutProps[];
  // prescriptionData?: PrescriptionData;

}