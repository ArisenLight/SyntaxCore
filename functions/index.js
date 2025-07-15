const functions = require("firebase-functions/v1");
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors({origin: true}));
app.use(express.json());

const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

app.post("/", async (req, res) => {
  const {name, email, subject, message} = req.body;

  try {
    await transporter.sendMail({
      from: gmailEmail,
      to: gmailEmail,
      subject: `New Contact from ${name}: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
    });

    await transporter.sendMail({
      from: gmailEmail,
      to: email,
      subject: "Thanks for contacting SyntaxCore Studio!",
      text: `Hi ${name},\n\nThanks for your message! 
      we'll get back to you soon.\n\n- The SyntaxCore Team`,
    });

    res.status(200).send("Emails sent!");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Failed to send email.");
  }
});

// ✅ First-gen function (this is key!)
exports.sendContactEmail = functions.https.onRequest(app);
