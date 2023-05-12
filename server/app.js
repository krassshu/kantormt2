require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
const { check, validationResult } = require("express-validator")
const path = require("path")
const fs = require("fs")

const app = express()

app.use(express.static(path.join(__dirname, "..", "public")))
app.use(express.json())
app.use(cookieParser())
app.use(decodeToken)

//Settings pages

app.use((req, res, next) => {
	if (req.path.indexOf(".") === -1) {
		const filePath = path.join(__dirname, "..", "public", req.path + ".html")
		if (fs.existsSync(filePath)) {
			res.sendFile(filePath, {
				headers: {
					"Content-Type": "text/html",
				},
			})
			return
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

// Removing *.html extensions

app.use((req, res, next) => {
	const ext = path.extname(req.url)
	if (ext !== "" && ext !== ".html") {
		req.url = req.url.slice(0, -ext.length)
	}
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
	discordNick: { type: String, required: true },
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

// Middleware for user authentication
function decodeToken(req, res, next) {
	const token = req.cookies.token
	if (!token) return next() // No token provided

	try {
		const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY)
		req.user = decoded // Add decoded information to the request object
		next()
	} catch (ex) {
		next() // Invalid token, proceed without adding user to req
	}
}

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack)
	res.status(500).send("Something went wrong.")
})

// Login route
app.post("/login", async (req, res) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() })
	}

	const { username, password } = req.body
	const user = await User.findOne({ username })
	if (!user) return res.status(400).send("Niewłaściwy login lub hasło.")

	const validPassword = await bcrypt.compare(password, user.password)
	if (!validPassword)
		return res.status(400).send("Niewłaściwy login lub hasło.")

	const token = jwt.sign(
		{ _id: user._id, username: user.username, email: user.email },
		process.env.JWT_PRIVATE_KEY,
		{ expiresIn: "7d" } // token will expire in 7 days
	)
	res.cookie("token", token, {
		httpOnly: true,
		maxAge: 7 * 24 * 60 * 60 * 1000,
	}) // set cookie to expire in 7 days
	res.send({ message: "Login successful" })
})

// Login admin route
app.post("/loginadmin", async (req, res) => {
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
		process.env.JWT_PRIVATE_KEY,
		{ expiresIn: "7d" } // token will expire in 7 days
	)
	res.cookie("token", token, {
		httpOnly: true,
		maxAge: 7 * 24 * 60 * 60 * 1000,
	}) // set cookie to expire in 7 days
	res.send({ message: "Login successful" })
})

// Registration route
app.post("/registration", async (req, res) => {
	const { username, email, password, discordNick } = req.body

	let mail = await User.findOne({ email })
	if (mail) return res.status(400).send("e-mail")

	let user = await User.findOne({ username })
	if (user) return res.status(400).send("user")

	let discord = await User.findOne({ discordNick })
	if (discord) return res.status(400).send("discord")

	const salt = await bcrypt.genSalt(10)
	const hashedPassword = await bcrypt.hash(password, salt)

	user = new User({ username, email, password: hashedPassword, discordNick }) // Add discordNick here
	await user.save()

	const token = jwt.sign(
		{ _id: user._id, username: user.username, email: user.email },
		process.env.JWT_PRIVATE_KEY
	)
	res.header("x-auth-token", token).send({
		_id: user._id,
		username: user.username,
		email: user.email,
		discordNick: user.discordNick,
	})
})

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
