// const express = require("express")
// const router = express.Router()

// // Support route
// app.post(
// 	"/support",
// 	[
// 		check("email").isEmail().withMessage("Email is required."),
// 		check("subject").notEmpty().withMessage("Subject is required."),
// 		check("message").notEmpty().withMessage("Message is required."),
// 	],
// 	async (req, res) => {
// 		const errors = validationResult(req)
// 		if (!errors.isEmpty()) {
// 			return res.status(400).json({ errors: errors.array() })
// 		}

// 		const { email, subject, message } = req.body

// 		const transporter = nodemailer.createTransport({
// 			host: "smtp.example.com",
// 			port: 587,
// 			secure: false,
// 			auth: {
// 				user: process.env.EMAIL_USER,
// 				pass: process.env.EMAIL_PASS,
// 			},
// 		})

// 		const mailOptions = {
// 			from: process.env.EMAIL_USER,
// 			to: process.env.EMAIL_USER,
// 			subject: subject,
// 			text: `Email: ${email}\n\n${message}`,
// 		}

// 		try {
// 			await transporter.sendMail(mailOptions)
// 			res.send("Message sent successfully.")
// 		} catch (err) {
// 			console.error("Failed to send email", err)
// 			res.status(500).send("Failed to send email.")
// 		}
// 	}
// )
// module.exports = router
