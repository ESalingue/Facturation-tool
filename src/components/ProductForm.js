import React, { useState } from 'react';
import API from '../api/api';

const ProductForm = () => {
    const [formData, setFormData] = useState({ name: '', description: '', price: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/products', formData);
            alert('Produit créé avec succès');
            setFormData({ name: '', description: '', price: '' }); // Réinitialise le formulaire
        } catch (err) {
            console.error('Erreur lors de la création du produit:', err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h2>Créer un produit</h2>
            <div>
                <label>Nom du produit :</label>
                <input
                    type="text"
                    placeholder="Nom du produit"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />
            </div>
            <div>
                <label>Description :</label>
                <textarea
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
            </div>
            <div>
                <label>Prix :</label>
                <input
                    type="number"
                    placeholder="Prix"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    min="0"
                    step="0.01"
                    required
                />
            </div>
            <button type="submit">Ajouter le produit</button>
        </form>
    );
};

export default ProductForm;
