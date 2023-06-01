const loginForm = document.getElementById("admin-form")

loginForm.addEventListener("submit", async (event) => {
	event.preventDefault()

	const formData = new FormData(loginForm)
	const username = formData.get("username")
	const password = formData.get("password")

	try {
		const response = await fetch("/loginadmin", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username,
				password,
			}),
		})

		if (!response.ok) {
			const error = await response.text()
			console.log(error)
		} else {
			const result = await response.json()
			window.location.href = result.redirectUrl
		}
	} catch (error) {
		console.log("Error", error)
	}
})
