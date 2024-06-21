import React, { useEffect, useState } from "react";
import { Button, Container, Typography, Box } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Link } from "react-router-dom";
import InvoiceList from "../components/InvoiceList";
import { fetchInvoice } from "../utils/APIRoute";
import Navbar from "../components/Navbar";
import { triggerAutomation } from "../utils/APIRoute";

function HomePage() {
  const [invoices, setInvoices] = useState([]);
  const [user, setUser] = useState("");

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const userEmail = localStorage.getItem("user");
        if (userEmail) {
          const { email } = JSON.parse(userEmail);
          const response = await axios.get(`${fetchInvoice}/${email}`);
    
            const formattedInvoices = response.data.map((inv) => ({
            ...inv,
            dueDate: formatDate(inv.dueDate),
          }));

          setInvoices(formattedInvoices);
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
      // Ensure invoices is an array; if not, handle it appropriately
       // Make a POST request to Zapier webhook URL
      const response = await axios.post(triggerAutomation, {invoices});

      // Handle success response
      console.log("Automation triggered successfully:", response.data);
      toast.success("Automation triggered successfully!");
    } catch (error) {
      // Handle error
      console.log("Error triggering automation:", error);
      toast.error("Failed to trigger automation.");
    }
  };

  const getUser = (newUser) => {
    setUser(newUser);
  };

  return (
    <div>
      <Navbar />
      <Container maxWidth="md">
        <ToastContainer autoClose="1000"/>
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
        </Box>
        <InvoiceList invoices={invoices} />
        <Box sx={{ mt: 4, textAlign: "center" }}></Box>
      </Container>
    </div>
  );
}

export default HomePage;
