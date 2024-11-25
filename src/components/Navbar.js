import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    Facturation
                </Typography>
                <Button color="inherit" component={Link} to="/">
                    Factures
                </Button>
                <Button color="inherit" component={Link} to="/clients">
                    Clients
                </Button>
                <Button color="inherit" component={Link} to="/create-invoice">
                    Nouvelle Facture
                </Button>
                <Button color="inherit" component={Link} to="/create-product">
                    Ajouter Produit
                </Button>

            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
