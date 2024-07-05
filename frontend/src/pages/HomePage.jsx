// HomePage.js
import React, { useEffect, useState } from "react";
import { Button, Container, Typography, Box, TextField } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Link } from "react-router-dom";
import InvoiceList from "../components/InvoiceList";
import Navbar from "../components/Navbar";
import { fetchInvoice, triggerAutomation,deleteList } from "../utils/APIRoute";

function HomePage() {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [user, setUser] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          const { email } = JSON.parse(userData);
          setUser(email);
          const response = await axios.get(`${fetchInvoice}/${email}`);

          const formattedInvoices = response.data.map((inv) => ({
            ...inv,
            dueDate: formatDate(inv.dueDate),
          }));

          setInvoices(formattedInvoices);
          setFilteredInvoices(formattedInvoices); // Initialize filteredInvoices with all invoices
        } else {
          toast.error("No user found. Please log in.");
        }
      } catch (error) {
        console.error("Error fetching invoices:", error);
        toast.error("Failed to fetch invoices.");
      }
    };

    fetchInvoices();
  }, []);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleTriggerAutomation = async () => {
    try {
      console.log("Triggering automation process...");
      const response = await axios.post(triggerAutomation, { invoices });
      console.log("Automation triggered successfully:", response.data);
      toast.success("Automation triggered successfully!");
    } catch (error) {
      console.log("Error triggering automation:", error);
      toast.error("Failed to trigger automation.");
    }
  };

  const handleSearch = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
    const filtered = invoices.filter((invoice) =>
      invoice.recipient.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredInvoices(filtered);
  };

  const handleDeleteInvoice = async (id) => {
    try {
      // Assuming deletion API endpoint or logic here
      // For demo purposes, we'll just update the state locally
      console.log(id);
      // await axios.delete(deleteList,{
      //   user
      // })
      
      const updatedInvoices = invoices.filter((invoice) => invoice.id !== id);
      setInvoices(updatedInvoices);
      setFilteredInvoices(updatedInvoices); // Update filteredInvoices after deletion
      toast.success("Invoice deleted successfully!");
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error("Failed to delete invoice.");
    }
  };

  return (
    <div>
      <Navbar />
      <Container maxWidth="md">
        <ToastContainer autoClose="1000" />
        <Box sx={{ my: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/create-invoice"
            >
              Create Invoice
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleTriggerAutomation}
            >
              Trigger Automation
            </Button>
          </Box>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Search by Email"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={handleSearch}
            />
          </Box>
        </Box>
        <InvoiceList
          invoices={filteredInvoices}
          onDelete={handleDeleteInvoice}
        />
        <Box sx={{ mt: 4, textAlign: "center" }}></Box>
      </Container>
    </div>
  );
}

export default HomePage;
