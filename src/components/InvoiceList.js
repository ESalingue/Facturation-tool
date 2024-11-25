import React, { useEffect, useState } from 'react';
import API from '../api/api';

const InvoiceList = () => {
    const [invoices, setInvoices] = useState([]);
    const [emailInputs, setEmailInputs] = useState({}); // Pour gérer les emails pour chaque facture

    // Fonction pour récupérer les factures
    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await API.get('/invoices');
                setInvoices(response.data);
            } catch (err) {
                console.error('Erreur lors de la récupération des factures :', err.message);
            }
        };

        fetchInvoices();
    }, []);

    // Fonction pour changer le statut de la facture
    const handleStatusChange = async (id, status) => {
        try {
            await API.put(`/invoices/${id}/status`, { status });
            setInvoices((prevInvoices) =>
                prevInvoices.map((invoice) =>
                    invoice._id === id ? { ...invoice, status } : invoice
                )
            );
        } catch (err) {
            console.error('Erreur lors de la mise à jour du statut :', err.message);
        }
    };

    // Fonction pour télécharger le PDF de la facture
    const handleDownloadPDF = async (id) => {
        try {
            const response = await API.get(`/invoices/${id}/pdf`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `facture-${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error('Erreur lors du téléchargement du PDF :', err.message);
        }
    };

    // Fonction pour envoyer la facture par email
    const handleSendEmail = async (id) => {
        const email = emailInputs[id]; // Récupérer l'email spécifique pour cette facture
        if (!email) {
            alert('Veuillez entrer une adresse email valide.');
            return;
        }

        try {
            await API.post(`/invoices/${id}/email`, { email });
            alert('Facture envoyée avec succès.');
        } catch (err) {
            console.error('Erreur lors de l\'envoi de l\'email :', err.message);
        }
    };

    // Gérer l'entrée de l'email pour chaque facture
    const handleEmailInputChange = (id, value) => {
        setEmailInputs((prevInputs) => ({
            ...prevInputs,
            [id]: value,
        }));
    };

    return (
        <div>
            <h2>Liste des Factures</h2>
            <table>
                <thead>
                <tr>
                    <th>Numéro</th>
                    <th>Client</th>
                    <th>Total</th>
                    <th>Statut</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {invoices.map((invoice) => (
                    <tr key={invoice._id}>
                        <td>{invoice.invoiceNumber}</td>
                        <td>{invoice.client?.name || 'Client inconnu'}</td>
                        <td>{invoice.total} €</td>
                        <td>
                            <select
                                value={invoice.status}
                                onChange={(e) => handleStatusChange(invoice._id, e.target.value)}
                            >
                                <option value="Envoyée">Envoyée</option>
                                <option value="Payée">Payée</option>
                                <option value="En retard">En retard</option>
                                <option value="Annulée">Annulée</option>
                            </select>
                        </td>
                        <td>
                            <button onClick={() => handleDownloadPDF(invoice._id)}>
                                Télécharger PDF
                            </button>
                            <div style={{ marginTop: '10px' }}>
                                <input
                                    type="email"
                                    placeholder="Email du client"
                                    value={emailInputs[invoice._id] || ''}
                                    onChange={(e) => handleEmailInputChange(invoice._id, e.target.value)}
                                />
                                <button onClick={() => handleSendEmail(invoice._id)}>
                                    Envoyer Email
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default InvoiceList;
