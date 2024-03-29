const PDFGenerator = require("pdfkit");
const fs = require("fs");

class InvoiceGenerator {
  constructor(invoice) {
    this.invoice = invoice;
  }

  generateHeaders(doc) {
    const billingAddress = this.invoice.addresses.billing;

    doc
      .image("./uuuyyy.jpg", 0, 0, { width: 150 })
      .fillColor("#000")
      .fontSize(20)
      .text("INVOICE", 275, 50, { align: "right" })
      .fontSize(10)
      .text(`Invoice Numbers: ${this.invoice.invoiceNumber}`, {
        align: "right",
      })
      .text(`Due: ${this.invoice.dueDate}`, { align: "right" })
      .text(`Balance Due: $${this.invoice.subtotal - this.invoice.paid}`, {
        align: "right",
      })
      .moveDown()
      .text(
        `Billing Address:\n ${billingAddress.name}\n${billingAddress.address}\n${billingAddress.city}\n${billingAddress.state},${billingAddress.country}, ${billingAddress.postalCode}`,
        { align: "right" }
      );

    const beginningOfPage = 50;
    const endOfPage = 550;

    doc.moveTo(beginningOfPage, 200).lineTo(endOfPage, 200).stroke();

    doc.text(`Memo: ${this.invoice.memo || "N/A"}`, 50, 210);

    doc.moveTo(beginningOfPage, 250).lineTo(endOfPage, 250).stroke();
  }

  generateTable(doc) {
    const tableTop = 270;
    const itemCodeX = 50;
    const descriptionX = 100;
    const quantityX = 250;
    const priceX = 300;
    const amountX = 350;

    doc
      .fontSize(10)
      .text("Item Code", itemCodeX, tableTop, { bold: true })
      .text("Description", descriptionX, tableTop)
      .text("Quantity", quantityX, tableTop)
      .text("Price", priceX, tableTop)
      .text("Amount", amountX, tableTop);

    const items = this.invoice.items;
    let i = 0;

    for (i = 0; i < items.length; i++) {
      const item = items[i];
      const y = tableTop + 35 + i * 35;

      doc
        .fontSize(10)
        .text(item.itemCode, itemCodeX, y)
        .text(item.description, descriptionX, y)
        .text(item.quantity, quantityX, y)
        .text(`$ ${item.price}`, priceX, y)
        .text(`$ ${item.amount}`, amountX, y);
    }
  }

  generateFooter(doc) {
    doc.fontSize(10).text(`Payment due upon receipt. `, 50, 700, {
      align: "center",
    });
  }

  generate() {
    let theOutput = new PDFGenerator();

    console.log(this.invoice);

    const fileName = `Invoice ${this.invoice.invoiceNumber}.pdf`;

    // pipe to a writable stream which would save the result into the same directory
    theOutput.pipe(fs.createWriteStream(fileName));

    this.generateHeaders(theOutput);

    theOutput.moveDown();

    this.generateTable(theOutput);

    this.generateFooter(theOutput);

    // write out file
    theOutput.end();
  }
}

const invoiceData = {
  addresses: {
    shipping: {
      name: "John Doe",
      address: "2400 Fulton Street",
      city: "San Francisco",
      state: "CA",
      country: "US",
      postalCode: 94118,
    },
    billing: {
      name: "John Doe",
      address: "2400 Fulton Street",
      city: "San Francisco",
      state: "CA",
      country: "US",
      postalCode: 94118,
    },
  },
  memo: "As discussed",
  items: [
    {
      itemCode: 12341,
      description: "Laptop Computer",
      quantity: 2,
      price: 3000,
      amount: 6000,
    },
    {
      itemCode: 12342,
      description: "Printer",
      quantity: 1,
      price: 2000,
      amount: 2000,
    },
  ],
  subtotal: 8000,
  paid: 0,
  invoiceNumber: 1234,
  dueDate: "Feburary 02, 2021",
};

const ig = new InvoiceGenerator(invoiceData);
ig.generate();
