import React, { useEffect, useState } from "react";
import { Container, Box} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import InvoiceList from "../components/InvoiceList";
import Swal from "sweetalert2";
import Navbar from "../components/Navbar";
import { fetchInvoice, triggerAutomation, deleteList } from "../utils/APIRoute";

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
          setFilteredInvoices(formattedInvoices); // Initializing filteredInvoices with all invoices
        } else {
          toast.error("No user found. Please log in.");
        }
      } catch (error) {
        console.error("Error fetching invoices:", error);
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
    try{
           const tellme = await Swal.fire({
             title:
               "Send emails to all recipients?",
             icon: "question",
             showCancelButton: true,
             confirmButtonColor: "#3085d6",
             cancelButtonColor: "#d33",
             confirmButtonText: "Send",
             maxWidth: "25rem",
           });
           if (!tellme.isConfirmed) return;
          console.log("Triggering automation process...");
          const response = await axios.post(triggerAutomation, {invoices});
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

  const handleDeleteInvoice = async (invoiceDel) => {
    try {
      const response = await axios.delete(deleteList, {
        data: {
          email: user,
          invoice:invoiceDel,
          type:"present"
        },
      });
      const updatedInvoices = invoices.filter((invoice) => invoice._id !== invoiceDel._id);
      
      setInvoices(updatedInvoices);
      setFilteredInvoices(updatedInvoices);

    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error("Failed to delete invoice.");
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <Container maxWidth="md" style={styles.container}>
        <ToastContainer autoClose={1000} />
        <Box sx={{ my: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          ></Box>

          <Box sx={{ mt: 2 }}>
            <input
              type="text"
              placeholder="Search by Email"
              value={searchTerm}
              onChange={handleSearch}
              style={{
                width: "50%",
                height: "40px",
                padding: "8px",
                borderRadius: "4px",
                border: "2px solid #ccc",
                fontSize: "14px",
              }}
            />
            <button id="automation-btn" onClick={handleTriggerAutomation}
            style={{float:"right"}}>
              Trigger Automation
            </button>
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

const styles = {
  page: {
    minHeight: "100vh",
    background: `#FBF9F1`,
    display: "flex",
    flexDirection: "column",
  },
  container: {
    flexGrow: 1,
  },
};

export default HomePage;
