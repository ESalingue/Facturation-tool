import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import InvoiceList from './components/InvoiceList';
import ClientForm from './components/ClientForm';
import InvoiceForm from './components/InvoiceForm';
import ProductForm from "./components/ProductForm";

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<InvoiceList />} />
                <Route path="/create-invoice" element={<InvoiceForm />} />
                <Route path="/clients" element={<ClientForm />} />
                <Route path="/create-product" element={<ProductForm />} />
            </Routes>
        </Router>
    );
}

export default App;
