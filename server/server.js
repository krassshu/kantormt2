require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const path = require("path")
const fs = require("fs")
const { auth, decodeToken } = require("./middleware/authMiddleware")
const authRoutes = require("./routes/authRoutes")
// const supportRoutes = require("./routes/supportRoutes")
const exchangeRoutes = require("./routes/exchangeRoutes")
const opinionRoutes = require("./routes/opinionRoutes")
const adminRoutes = require("./routes/adminRoutes")

const app = express()

app.use(express.static(path.join(__dirname, "..", "public")))
app.use(express.json())
app.use(cookieParser())
app.use(decodeToken)

// Import and use the routes
app.use("/", authRoutes)
app.use("/", adminRoutes)
// app.use("/support", supportRoutes)
app.use("/exchange", exchangeRoutes)
app.use("/opinion", opinionRoutes)

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

// Start the server
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`))
