const loginBox = document.querySelector(".login")
const loginForm = document.getElementById("login-form")

const storedUser = localStorage.getItem("username")

if (storedUser) {
	const user = JSON.parse(storedUser)
	loadUser(user)
	const logoutBtn = document.querySelector(".logout")
	logoutBtn.addEventListener("click", async () => {
		localStorage.removeItem("username")
		try {
			const response = await fetch("/logout", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			})

			if (response.ok) {
				window.location.href = "/"
			} else {
				console.error("Logout failed")
			}
		} catch (error) {
			console.log("Error:", error)
		}
	})
}

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
	const logout = document.createElement("button")
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
	input.style.border = "1px solid #d70000"
	errorInfo.classList.add("error-field")
	errorInfo.textContent = message
}

loginForm.addEventListener("submit", async (event) => {
	event.preventDefault()

	const inputs = document.querySelectorAll(".input-field")
	const errorInfo = document.querySelectorAll(".login-info")
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
			inputs.forEach((input, index) => {
				showError(input, errorInfo[index], "Niewłaściwy login lub hasło.")
			})
			return
		}
		if (!response.ok) {
			const errorData = await response.json()
			console.log(errorData)
			inputs.forEach((input, index) => {
				showError(input, errorInfo[index], errorData.error)
			})
		} else {
			const result = await response.json()
		}

		const item = {
			username: result.username,
			_id: result._id,
			expiration: Date.now() + 7 * 24 * 60 * 60 * 1000, // Expiration time in milliseconds (7 days)
		}

		localStorage.setItem("username", JSON.stringify(item))

		loadUser({ username: result.username, _id: result._id })
	} catch (error) {
		console.log("Error:", error)
	}
})
