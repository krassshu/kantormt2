const mongoose = require("mongoose")

// Define your schemas here...

const userSchema = new mongoose.Schema({
	username: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	discordNick: { type: String, required: true }, // Change "discord" to "discordNick"
})

const exchangeSchema = new mongoose.Schema({
	userId: { type: String },
	serverNick: { type: String, required: true },
	discordNick: { type: String }, // Change "discord" to "discordNick"
	serverFrom: { type: String, required: true },
	amountFrom: { type: Number, required: true },
	serverTo: { type: String, required: true },
	amountTo: { type: Number, required: true },
	date: { type: String },
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

const postSchema = new mongoose.Schema({
	username: { type: String },
	content: { type: String, required: true },
	date: { type: String },
})

const currencySchema = new mongoose.Schema({
	rates: {
		glevia: { type: String },
		alune: { type: String },
		pangea: { type: String },
		samia: { type: String },
		valium: { type: String },
		ervelia: { type: String },
	},
	remaning: {
		glevia: { type: String },
		alune: { type: String },
		pangea: { type: String },
		samia: { type: String },
		valium: { type: String },
		ervelia: { type: String },
	},
})
// Create models from the schemas
const User = mongoose.model("User", userSchema)
const Exchange = mongoose.model("Exchange", exchangeSchema)
const Opinion = mongoose.model("Opinion", opinionSchema)
const Admin = mongoose.model("Admin", adminSchema)
const Post = mongoose.model("Post", postSchema)
const Currency = mongoose.model("Currency", currencySchema)

module.exports = { User, Exchange, Opinion, Admin, Post, Currency }
