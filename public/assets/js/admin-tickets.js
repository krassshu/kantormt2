async function getAndDisplayTickets(filterStatus) {
	try {
		const response = await fetch("/exchange", {
			method: "GET",
			headers: { "Content-Type": "application/json" },
		})

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		const data = await response.json()
		const container = document.querySelector(".tickets__con")

		container.innerHTML = "" // clear the container before appending new data

		for (const el of data) {
			if (
				filterStatus === "all" ||
				filterStatus === (el.resolved ? "resolved" : "unresolved")
			) {
				const ticketStatus = el.resolved ? "resolved" : "unresolved"
				const buttonClass = `tickets__con-ticket-${ticketStatus}`
				const html = `<div class="tickets__con-ticket">
                    <p class="tickets__con-ticket-id">${el._id}</p>
                    <p class="tickets__con-ticket-metin">${el.serverNick}</p>
                    <p class="tickets__con-ticket-discord">${el.discordNick}</p>
                    <p class="tickets__con-ticket-from">${el.serverFrom}</p>
                    <p class="tickets__con-ticket-amount">${el.amountFrom}</p>
                    <p class="tickets__con-ticket-to">${el.serverTo}</p>
                    <p class="tickets__con-ticket-amount">${el.amountTo}</p>
                    <p class="tickets__con-ticket-date">${el.date}</p>
                    <button type="submit" class="${buttonClass}">${ticketStatus}</button>
                </div>`

				container.insertAdjacentHTML("beforeend", html)
			}
		}
	} catch (error) {
		console.error(`Error occurred while fetching data: ${error.message}`)
	}
}

window.addEventListener("load", () => getAndDisplayTickets("unresolved"))

const select = document.getElementById("type")
select.addEventListener("change", async (event) => {
	getAndDisplayTickets(event.target.value)
})
