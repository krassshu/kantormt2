const exchangeForm = document.getElementById("exchange-form")
const inputs = document.querySelectorAll(".form-input")
const select = document.querySelectorAll(".select")
const errorInfo = document.querySelectorAll(".info")

function showError(input, errorInfo, message) {
	input.style.border = "1px solid #d70000"
	errorInfo.classList.add("error-field")
	errorInfo.textContent = message
}

function removeError(input, errorInfo) {
	input.style.border = ""
	errorInfo.classList.remove("error-field")
	errorInfo.textContent = ""
}

inputs.forEach((input, index) => {
	input.addEventListener("input", () => {
		removeError(input, errorInfo[index])
	})
})

exchangeForm.addEventListener("submit", async (event) => {
	event.preventDefault()

	const formData = new FormData(exchangeForm)
	const username = formData.get("server")
	const discordNick = formData.get("discord")
	const serverFrom = formData.get("server-from")
	const amountFrom = formData.get("server-from-value")
	const serverTo = formData.get("server-to")
	const amountTo = formData.get("server-to-value")

	let hasError = false

	if (!username || !discordNick || !amountFrom || !amountTo) {
		inputs.forEach((input, index) => {
			if (input.value.trim() === "") {
				showError(input, errorInfo[index], "To pole jest wymagane")
				hasError = true
			}
		})
	}

	if (serverFrom === serverTo) {
		select.forEach((el) => {
			el.style.border = "1px solid #d70000"
		})
		errorInfo[1].classList.add("error-field")
		errorInfo[2].textContent = "Te pola nie mogą być takie same"
		hasError = true
	}

	if (hasError) {
		return
	}

	// Check quantity available

	// Check quantity available

	const loadingIndicator = document.createElement("div")
	loadingIndicator.classList.add("loading")
	loadingIndicator.textContent = "Przetwarzanie..."
	exchangeForm.appendChild(loadingIndicator)

	try {
		const response = await fetch("/exchange", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				serverFrom,
				serverTo,
				amountFrom,
				amountTo,
				username,
				discordNick,
			}),
		})

		exchangeForm.removeChild(loadingIndicator)

		if (response.status === 401) {
			const error = await response.text()
		}

		// Stworzenie informacji o problemie po polsku
		if (response.status === 400) {
			const error = await response.text()
			inputs.forEach((input, index) => {
				showError(input, errorInfo[index], error)
			})
		} else {
			const result = await response.json()
		}
	} catch (err) {
		console.log("Error:", err)
	}
})
