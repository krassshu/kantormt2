const adminNick = document.querySelector(".nav__nick")
const storedUser = localStorage.getItem("6546613999528")

if (storedUser) {
	const nick = JSON.parse(storedUser)
	adminNick.textContent = nick.username
}

async function changeTicketStatus(id, status, currentFilterStatus) {
	try {
		const response = await fetch("/exchange", {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id, status }),
		})

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		const data = await response.json()
		// console.log(data.message)

		displayTickets(currentFilterStatus)
	} catch (error) {
		console.error(
			`Error occurred while updating ticket status: ${error.message}`
		)
	}
}

async function displayTickets(filterStatus) {
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

		container.innerHTML = ""

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
                    <button type="submit" class="${buttonClass}" onclick="changeTicketStatus('${
					el._id
				}', '${!el.resolved}', '${filterStatus}')">${ticketStatus}</button>
                </div>`

				container.insertAdjacentHTML("beforeend", html)
			}
		}
	} catch (error) {
		console.error(`Error occurred while fetching data: ${error.message}`)
	}
}

window.addEventListener("load", () => displayTickets("unresolved"))

const select = document.getElementById("type")
select.addEventListener("change", async (event) => {
	displayTickets(event.target.value)
})
