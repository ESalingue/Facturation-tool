import React, { useEffect, useState } from 'react';
import API from '../api/api';

const ClientList = () => {
    const [clients, setClients] = useState([]);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await API.get('/clients');
                setClients(response.data);
            } catch (err) {
                console.error(err.message);
            }
        };

        fetchClients();
    }, []);

    return (
        <div>
            <h2>Clients</h2>
            <ul>
                {clients.map((client) => (
                    <li key={client._id}>{client.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default ClientList;
