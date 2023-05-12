const loginBox = document.querySelector(".login")
const loginForm = document.getElementById("login-form")

function loadUser(user) {
	loginBox.innerHTML = ""
	const nick = document.createElement("span")
	nick.classList.add("login__nick")
	nick.textContent = user.username
	const options = document.createElement("div")
	options.classList.add("login__options")
	const exHistory = document.createElement("a")
	exHistory.setAttribute("href", "/historia-wymian")
	exHistory.textContent = "Historia wymian"
	const settings = document.createElement("a")
	settings.setAttribute("href", "/ustawienia")
	settings.textContent = "Ustawienia"
	const exchange = document.createElement("a")
	exchange.setAttribute("href", "/wymiana")
	exchange.textContent = "Wymiana"
	const logout = document.createElement("span")
	logout.classList.add("logout")
	logout.textContent = "Wyloguj się"

	loginBox.appendChild(nick)
	loginBox.appendChild(options)
	options.appendChild(exHistory)
	options.appendChild(settings)
	options.appendChild(exchange)
	loginBox.appendChild(logout)
}

function showError(input, errorInfo, message) {
	input.style.border = "1px solid #d7000"
	errorInfo.classList.add("error-field")
	errorInfo.textContent = message
}

loginForm.addEventListener("submit", async (event) => {
	event.preventDefault()

	const inputs = document.querySelectorAll(".input-field")
	const errorInfo = document.querySelectorAll(".info")
	const formData = new FormData(loginForm)
	const username = formData.get("username")
	const password = formData.get("password")

	if (!username || !password) {
		inputs.forEach((input, index) => {
			if (input.value.trim() === "") {
				showError(input, errorInfo[index], "To pole jest wymagane")
			}
		})
		return
	}

	const loadingIndicator = document.createElement("div")
	loadingIndicator.classList.add("loading")
	loadingIndicator.textContent = "Logowanie..."
	loginBox.appendChild(loadingIndicator)

	try {
		const response = await fetch("/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username,
				password,
			}),
		})

		loginBox.removeChild(loadingIndicator)

		if (response.status === 400) {
			const error = await response.text()
			inputs.forEach((input, index) => {
				showError(input, errorInfo[index], error)
			})
		}

		const result = await response.json()
		localStorage.setItem("x-auth-token", response.headers.get("x-auth-token"))

		loadUser(result) // Use the response data instead of decodedUser
	} catch (error) {
		console.log("Error:", error)
	}
})
