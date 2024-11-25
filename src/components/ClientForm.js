import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import API from '../api/api';

const ClientForm = () => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/clients', formData);
            alert('Client ajouté avec succès');
            setFormData({ name: '', email: '', phone: '' }); // Réinitialise le formulaire
        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
            <Typography variant="h4" gutterBottom>
                Ajouter un client
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Nom"
                    fullWidth
                    margin="normal"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    margin="normal"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <TextField
                    label="Téléphone"
                    fullWidth
                    margin="normal"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <Button type="submit" variant="contained" color="primary" style={{ marginTop: '1rem' }}>
                    Ajouter
                </Button>
            </form>
        </Container>
    );
};

export default ClientForm;
