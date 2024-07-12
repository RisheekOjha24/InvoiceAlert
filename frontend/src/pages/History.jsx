import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { delInvoices } from "../utils/APIRoute"; // 
import { toast, ToastContainer } from "react-toastify";
import DelInvoiceList from "../components/DelInvoiceList";
import "react-toastify/dist/ReactToastify.css";
import { deleteList } from "../utils/APIRoute";

const History = () => {
  const [deletedInvoices, setDelInvoices] = useState([]); // Initialize with an empty array
  const [user, setUser] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = localStorage.getItem("user");

        if (userData) {
          const { email } = JSON.parse(userData);

          if (email) {
            // Use the endpoint variable instead of state variable
            const url = `${delInvoices}/${email}`;
            const response = await axios.get(url);
            const invoiceArray = response.data;

            setUser(email);
            setDelInvoices(invoiceArray);
          } else {
            console.log("Email not found in user data");
          }
        } else {
          console.log("User data not found");
          toast.error("Please login to continue");
        }
      } catch (err) {
        console.log("Error fetching user data:", err);
        toast.error("Failed to fetch data.");
      }
    };

    fetchData();
  }, []); 

  const handleDeletedInvoice=async(invoiceDel)=>{
      try {
      const response = await axios.delete(deleteList, {
        data: {
          email: user,
          invoice:invoiceDel,
          type:"deleted"
        },});

      const updatedInvoices = deletedInvoices.filter(
        (invoice) => invoice._id !== invoiceDel._id
      );
      
      setDelInvoices(updatedInvoices);
    

    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error("Failed to delete invoice.");
    }
  };
   return (
     <div>
       <Navbar />
       <ToastContainer autoClose={1000} />

       <DelInvoiceList
         invoices={deletedInvoices}
         onDelete={handleDeletedInvoice}
       />
     </div>
   );

  }

export default History;
