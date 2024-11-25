const express = require('express');
const Client = require('../models/Client');
const router = express.Router();

// Obtenir tous les clients
router.get('/', async (req, res) => {
    try {
        const clients = await Client.find();
        res.json(clients);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ajouter un client
router.post('/', async (req, res) => {
    try {
        const client = new Client(req.body);
        await client.save();
        res.status(201).json(client);
    } catch (err) {
        console.error('Erreur serveur:', err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
