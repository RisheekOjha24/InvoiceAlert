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
   
    let user = await User.findOne({ email });

    if (user)
    {
        const newInvoice = {
        recipient,
        amount,
        dueDate,
      };

    
      user.invoices.push(newInvoice);

      await user.save();

      res
        .status(200)
        .json({ message: "Invoice created successfully", invoice: newInvoice });
    } 
    else {
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
            <h2>Invoice Details</h2>
            <p>Amount: ${invoice.amount}</p>
            <p>Due Date: ${invoice.dueDate}</p>
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

    res.status(200).json({ message: "Automation triggered successfully" });
  } catch (error) {
    console.error("Error triggering automation:", error);
    res.status(500).json({ error: "Failed to trigger automation" });
  }
};
