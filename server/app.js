require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
const { check, validationResult } = require("express-validator")
const path = require("path")
const mime = require("mime-types")
const fs = require("fs")

const app = express()

app.use(express.static(path.join(__dirname, "..", "public")))
app.use(express.json())

//Settings pages

app.use((req, res, next) => {
	if (req.path.indexOf(".") === -1) {
		const filePath = path.join(__dirname, "..", "public", req.path + ".html")
		if (fs.existsSync(filePath)) {
			req.url += ".html"
		}
	}
	next()
})

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "..", "public", "index.html"), {
		headers: {
			"Content-Type": "text/html",
		},
	})
})

// Middleware to remove file extensions from URLs
app.use((req, res, next) => {
	// Check if the requested URL contains a file extension
	const ext = path.extname(req.url)
	if (ext !== "" && ext !== ".html") {
		// If it does, remove the extension
		req.url = req.url.slice(0, -ext.length)
	}
	// Pass the request to the next middleware
	next()
})

// admin dashboard route
app.get("/admin_dashboard", auth, (req, res) => {
	res.sendFile(path.join(__dirname, "..", "admin-panel.html"), {
		headers: {
			"Content-Type": "text/html",
		},
	})
})

// Connect to MongoDB
mongoose
	.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.error("Failed to connect to MongoDB", err))

// Define user, exchange, and opinion schemas
const userSchema = new mongoose.Schema({
	username: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
})

const exchangeSchema = new mongoose.Schema({
	serverFrom: { type: String, required: true },
	serverTo: { type: String, required: true },
	amountFrom: { type: Number, required: true },
	amountTo: { type: Number, required: true },
	username: { type: String, required: true },
	discordNick: { type: String, required: true },
})

const opinionSchema = new mongoose.Schema({
	username: { type: String, required: true },
	text: { type: String, required: true },
})

const adminSchema = new mongoose.Schema({
	username: { type: String, required: true },
	password: { type: String, required: true },
})

// Create models from the schemas
const User = mongoose.model("User", userSchema)
const Exchange = mongoose.model("Exchange", exchangeSchema)
const Opinion = mongoose.model("Opinion", opinionSchema)
const Admin = mongoose.model("Admin", adminSchema)

// Middleware for authentication
function auth(req, res, next) {
	const token = req.header("Authorization")
	if (!token) return res.status(401).send("Access denied. No token provided.")

	try {
		const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY)
		req.user = decoded
		if (req.user.admin) {
			next()
		} else {
			res.status(403).send("Access denide. You are not an admin")
		}
	} catch (ex) {
		res.status(400).send("Invalid token.")
	}
}

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack)
	res.status(500).send("Something went wrong.")
})

// Login route
app.post(
	"/login",
	[
		check("username").notEmpty().withMessage("Username is required."),
		check("password").notEmpty().withMessage("Password is required."),
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		const { username, password } = req.body
		const user = await User.findOne({ username })
		if (!user) return res.status(400).send("Invalid username or password.")

		const validPassword = await bcrypt.compare(password, user.password)
		if (!validPassword)
			return res.status(400).send("Invalid username or password.")

		const token = jwt.sign(
			{ _id: user._id, username: user.username, email: user.email },
			process.env.JWT_PRIVATE_KEY
		)
		res.send(token)
	}
)

// Login admin route
app.post(
	"/loginadmin",
	[
		check("username").notEmpty().withMessage("Username is required."),
		check("password").notEmpty().withMessage("Password is required."),
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}
		const { username, password } = req.body
		const admin = await Admin.findOne({ username })
		if (!admin) return res.status(400).send("Invalid username or password.")

		const validPassword = await bcrypt.compare(password, admin.password)
		if (!validPassword)
			return res.status(400).send("Invalid username or password.")

		const token = jwt.sign(
			{
				_id: admin._id,
				username: admin.username,
				email: admin.email,
				admin: true,
			},
			process.env.JWT_PRIVATE_KEY
		)
		res.send(token)
	}
)

// Registration route
app.post(
	"/register",
	[
		check("username").notEmpty().withMessage("Username is required."),
		check("email").isEmail().withMessage("Email is required."),
		check("password")
			.isLength({ min: 8 })
			.withMessage("Password must be at least 8 characters long."),
		check("passwordConfirmation")
			.notEmpty()
			.withMessage("Password confirmation is required."),
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		const { username, email, password, passwordConfirmation } = req.body

		if (password !== passwordConfirmation)
			return res.status(400).send("Passwords do not match.")

		let user = await User.findOne({ email })
		if (user) return res.status(400).send("User already registered.")

		const salt = await bcrypt.genSalt(10)
		const hashedPassword = await bcrypt.hash(password, salt)

		user = new User({ username, email, password: hashedPassword })
		await user.save()

		const token = jwt.sign(
			{ _id: user._id, username: user.username, email: user.email },
			process.env.JWT_PRIVATE_KEY
		)
		res
			.header("x-auth-token", token)
			.send({ _id: user._id, username: user.username, email: user.email })
	}
)

// Exchange route
app.post(
	"/exchange",
	auth,
	[
		check("serverFrom").notEmpty().withMessage("Server from is required."),
		check("serverTo").notEmpty().withMessage("Server to is required."),
		check("amountFrom")
			.isNumeric()
			.withMessage("Amount from must be a number.")
			.custom((value) => value <= 100)
			.withMessage("Cannot exchange more than 100 units at once."),
		check("amountTo").isNumeric().withMessage("Amount to must be a number."),
		check("discordNick")
			.notEmpty()
			.withMessage("Discord nickname is required."),
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		const { serverFrom, serverTo, amountFrom, amountTo, discordNick } = req.body
		const username = req.user.username

		const exchange = new Exchange({
			serverFrom,
			serverTo,
			amountFrom,
			amountTo,
			username,
			discordNick,
		})
		await exchange.save()

		res.send(exchange)
	}
)

// Opinion route
app.post(
	"/opinion",
	auth,
	[check("text").notEmpty().withMessage("Opinion text is required.")],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		const { text } = req.body
		const username = req.user.username

		const opinion = new Opinion({ username, text })
		await opinion.save()

		res.send(opinion)
	}
)

// Support route
app.post(
	"/support",
	[
		check("email").isEmail().withMessage("Email is required."),
		check("subject").notEmpty().withMessage("Subject is required."),
		check("message").notEmpty().withMessage("Message is required."),
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		const { email, subject, message } = req.body

		const transporter = nodemailer.createTransport({
			host: "smtp.example.com",
			port: 587,
			secure: false,
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS,
			},
		})

		const mailOptions = {
			from: process.env.EMAIL_USER,
			to: process.env.EMAIL_USER,
			subject: subject,
			text: `Email: ${email}\n\n${message}`,
		}

		try {
			await transporter.sendMail(mailOptions)
			res.send("Message sent successfully.")
		} catch (err) {
			console.error("Failed to send email", err)
			res.status(500).send("Failed to send email.")
		}
	}
)

// Start the server
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`))
