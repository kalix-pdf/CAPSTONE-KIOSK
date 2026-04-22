import escpos from 'escpos';
import escposUSB from 'escpos-usb';

escpos.USB = escposUSB;

export async function printReceipt() {
  const printers = escposUSB.findPrinter();

  if (!printers || printers.length === 0) {
    throw new Error("No USB printer detected. Check driver and connection.");
  }

  const device = new escpos.USB();
  const printer = new escpos.Printer(device);

  return new Promise((resolve, reject) => {
    device.open((err) => {
      if (err) return reject(err);

      printer
        .text("TEST PRINT")
        .cut()
        .close();

      resolve();
    });
  });
}