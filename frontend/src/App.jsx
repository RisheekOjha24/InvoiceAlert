import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import HomePage from './pages/HomePage';
import CreateInvoice from './pages/createInvoice';
import History from './pages/History';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />}></Route>
        <Route exact path="/invoices" element={<HomePage />} />
        <Route exact path="/trigger" element={<h2>Trigger</h2>} />
        <Route exact path="/create-invoice" element={<CreateInvoice />} />
        <Route exact path="/invoice-history" element={<History />} />
      </Routes>
    </Router>
  );
}

export default App