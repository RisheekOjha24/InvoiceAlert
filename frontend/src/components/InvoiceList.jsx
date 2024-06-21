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
} from "@mui/material";

function InvoiceList({ invoices }) 
{
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
              {/* Add more headers as needed */}
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.recipient}</TableCell>
                <TableCell>Rs {invoice.amount}</TableCell>
                <TableCell>{invoice.dueDate}</TableCell>
                {/* Add more cells for other invoice properties */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default InvoiceList;
