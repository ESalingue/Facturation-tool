const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Client', clientSchema);
