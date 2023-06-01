const registrationForm = document.getElementById("registration-form")
const mainContent = document.querySelector(".main")
const inputs = document.querySelectorAll(".input-field")
const errorInfo = document.querySelectorAll(".info")

function showError(input, errorInfo, message) {
	input.style.border = "1px solid #d70000"
	errorInfo.classList.add("error-field")
	errorInfo.textContent = message
}

function removeError(input, errorInfo) {
	input.style.border = ""
	errorInfo.classList.remove("error-field")
}

inputs.forEach((input, index) => {
	input.addEventListener("input", () => {
		removeError(input, errorInfo[index])
	})
})

registrationForm.addEventListener("submit", async (event) => {
	event.preventDefault()
	const formData = new FormData(registrationForm)
	const email = formData.get("email")
	const username = formData.get("metin-nick")
	const discordNick = formData.get("discord-nick")
	const password = formData.get("password")
	const passwordConfirmation = formData.get("password-conf")
	const acceptance = formData.get("acceptance")

	if (
		!username ||
		!email ||
		!password ||
		!passwordConfirmation ||
		!discordNick
	) {
		inputs.forEach((input, index) => {
			if (input.value.trim() === "") {
				showError(input, errorInfo[index], "To pole jest wymagane")
			}
		})
		return
	}
	if (acceptance !== "on") {
		inputs[5].labels[0].style.color = "#d70000"
		return
	}

	if (!discordNick.includes("#")) {
		showError(inputs[2], errorInfo[2], "Zły nick Discord'a")
		return
	}

	if (discordNick.split("#")[1].length !== 4) {
		showError(inputs[2], errorInfo[2], "Zły nick Discord'a")
		return
	}

	if (password.length < 8) {
		showError(
			inputs[3],
			errorInfo[3],
			"Hasło musi posiadać co najmniej 8 znaków"
		)
		showError(
			inputs[4],
			errorInfo[4],
			"Hasło musi posiadać co najmniej 8 znaków"
		)
		return
	}

	if (
		!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[a-zA-Z\d\W_]{8,}$/.test(
			password
		)
	) {
		showError(
			inputs[3],
			errorInfo[3],
			"Hasło musi składać się z małych i dużych liter oraz cyfr."
		)
		showError(
			inputs[4],
			errorInfo[4],
			"Hasło musi składać się z małych i dużych liter oraz cyfr."
		)
		return
	}

	if (password !== passwordConfirmation) {
		showError(inputs[3], errorInfo[3], "Hasła nie pasują do siebie")
		showError(inputs[4], errorInfo[4], "Hasła nie pasują do siebie")
		return
	}

	const loadingIndicator = document.createElement("div")
	loadingIndicator.classList.add("loading")
	loadingIndicator.textContent = "Rejestrowanie..."
	mainContent.appendChild(loadingIndicator)

	try {
		const response = await fetch("/registration", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username,
				email,
				password,
				discordNick,
			}),
		})

		mainContent.removeChild(loadingIndicator)

		if (response.ok) {
			const result = await response.json()
			localStorage.setItem("x-auth-token", response.headers.get("x-auth-token"))

			mainContent.innerHTML = ""
			const newDiv = document.createElement("div")
			newDiv.classList.add("success")
			const title = document.createElement("span")
			title.classList.add("success__title")
			title.textContent = "Pomyślnie założono konto!"
			const userName = document.createElement("p")
			userName.classList.add("success__p")
			userName.textContent = `Twój nick to: ${result.username}`
			const mail = document.createElement("p")
			mail.classList.add("success__p")
			mail.textContent = `Twój mail to: ${result.email}`
			const discordnick = document.createElement("p")
			discordnick.classList.add("success__p")
			discordnick.textContent = `Twój nick z Discord'a to: ${result.discordNick}`

			newDiv.appendChild(title)
			newDiv.appendChild(userName)
			newDiv.appendChild(mail)
			newDiv.appendChild(discordnick)
			mainContent.appendChild(newDiv)
		} else {
			const error = await response.text()
			if (error === "e-mail") {
				showError(
					inputs[0],
					errorInfo[0],
					"Wprowadzony e-mail został już użyty"
				)
			} else if (error === "user") {
				showError(
					inputs[1],
					errorInfo[1],
					"Wybrana nazwa użytkownika jest już zajęta"
				)
			} else if (error === "discord") {
				showError(
					inputs[2],
					errorInfo[2],
					"Wprowadzony nick z Discord'a został już użyty"
				)
			}
		}
		localStorage.removeItem("x-auth-token")
		setTimeout(() => {
			window.location.href = "/"
		}, 5000)
	} catch (error) {
		console.error("Error:", error)
	}
})
