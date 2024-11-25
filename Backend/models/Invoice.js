const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    invoiceNumber: { type: String, required: true, unique: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    items: [
        {
            productName: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
        },
    ],
    taxRate: { type: Number, default: 20 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    date: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    notes: { type: String },
    paymentMethod: { type: String, enum: ['credit_card', 'bank_transfer', 'paypal'] },
    status: { type: String, enum: ['Envoyée', 'Payée', 'En retard', 'Annulée'], default: 'Envoyée' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Invoice', invoiceSchema);
