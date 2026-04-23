import { MessageSquare, Ticket } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../ui/dialog";
import { QueueTicketProps } from "./QueueTicketProps";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PrintReceipt } from "../../../services/order.api";

export const QueueTicket = ({ QueueNumber, phoneNumber, orderItems, totalAmount }: QueueTicketProps) => {
  const [showTicketDialog, setShowTicketDialog] = useState(true);
  const [countdown, setCountdown] = useState(8);
  const navigate = useNavigate();

  useEffect(() => {
    const print = async () => {
      try {
        await PrintReceipt({ QueueNumber, phoneNumber, orderItems, totalAmount });
      } catch (err) {
        console.error("Failed to print receipt:", err);
      }
    };

    print();
  }, []);

    useEffect(() => {
      if (!showTicketDialog) return;

      if (countdown === 0) {
        navigate("/", { replace: true });
        return;
      }

      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }, [countdown, showTicketDialog]);

  return (
    <div>
      <Dialog open={showTicketDialog} onOpenChange={setShowTicketDialog}>
          <DialogContent className="max-w-md" hideCloseButton={true}>
            {orderItems && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-center">Order Confirmed!</DialogTitle>
                  <DialogDescription className="text-center">
                    Your queue number for prescription pickup
                    <span className="block text-yellow-900 font-semibold">
                        Auto-Close in <span className="text-2xl font-bold">{countdown}</span> seconds...
                    </span>
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-2 py-2">
                  <div className="bg-green-50 border-2 border-green-500 rounded-lg p-8 text-center">
                    <Ticket className="h-12 w-12 mx-auto text-green-600 mb-4" />
                    <p className="text-gray-600 mb-2">Your Queue Number</p>
                    <div className="text-6xl font-bold text-green-600 mb-4">
                      #{QueueNumber}
                    </div>
                    <div className="mt-4 space-y-2">
                    {orderItems.map((item, index) => (
                      <div key={index} className="text-gray-900">
                        <p className="text-lg font-semibold">{item.item_name}</p>
                        <p className="text-sm text-gray-600 font-semibold">
                          Quantity: {item.quantity} | Total: ₱{item.total_amount.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                  </div>

                  <div className="space-y-2 text-gray-600">
                    <p className="flex items-center justify-between">
                      <span>Total:</span>
                      <span className="text-gray-900">{totalAmount}</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>Estimated Wait:</span>
                      <span className="text-gray-900">5-10 minutes</span>
                    </p>
                    {phoneNumber && (
                      <p className="flex items-center justify-between">
                        <span>Phone:</span>
                        <span className="text-gray-900">{phoneNumber}</span>
                      </p>
                    )}
                  </div>

                  {phoneNumber && (
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-green-900">
                        <MessageSquare className="h-5 w-5" />
                        <p>
                          <strong>SMS Sent!</strong> Your queue number has been sent to {phoneNumber}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <p className="text-blue-900">
                      ℹ️ Please wait in the designated area. Your number will be called on the display screen.
                    </p>
                  </div>
                  {/* <Button onClick={() => setShowTicketDialog(false)} className="w-full"
                    size="lg" > Close </Button> */}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog> 
    </div>
  );
}

