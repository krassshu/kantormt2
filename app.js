const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")

const app = express()

app.use(express.json())

// Connect to MongoDB
mongoose
	.connect("mongodb://localhost:27017/kantor", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.error("Failed to connect to MongoDB", err))

// Define user, exchange, and opinion schemas
const userSchema = new mongoose.Schema({
	username: { type: String, required: true },
	email: { type: String, required: true },
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

// Create models from the schemas
const User = mongoose.model("User", userSchema)
const Exchange = mongoose.model("Exchange", exchangeSchema)
const Opinion = mongoose.model("Opinion", opinionSchema)

// Middleware for authentication
function auth(req, res, next) {
	const token = req.header("Authorization")
	if (!token) return res.status(401).send("Access denied. No token provided.")

	try {
		const decoded = jwt.verify(token, "jwtPrivateKey")
		req.user = decoded
		next()
	} catch (ex) {
		res.status(400).send("Invalid token.")
	}
}

// Login route
app.post("/login", async (req, res) => {
	const { username, password } = req.body
	const user = await User.findOne({ username })
	if (!user) return res.status(400).send("Invalid username or password.")

	const validPassword = await bcrypt.compare(password, user.password)
	if (!validPassword)
		return res.status(400).send("Invalid username or password.")

	const token = jwt.sign(
		{ _id: user._id, username: user.username, email: user.email },
		"jwtPrivateKey"
	)
	res.send(token)
})

// Registration route
app.post("/register", async (req, res) => {
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
		"jwtPrivateKey"
	)
	res
		.header("x-auth-token", token)
		.send({ _id: user._id, username: user.username, email: user.email })
})
// Exchange route
app.post("/exchange", auth, async (req, res) => {
	const { serverFrom, serverTo, amountFrom, amountTo, discordNick } = req.body
	const username = req.user.username

	if (amountFrom > 100)
		return res.status(400).send("Cannot exchange more than 100 units at once.")

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
})

// Opinion route
app.post("/opinion", auth, async (req, res) => {
	const { text } = req.body
	const username = req.user.username

	const opinion = new Opinion({ username, text })
	await opinion.save()

	res.send(opinion)
})

// Support route
app.post("/support", async (req, res) => {
	const { email, subject, message } = req.body

	const transporter = nodemailer.createTransport({
		host: "smtp.example.com",
		port: 587,
		secure: false,
		auth: {
			user: "support@example.com",
			pass: "password",
		},
	})

	const mailOptions = {
		from: "support@example.com",
		to: "support@example.com",
		subject: subject,
		text: `Email: ${email}\n\n${message}`,
	}
	await transporter.sendMail(mailOptions)

	res.send("Message sent successfully.")
})

// Start the server
app.listen(5500, () => console.log("Listening on port 3000..."))
