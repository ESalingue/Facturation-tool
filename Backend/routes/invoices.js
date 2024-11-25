const express = require('express');
const Invoice = require('../models/Invoice');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
const router = express.Router();

// Obtenir toutes les factures
router.get('/', async (req, res) => {
    try {
        console.log('Requête pour récupérer les factures...');
        const invoices = await Invoice.find().populate('client');
        console.log('Factures récupérées :', invoices);
        res.json(invoices);
    } catch (err) {
        console.error('Erreur lors de la récupération des factures :', err.message);
        res.status(500).json({ error: err.message });
    }
});

// Créer une nouvelle facture
router.post('/', async (req, res) => {
    try {
        const { items, taxRate, discount } = req.body;

        // Calculer le total
        const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const discountAmount = (subtotal * discount) / 100;
        const tax = ((subtotal - discountAmount) * taxRate) / 100;
        const total = subtotal - discountAmount + tax;

        const invoice = new Invoice({
            ...req.body,
            total,
        });

        await invoice.save();
        res.status(201).json(invoice);
    } catch (err) {
        console.error('Erreur lors de la création de la facture:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// Modifier le statut d'une facture
router.put('/:id/status', async (req, res) => {
    const { status } = req.body;

    if (!['Envoyée', 'Payée', 'En retard', 'Annulée'].includes(status)) {
        return res.status(400).json({ error: 'Statut invalide' });
    }

    try {
        const invoice = await Invoice.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!invoice) {
            return res.status(404).json({ error: 'Facture non trouvée' });
        }
        res.json(invoice);
    } catch (err) {
        console.error('Erreur lors de la mise à jour du statut :', err.message);
        res.status(500).json({ error: err.message });
    }
});

// Générer un PDF pour une facture
router.get('/:id/pdf', async (req, res) => {
    try {
        const invoice = await Invoice.find
            .findById(req.params.id)
            .populate('client');

        if (!invoice) {
            return res.status(404).json({ error: 'Facture non trouvée' });
        }

        // Créer un PDF
        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=facture-${invoice.invoiceNumber}.pdf`);

        doc.pipe(res);

        // Contenu du PDF
        doc.fontSize(18).text(`Facture: ${invoice.invoiceNumber}`, { align: 'center' });
        doc.fontSize(14).text(`Client: ${invoice.client?.name || 'Inconnu'}`);
        doc.text(`Date: ${new Date(invoice.date).toLocaleDateString()}`);
        doc.text(`Date d'échéance: ${new Date(invoice.dueDate).toLocaleDateString()}`);
        doc.text('-------------------------------------------');

        invoice.items.forEach((item) => {
            doc.text(`${item.productName} - ${item.quantity} x ${item.price} €`);
        });

        doc.text('-------------------------------------------');
        doc.text(`Sous-total: ${invoice.total} €`);
        doc.text(`Taxe (${invoice.taxRate}%): ${(invoice.total * (invoice.taxRate / 100)).toFixed(2)} €`);
        doc.text(`Total: ${(invoice.total + (invoice.total * (invoice.taxRate / 100))).toFixed(2)} €`);
        doc.end();
    } catch (err) {
        console.error('Erreur lors de la génération du PDF :', err.message);
        res.status(500).json({ error: err.message });
    }
});

// Envoyer la facture par email
router.post('/:id/email', async (req, res) => {
    const { email } = req.body;

    try {
        const invoice = await Invoice.findById(req.params.id).populate('client');
        if (!invoice) {
            return res.status(404).json({ error: 'Facture non trouvée' });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const doc = new PDFDocument();
        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', async () => {
            const pdfData = Buffer.concat(buffers);

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: `Facture ${invoice.invoiceNumber}`,
                text: `Veuillez trouver ci-joint la facture ${invoice.invoiceNumber}.`,
                attachments: [
                    {
                        filename: `facture-${invoice.invoiceNumber}.pdf`,
                        content: pdfData,
                    },
                ],
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Erreur lors de l\'envoi de l\'email :', error);
                    return res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'email.' });
                }
                res.json({ message: 'Facture envoyée avec succès.' });
            });
        });

        doc.fontSize(18).text(`Facture: ${invoice.invoiceNumber}`, { align: 'center' });
        // Contenu du PDF (comme précédemment)
        doc.end();
    } catch (err) {
        console.error('Erreur lors de l\'envoi de la facture :', err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
