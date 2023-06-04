const adminNick = document.querySelector(".nav__nick")
const storedUser = localStorage.getItem("6546613999528")
const editBtn = document.getElementById("edit")
const deleteBtn = document.getElementById("delete")
const saveBtn = document.getElementById("save")
const confirmDeleteBtn = document.getElementById("confirm-delete")

if (storedUser) {
	const nick = JSON.parse(storedUser)
	adminNick.textContent = nick.username
}




async function displayPosts() {
	try {
		const response = await fetch("/article", {
			method: "GET",
			headers: { "Content-Type": "application/json" },
		})

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		const data = await response.json()
		const container = document.querySelector(".posts")
		console.log(data)
		for (const el of data) {
			const html = `<div class="posts__post">
		<div class="posts__post-header">
			<p class="post-owner">${el.username}</p>
			<div class="posts__post-header--action">
				<button id="save" class="btn" type="submit">Save</button>
				<button id="edit" class="btn" type="submit">Edit</button>
				<button id="delete" class="btn">Delete</button>
			</div>
		</div>
		<textarea
			name="post-content"
			data-id="${el.id}"
			class="posts__post-content"
			disabled
		>${el.content}</textarea>
		<div class="post-confirmation">
			<button id="confirm-delete" class="btn" type="submit">
				Confirm delete
			</button>
			<button class="btn cancel">Cancel</button>
		</div>
	</div>`
			container.insertAdjacentHTML("beforeend", html)
		}
	} catch (error) {
		console.log(error)
	}
}

window.addEventListener("load", async () => await displayPosts())
