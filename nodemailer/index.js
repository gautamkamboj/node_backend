const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: false }));

// Form route
app.get('/', (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Form</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
    form {
      background-color: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      width: 400px;
    }
    label {
      font-weight: bold;
    }
    input[type="email"],
    input[type="text"],
    textarea {
      width: 100%;
      padding: 10px;
      margin-top: 5px;
      margin-bottom: 15px;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-sizing: border-box;
    }
    textarea {
      height: 100px;
    }
    button {
      background-color: #4CAF50;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    }
    button:hover {
      background-color: #45a049;
    }
  </style>
  </head>
  <body>
  
  <form action="/send-email" method="post">
    <label for="email">Email:</label><br>
    <input type="email" id="email" name="email" required><br>
    <label for="subject">Subject:</label><br>
    <input type="text" id="subject" name="subject" required><br>
    <label for="message">Message:</label><br>
    <textarea id="message" name="message" rows="4" required></textarea><br><br>
    <button type="submit">Send Email</button>
  </form>
  
  </body>
  </html>  
  `);
});

// Route to handle form submission and send email
app.post('/send-email', (req, res) => {
  const { email, subject, message } = req.body;
    console.log(req.body);
  // Create a transporter using SMTP
  const transporter = nodemailer.createTransport({
    host: "localhost",
    port: "1025",
 
  });

  // Email options
  const mailOptions = {
    from: 'your_email@example.com',
    to: email,
    subject: subject,
    text: message
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent:', info.response);
      res.send('Email sent successfully');
    }
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});