// InvoiceList.js
import React from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Box,
  Paper,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";

function InvoiceList({ invoices, onDelete }) {

   const handleDelete = async(id) => {

    const tellme = await Swal.fire({
      title: "Delete the invoice ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
      width: "25rem",
    });  
    if (!tellme.isConfirmed) return;
    
    onDelete(id);
  };

  return (
    <Box>
      <Typography variant="h6" component="h2" gutterBottom>
        Due Invoices
      </Typography>
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Recipient</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Action</TableCell> {/* New table header for Action */}
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice._id}>
                <TableCell>{invoice.recipient}</TableCell>
                <TableCell>Rs {invoice.amount}</TableCell>
                <TableCell>{invoice.dueDate}</TableCell>
                <TableCell>
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDelete(invoice._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default InvoiceList;
