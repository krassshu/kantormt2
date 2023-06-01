const opinionForm = document.getElementById("opinion-form")

opinionForm.addEventListener("submit", async (event) => {
	event.preventDefault()

	const errorInfo = document.querySelector(".info")
	const content = document.querySelector(".content")
	const formData = new FormData(opinionForm)
	const text = formData.get("text")

	if (!text) {
		if (content.value.trim() === "") {
			content.style.border = "1px solid #d70000"
			errorInfo.classList.add("error-field")
			errorInfo.textContent = "To pole jest wymagane"
		}
		return
	}
	const loadingIndicator = document.createElement("div")
	loadingIndicator.classList.add("loading")
	loadingIndicator.textContent = "Przetwarzanie..."
	opinionForm.appendChild(loadingIndicator)

	try {
		const response = await fetch("/opinion", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ text }),
		})
		opinionForm.removeChild(loadingIndicator)

		if (response.status === 400) {
			const error = await response.text()
			content.style.border = "1px solid #d70000"
			errorInfo.classList.add("error-field")
			errorInfo.textContent = error
		} else if (response.status === 401) {
			const error = await response.text()
			content.style.border = "1px solid #d70000"
			errorInfo.classList.add("error-field")
			errorInfo.textContent = error
		} else {
			const result = await response.json()
		}
	} catch (err) {
		console.log("Error:", err)
	}
})
