import React, { useState, useEffect } from 'react';
import API from '../api/api';

const InvoiceForm = () => {
    const [clients, setClients] = useState([]);
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        client: '',
        invoiceNumber: '',
        date: '',
        dueDate: '',
        items: [],
        taxRate: 20,
        discount: 0,
        notes: '',
        paymentMethod: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [clientRes, productRes] = await Promise.all([
                    API.get('/clients'),
                    API.get('/products'),
                ]);
                setClients(clientRes.data);
                setProducts(productRes.data);
            } catch (err) {
                console.error('Erreur lors de la récupération des données:', err.message);
            }
        };

        fetchData();
    }, []);

    const handleAddItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { productName: '', price: 0, quantity: 1 }],
        });
    };

    const handleRemoveItem = (index) => {
        const items = [...formData.items];
        items.splice(index, 1);
        setFormData({ ...formData, items });
    };

    const calculateTotal = () => {
        const subtotal = formData.items.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );

        const discount = (subtotal * formData.discount) / 100;
        const tax = ((subtotal - discount) * formData.taxRate) / 100;

        return {
            subtotal,
            discount,
            tax,
            total: subtotal - discount + tax,
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const invoiceData = { ...formData, totals: calculateTotal() };
            await API.post('/invoices', invoiceData);
            alert('Facture créée avec succès');
            setFormData({
                client: '',
                invoiceNumber: '',
                date: '',
                dueDate: '',
                items: [],
                taxRate: 20,
                discount: 0,
                notes: '',
                paymentMethod: '',
            }); // Réinitialise le formulaire
        } catch (err) {
            console.error('Erreur lors de la création de la facture:', err.message);
        }
    };

    const totals = calculateTotal();

    return (
        <form onSubmit={handleSubmit} style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2>Créer une facture</h2>

            <div>
                <label>Numéro de facture :</label>
                <input
                    type="text"
                    placeholder="Ex. INV-001"
                    value={formData.invoiceNumber}
                    onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                    required
                />
            </div>

            <div>
                <label>Date :</label>
                <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                />
            </div>

            <div>
                <label>Date d'échéance :</label>
                <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    required
                />
            </div>

            <div>
                <label>Client :</label>
                <select
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    required
                >
                    <option value="">Sélectionnez un client</option>
                    {clients.map((client) => (
                        <option key={client._id} value={client._id}>
                            {client.name}
                        </option>
                    ))}
                </select>
            </div>

            <h3>Produits/Services</h3>
            {formData.items.map((item, index) => (
                <div key={index} style={{ marginBottom: '10px', display: 'flex', gap: '10px' }}>
                    <select
                        value={item.productName}
                        onChange={(e) => {
                            const product = products.find((p) => p.name === e.target.value);
                            const items = [...formData.items];
                            items[index] = {
                                productName: product.name,
                                price: product.price,
                                quantity: item.quantity,
                            };
                            setFormData({ ...formData, items });
                        }}
                        required
                    >
                        <option value="">Sélectionnez un produit</option>
                        {products.map((product) => (
                            <option key={product._id} value={product.name}>
                                {product.name} - {product.price} €
                            </option>
                        ))}
                    </select>
                    <input
                        type="number"
                        placeholder="Quantité"
                        value={item.quantity}
                        onChange={(e) => {
                            const items = [...formData.items];
                            items[index].quantity = e.target.value;
                            setFormData({ ...formData, items });
                        }}
                        min="1"
                        required
                    />
                    <button type="button" onClick={() => handleRemoveItem(index)}>
                        Supprimer
                    </button>
                </div>
            ))}
            <button type="button" onClick={handleAddItem}>
                Ajouter un produit/service
            </button>

            <div>
                <label>Taxe (%) :</label>
                <input
                    type="number"
                    placeholder="Ex. 20"
                    value={formData.taxRate}
                    onChange={(e) => setFormData({ ...formData, taxRate: e.target.value })}
                    min="0"
                    required
                />
            </div>

            <div>
                <label>Remise (%) :</label>
                <input
                    type="number"
                    placeholder="Ex. 10"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    min="0"
                />
            </div>

            <div>
                <label>Méthode de paiement :</label>
                <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    required
                >
                    <option value="">Sélectionnez une méthode</option>
                    <option value="credit_card">Carte de crédit</option>
                    <option value="bank_transfer">Virement bancaire</option>
                    <option value="paypal">PayPal</option>
                </select>
            </div>

            <div>
                <label>Notes :</label>
                <textarea
                    placeholder="Ajoutez des informations supplémentaires..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
            </div>

            <h3>Totaux</h3>
            <p>Sous-total : {totals.subtotal.toFixed(2)} €</p>
            <p>Remise : -{totals.discount.toFixed(2)} €</p>
            <p>Taxe : +{totals.tax.toFixed(2)} €</p>
            <p><strong>Total : {totals.total.toFixed(2)} €</strong></p>

            <button type="submit">Créer la facture</button>
        </form>
    );
};

export default InvoiceForm;
