const User = require("../model/userSchema");
const axios = require("axios");

 module.exports.signin = async (req, res) => {
    
  const { email, name } = req.body;

    try {
     
      let user = await User.findOne({ email });

      if (!user) {
       
        user = new User({ name, email });
        user._id = null;
        await user.save();
        res
          .status(201)
          .json({ msg: "User created successfully", status: true, user });
      } else {
        
        res.json({ msg: "User found", status: true, user });
      }
    } catch (err) {
      console.error("Error in Sign In:", err);
      res.status(500).json({ msg: "Error in Sign In", status: false });
    }
  };

module.exports.createInvoice = async (req, res) => {
  const { amount, dueDate, recipient, email } = req.body;

  try {
    // Find the user by email
    let user = await User.findOne({ email });

    if (user) {
      // Create a new invoice object
      const invoiceData = {
        recipient,
        amount,
        dueDate,
      };

      user.invoices.push(invoiceData);

      // Save the user object with the new invoice
      await user.save();

      // Return the newly created invoice as part of the response
      res
        .status(200)
        .json({
          message: "Invoice created successfully",
          invoiceId: invoiceData._id,
        });
    } else {
      // If user is not found
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error creating invoice:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports.fetchInovices= async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ email });
    if (user) {
      res.status(200).json(user.invoices);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const zapierWebhookUrl = process.env.ZAPIER_WEBHOOK_URL;

module.exports.triggerAutomation = async (req, res) => {
  try {
    const { invoices } = req.body;
      if (!Array.isArray(invoices)) {
        throw new Error("Invoices data is not an array.");
    }

    const webhookPayloads = invoices.map((invoice) => ({
      email: invoice.recipient,
      subject: `Invoice Details`,
      body: `
        <html>
          <body>
            <p style="margin: 0; padding: 0;">
              <span style="font-weight: bold; margin-right: 10px;">Amount:</span> 
              <span>Rs ${invoice.amount}</span>
            </p>
            <p style="margin: 0; padding: 0;">
              <span style="font-weight: bold; margin-right: 10px;">Due Date:</span> 
            <span>${invoice.dueDate}</span>
            </p>
  
        <p>Please review the invoice and make the payment by the due date mentioned above. If you have any questions or need further clarification, feel free to reach out to us.</p>
          </body>
        </html>
      `,
    }));

    const promises = webhookPayloads.map(async (payload) => {
      try {
        const response = await axios.post(zapierWebhookUrl, payload);
        console.log(
          `Email sent to ${payload.email} for amount ${payload.amount}. Response:`,
          response.data
        );
      } catch (error) {
        console.error(
          `Failed to send email to ${payload.email}. Error:`,
          error.message
        );
      }
    });

    await Promise.all(promises);
    // Promise.all takes an array of promises and returns a single promise.

    res.status(200).json({ message: "Automation triggered successfully" });
  } catch (error) {
    console.error("Error triggering automation:", error);
    res.status(500).json({ error: "Failed to trigger automation" });
  }
};


module.exports.deleteInvoice = async (req, res) => {
  const { email, invoiceId } = req.body; 
  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.invoices = user.invoices.filter(
      (invoice) => invoice._id.toString() !== invoiceId
    );

    await user.save();

    res.json({ message: "Invoice deleted successfully",status:true });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};