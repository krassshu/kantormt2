const mongoose = require("mongoose")

// Define your schemas here...

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
	date: { type: String },
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

module.exports = { User, Exchange, Opinion, Admin }
