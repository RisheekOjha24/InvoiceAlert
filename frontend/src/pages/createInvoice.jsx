import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Paper, Typography, TextField, Button } from "@mui/material";
import { styled } from "@mui/system";
import { createInvoice } from "../utils/APIRoute";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {useNavigate} from "react-router-dom";
import Navbar from "../components/Navbar";

const StyledPaper = styled(Paper)({
  padding: "24px",
  marginTop: "16px", 
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});
const StyledForm = styled("form")({
  width: "100%",
  marginTop: "1rem",
});

const StyledTextField = styled(TextField)({
  marginBottom: "1rem",
});

const StyledButton = styled(Button)({
  marginTop: "1rem",
});

const CreateInvoice = () => {
  
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [recipient, setRecipient] = useState("");
  const [email, setEmail] = useState("");

  const navigate=useNavigate();

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleDueDateChange = (event) => {
    setDueDate(event.target.value);
  };

  const handleRecipientChange = (event) => {
    setRecipient(event.target.value);
  };

  useEffect(() => {

    const userEmail = localStorage.getItem("user");
    if (userEmail) {
      const { email } = JSON.parse(userEmail);
      setEmail(email);
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email) {
      toast.error("No user found. Please log in.");
      return;
    }

    try {
      const response = await axios.post(createInvoice, {
        amount,
        dueDate,
        recipient,
        email,
      });
      console.log("Invoice created successfully:", response.data);
      navigate("/invoices")
     
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error("Error creating invoice. Please try again.");
    }
  };

  
  return (
    <div style={{ backgroundColor: "#FBF9F1", minHeight: "100vh" }}>
      <Navbar />
      <Container maxWidth="sm">
        <ToastContainer autoClose={1200} />
        <StyledPaper elevation={3}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              fontWeight: "bold",
            }}
          >
            Create Invoice
          </Typography>
          <StyledForm onSubmit={handleSubmit}>
            <StyledTextField
              label="Amount in Rs"
              variant="outlined"
              fullWidth
              value={amount}
              onChange={handleAmountChange}
              type="number"
            />
            <StyledTextField
              label="Due Date"
              type="date"
              variant="outlined"
              fullWidth
              value={dueDate}
              onChange={handleDueDateChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <StyledTextField
              label="Recipient Email"
              type="email"
              variant="outlined"
              fullWidth
              value={recipient}
              onChange={handleRecipientChange}
              required
            />
            <StyledButton
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Create Invoice
            </StyledButton>
          </StyledForm>
        </StyledPaper>
      </Container>
    </div>
  );
};

export default CreateInvoice;
