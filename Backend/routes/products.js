const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Obtenir tous les produits
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ajouter un produit
router.post('/', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        console.error('Erreur lors de la création du produit:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// Supprimer un produit (optionnel)
router.delete('/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Produit supprimé avec succès' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
