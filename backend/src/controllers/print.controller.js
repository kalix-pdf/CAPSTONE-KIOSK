import escpos from 'escpos';
import escposUSB from 'escpos-usb';

escpos.USB = escposUSB;

const device = new escpos.USB(); // auto-detects your USB printer
const printer = new escpos.Printer(device);

device.open(() => {
  printer
    .text("TEST PRINT")
    .cut()
    .close();
});