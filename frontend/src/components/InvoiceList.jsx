import Swal from "sweetalert2";
import { MdDelete } from "react-icons/md";
import { triggerAutomation } from "../utils/APIRoute";
import axios from "axios";
import { toast,ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function InvoiceList({ invoices, onDelete }) {
  const handleDelete = async (id) => {
    const tellme = await Swal.fire({
      title: "Delete the invoice?",
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

  const handleSendEmail=async(invoice)=>{
    try{
      const response=await axios.post(triggerAutomation,{
        invoices:[invoice]
      })
       console.log("Email sent successfully:", response.data);
       toast.success("Email sent successfully");
    }
    catch(error)
    {
      console.error("Error sending email:", error);
        toast.error("Failed to send email, try again later");
    }
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Due Invoices</h2>
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeaderRow}>
              <th style={{ ...styles.tableHeaderCell, width: "25%" }}>
                Recipient
              </th>
              <th style={{ ...styles.tableHeaderCell, width: "25%" }}>
                Amount
              </th>
              <th style={{ ...styles.tableHeaderCell, width: "25%" }}>
                Due Date
              </th>
              <th
                style={{
                  ...styles.tableHeaderCell,
                  width: "25%",
                  ...styles.actionCellHeader,
                }}
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice._id} style={styles.tableRow}>
                <td style={styles.tableCell}>{invoice.recipient}</td>
                <td style={styles.tableCell}>Rs {invoice.amount}</td>
                <td style={styles.tableCell}>{invoice.dueDate}</td>
                <td style={{ ...styles.tableCell, textAlign: "center" }}>
                  <button
                    id="send-email-button"
                    onClick={() => handleSendEmail(invoice)}
                  >
                    Send Email
                  </button>
                  <MdDelete
                    className="delete-icon"
                    onClick={() => handleDelete(invoice._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer autoClose={1000} />
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    fontFamily: "'Roboto', sans-serif",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  title: {
    color: "#333",
    fontSize: "24px",
    marginBottom: "20px",
  },
  tableContainer: {},
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeaderRow: {
    backgroundColor: "#4CAF50",
    color: "white",
    borderBottom: "2px solid black",
  },
  tableHeaderCell: {
    padding: "12px 0",
    textAlign: "center",
  },
  tableRow: {
    borderBottom: "2px solid #ddd",
  },
  tableCell: {
    padding: "12px 0",
    textAlign: "center",
    color: "black",
    fontWeight: "bolder",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  actionCell: {
    textAlign: "center",
  }
};

export default InvoiceList;
