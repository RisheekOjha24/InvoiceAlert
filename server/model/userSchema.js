const mongoose = require("mongoose");

// Invoice schema
const invoiceSchema = new mongoose.Schema({
  recipient: { type: String, required: true },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

// User schema with invoices embedded
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  invoices: [invoiceSchema], // Embedding invoices as an array
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
