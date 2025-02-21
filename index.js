const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});


const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded form data
app.use(limiter);

app.get('/', (req, res) => {
    res.send("Jaden's wonderful API. If you're here, you're definitely a little weird but I appreciate the spirit!");
});

app.post('/forms/contact', (req, res) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });
    const mailOptions = {
        from: process.env.EMAIL,
        to: process.env.EMAIL,
        subject: `[Form Submission] from ${req.body.name} - ${req.body.email}`,
        text: req.body.message
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.redirect(req.headers.referer);
        } else {
            console.log('Email sent: ' + info.response);
            res.redirect(req.headers.referer);
        }
    });
});

app.listen(port, () => {
  console.log(`listening on ${port}`);
});


