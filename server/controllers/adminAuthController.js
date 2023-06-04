const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { validationResult } = require("express-validator")
const { Admin } = require("../models")

const loginadmin = async (req, res) => {
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
			admin: admin.admin,
		},
		process.env.JWT_PRIVATE_KEY,
		{ expiresIn: "7d" }
	)
	res.cookie("admtoken", token, {
		httpOnly: true,
		maxAge: 7 * 24 * 60 * 60 * 1000,
	})

	res.json({ username: admin.username, redirectUrl: "/admin-panel.html" })
}

module.exports = { loginadmin }
