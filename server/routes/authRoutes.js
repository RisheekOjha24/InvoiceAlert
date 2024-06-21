const express = require("express");
const User = require("../model/userSchema");
const router = express.Router();
const { signin, createInvoice,fetchInovices,triggerAutomation } = require("../controller/authApi");

// actual url will be /auth/signin
router.post("/signin", signin);
router.post("/createinvoice",createInvoice);
router.post("/trigger-automation", triggerAutomation);
router.get("/invoices/:email", fetchInovices);


module.exports = router;
