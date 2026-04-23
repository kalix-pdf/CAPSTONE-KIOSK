import USB from '@node-escpos/usb-adapter';
import Printer from '@node-escpos/core';

export async function printReceipt(req, res) {
  const { QueueNumber, orderItems, totalAmount } = req.body;

  if (!QueueNumber || !orderItems || totalAmount === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  let device;

  try{
    device = new USB(4070, 33054);

    await new Promise((resolve, reject) => {
      device.open((err) => {
        if (err) return reject(err);
        resolve();
      });
    });
   
    const printer = new Printer(device, { encoding: 'GB18030' });

    const divider = "--------------------------------";
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-PH", {
      year: "numeric", month: "short", day: "numeric"
    });
    const timeStr = now.toLocaleTimeString("en-PH", {
      hour: "2-digit", minute: "2-digit"
    });

    let orderLines = "";
    for (const item of orderItems) {
      // Guard against undefined fields
      const rawName = item.item_name ?? item.itemName ?? item.item_name ?? "Unknown Item";
      const rawQty  = item.quantity ?? item.qty ?? 1;
      const rawPrice = item.total_amount ?? item.unitPrice ?? 0;

      const name  = String(rawName).padEnd(18).slice(0, 20);
      const qty   = `x${rawQty}`.padStart(2);
      const price = `P${(Number(rawPrice) * Number(rawQty)).toFixed(2)}`.padStart(9);
      orderLines += `${name}${qty}${price}\n`;
    }

    await printer
      .align("ct")
      .text("MCEC PHARMACY")
      .text("Brgy. H2, Dasmarinas City, Cavite")
      .text(`${dateStr}  ${timeStr}`)
      .text(divider)
      .align("ct")
      .text(`QUEUE NUMBER`)
      .size(2, 2)
      .text(`#${QueueNumber}`)
      .size(1, 1)
      .text(divider)
      .align("lt")
      .text("ITEM              QTY    PRICE")
      .text(divider)
      .text(orderLines.trimEnd())
      .text(divider)
      .align("rt")
      .text(`TOTAL:  P${Number(totalAmount).toFixed(2)}`)
      .text(divider)
      .align("ct")
      .text("Thank you for your order!")
      .text("Please wait for your queue number")
      .text("to be called.")
      .cut()
      .flush();

    res.status(200).json({ success: true, message: "Print success" });

  } catch(error){
    console.error("Print error:", err);
    res.status(500).json({ error: "Failed to print receipt", details: err.message });

  } finally {
    if (device) {
      await new Promise((resolve) => device.close(resolve));
    }
  }
}