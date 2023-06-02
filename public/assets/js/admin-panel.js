const postForm = document.getElementById("post-form")
const ratesForm = document.getElementById("rates-form")
const remaningForm = document.getElementById("remaning-form")

async function getData(endpoint) {
	try {
		const response = await fetch(endpoint, {
			method: "GET",
			headers: { "Content-Type": "application/json" },
		})

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		const data = await response.json()

		if (endpoint === "/rates") {
			const ratesItems = document.querySelectorAll(".rates-value")
			ratesItems.forEach((el) => {
				const dataAttr = el.getAttribute("data-atrybut")
				if (data.hasOwnProperty(dataAttr)) {
					el.textContent = data[dataAttr]
				}
			})
		} else if (endpoint === "/remaning") {
			const remaningItems = document.querySelectorAll(".remaning-value")
			remaningItems.forEach((el) => {
				const nameAtr = el.getAttribute("name")
				if (data.hasOwnProperty(nameAtr)) {
					el.setAttribute("placeholder", `${data[nameAtr]} won`)
				}
			})
		}

		return data
	} catch (error) {
		console.error(
			`Error occurred while fetching data from ${endpoint}: ${error.message}`
		)
	}
}

postForm.addEventListener("submit", async (event) => {
	event.preventDefault()

	const formData = new FormData(postForm)
	const content = formData.get("post-content")
	const contentValue = document.getElementById("post-content")

	if (!content) {
		if (contentValue.value.trim() === "") {
			contentValue.style.border = "2px solid #d70000"
		}
		console.log("Nie można wysłać pustego postu.")
		return
	}

	const loadingIndicator = document.createElement("div")
	loadingIndicator.classList.add("loading")
	loadingIndicator.textContent = "Przetwarzanie..."
	postForm.appendChild(loadingIndicator)

	try {
		const response = await fetch("/article", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ content }),
		})
		postForm.removeChild(loadingIndicator)

		if (!response.ok) {
			const error = await response.text()
			console.log("Wystąpił błąd podczas dodawania artykułu", error)
		} else {
			const result = await response.json()
		}
	} catch (error) {
		console.log("Error", error)
	}
})

ratesForm.addEventListener("submit", async (event) => {
	event.preventDefault()

	const formData = new FormData(ratesForm)
	const ratesData = {
		glevia: formData.get("glevia"),
		alune: formData.get("alune"),
		pangea: formData.get("pangea"),
		samia: formData.get("samia"),
		valium: formData.get("valium"),
		ervelia: formData.get("ervelia"),
	}

	let rates = {}

	for (let key in ratesData) {
		if (ratesData[key] !== "") {
			rates[key] = ratesData[key]
		}
	}

	const loadingIndicator = document.createElement("div")
	loadingIndicator.classList.add("loading")
	loadingIndicator.textContent = "Przetwarzanie..."
	ratesForm.appendChild(loadingIndicator)

	try {
		const response = await fetch("/rates", {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ rates }),
		})

		if (!response.ok) {
			const error = await response.text()
			console.log("Wystąpił błąd podczas aktualizacji kursów", error)
		} else {
			const result = await response.json()
			const updatedRemaning = await getData("/rates")
			console.log(updatedRemaning)
		}
		ratesForm.removeChild(loadingIndicator)
	} catch (error) {
		console.log("Error", error)
	}
})

remaningForm.addEventListener("submit", async (event) => {
	event.preventDefault()

	const formData = new FormData(remaningForm)
	const remaningData = {
		glevia: formData.get("glevia"),
		alune: formData.get("alune"),
		pangea: formData.get("pangea"),
		samia: formData.get("samia"),
		valium: formData.get("valium"),
		ervelia: formData.get("ervelia"),
	}

	let remaning = {}

	for (let key in remaningData) {
		if (remaningData[key] !== "") {
			remaning[key] = remaningData[key]
		}
	}

	const loadingIndicator = document.createElement("div")
	loadingIndicator.classList.add("loading")
	loadingIndicator.textContent = "Przetwarzanie..."
	remaningForm.appendChild(loadingIndicator)

	try {
		const response = await fetch("/remaning", {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ remaning }),
		})

		if (!response.ok) {
			const error = await response.text()
			console.log("Wystąpił błąd podczas aktualizacji kursów", error)
		} else {
			const result = await response.json()
			const updatedRemaning = await getData("/remaning")
			console.log(updatedRemaning)
		}
		remaningForm.removeChild(loadingIndicator)
	} catch (error) {
		console.log("Error", error)
	}
})

window.addEventListener("load", (event) => {
	Promise.all([getData("/rates"), getData("/remaning")])
		.then(([ratesData, remaningData]) => {
			console.log("Rates data:", ratesData)
			console.log("Remaining data:", remaningData)
		})
		.catch((error) => {
			console.error("Error:", error)
		})
})