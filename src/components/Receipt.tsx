import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface ReceiptProps {
  isOpen: boolean;
  onClose: () => void;
  orderDetails: {
    orderId: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
      total: number;
    }>;
    subtotal: number;
    tax: number;
    total: number;
    cashier: string;
    date: string;
  };
}

const Receipt = ({ isOpen, onClose, orderDetails }: ReceiptProps) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white p-6">
        <div className="print:p-4" id="receipt">
          {/* Header */}
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold tracking-wider mb-1">PETROCAM</h1>
            <p className="text-sm text-gray-600">Petroleum Trading - Energy in Motion</p>
            <div className="text-sm text-gray-600 mt-2">
              <p>Receipt #{orderDetails.orderId}</p>
              <p>Date: {orderDetails.date}</p>
              <p>Cashier: {orderDetails.cashier}</p>
            </div>
          </div>

          {/* Items */}
          <div className="border-t border-b border-gray-200 py-4 my-4">
            <table className="w-full">
              <thead>
                <tr className="text-sm text-gray-600">
                  <th className="text-left">Item</th>
                  <th className="text-right">Qty</th>
                  <th className="text-right">Price</th>
                  <th className="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.items.map((item, index) => (
                  <tr key={index} className="text-sm">
                    <td className="py-1">{item.name}</td>
                    <td className="text-right">{item.quantity}</td>
                    <td className="text-right">₦{item.price.toFixed(2)}</td>
                    <td className="text-right">₦{item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₦{orderDetails.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (7.5%)</span>
              <span>₦{orderDetails.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-base">
              <span>Total</span>
              <span>₦{orderDetails.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6 text-sm text-gray-600">
            <p>Thanks for your patronage!</p>
            <div className="mt-2">
              <svg 
                className="mx-auto"
                width="200"
                height="40"
                viewBox="0 0 200 40"
              >
                {/* Placeholder for barcode - rendered as a black rectangle */}
                <rect x="0" y="0" width="200" height="40" fill="black" />
              </svg>
              <p className="mt-1">{orderDetails.orderId}</p>
            </div>
          </div>
        </div>

        {/* Print Button - only visible on screen, not when printing */}
        <div className="mt-4 flex justify-center print:hidden">
          <Button onClick={handlePrint} className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Print Receipt
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Receipt;