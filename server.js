const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const bodyParser = require('body-parser');
const QRCode = require('qrcode');
const QRCode = require('qrcode');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const cors = require('cors');
const stripe = require('stripe')('your_stripe_secret_key');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint to generate QR code for payment
app.post('/generate-qr', async (req, res) => {
    const { amount, userId } = req.body;

    if (!amount || !userId) {
        return res.status(400).send({ message: "Amount and user ID are required." });
    }

    const paymentDetails = { amount, userId, transactionId: `TXN-${Date.now()}` };

    try {
        const qrCode = await QRCode.toDataURL(JSON.stringify(paymentDetails));
        res.status(200).send({ qrCode, paymentDetails });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to generate QR code." });
    }
});

// Endpoint to process card payments via Stripe
app.post('/pay-with-card', async (req, res) => {
    const { amount, currency, source, description } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe expects amounts in cents
            currency,
            payment_method: source,
            confirm: true,
            description,
        });

        res.status(200).send({ message: "Payment successful", paymentIntent });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Payment failed", error: error.message });
    }
});

// Endpoint to generate a downloadable receipt
app.post('/generate-receipt', (req, res) => {
    const { transactionId, amount, userId, paymentMethod } = req.body;

    if (!transactionId || !amount || !userId || !paymentMethod) {
        return res.status(400).send({ message: "All receipt details are required." });
    }

    const doc = new PDFDocument();
    const receiptFileName = `receipt_${transactionId}.pdf`;
    const receiptPath = `./receipts/${receiptFileName}`;

    if (!fs.existsSync('./receipts')) {
        fs.mkdirSync('./receipts');
    }

    doc.pipe(fs.createWriteStream(receiptPath));
    doc.fontSize(20).text('Parking Payment Receipt', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Transaction ID: ${transactionId}`);
    doc.text(`User ID: ${userId}`);
    doc.text(`Amount: $${amount}`);
    doc.text(`Payment Method: ${paymentMethod}`);
    doc.text(`Status: Paid`);
    doc.end();

    res.download(receiptPath, receiptFileName, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send({ message: "Failed to generate receipt." });
        }
        fs.unlinkSync(receiptPath); // Clean up file after download
    });
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));
// Define routes
app.get('/login', (req, res) => {
    res.render('login'); // Render login.ejs
});

app.get('/services', (req, res) => {
    res.render('services'); // Render service.ejs
});

// Import Routes
const authRoutes = require("./routes/auth");
const parkingRoutes = require("./routes/parking");
const carRoutes = require("./routes/car");
const indexRoute = require("./routes/index");

// Routes Middleware
app.use("/", indexRoute);
app.use("/auth", authRoutes);
app.use("/parking", parkingRoutes);
app.use("/car", carRoutes);

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Database connection error:", err));


  app.get("/", (req, res)=>{
    res.send("Server is up and running!");
  })
  
// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
