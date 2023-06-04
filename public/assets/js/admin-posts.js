const adminNick = document.querySelector(".nav__nick")
const storedUser = localStorage.getItem("6546613999528")

if (storedUser) {
	const nick = JSON.parse(storedUser)
	adminNick.textContent = nick.username
}

async function deletePost(id) {
	try {
		const response = await fetch("/article", {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id }),
		})

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		const data = await response.json()
		displayPosts()
	} catch (error) {
		console.log(error)
	}
}

async function editPost(id, content) {
	try {
		const response = await fetch("/article", {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ id, content }),
		})
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		const data = await response.json()
		displayPosts()
	} catch (error) {
		console.log(error)
	}
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

		const container = document.querySelector(".posts")
		container.textContent = ""

		const data = await response.json()
		for (const [index, el] of data.entries()) {
			const html = `<div class="posts__post">
		<div class="posts__post-header">
			<p class="post-owner">${el.username}</p>
			<div class="posts__post-header--action">
				<button class="btn save" onclick="updatePost(${index},'${el._id}')">Save</button>
				<button class="btn edit" onclick="startEdit(${index})">Edit</button>
				<button class="btn delete" onclick="startDelete(${index})">Delete</button>
			</div>
		</div>
		<textarea
			name="post-content"
			data-id="${el._id}"
			class="posts__post-content"
			disabled
		>${el.content}</textarea>
		<div class="post-confirmation">
			<button class="btn confirm-delete" onclick="deletePost('${el._id}')">
				Confirm delete
			</button>
			<button class="btn cancel" onclick="abordDelete(${index})">Cancel</button>
		</div>
	</div>`

			container.insertAdjacentHTML("beforeend", html)
		}
	} catch (error) {
		console.log(error)
	}
}

const startDelete = (index) => {
	const delBgc = document.querySelectorAll(".post-confirmation")
	delBgc[index].style.display = "flex"
}
const abordDelete = (index) => {
	const delBgc = document.querySelectorAll(".post-confirmation")
	delBgc[index].style.display = ""
}

const startEdit = (index) => {
	const textArea = document.querySelectorAll(".posts__post-content")
	const saveBtn = document.querySelectorAll(".save")
	const editBtn = document.querySelectorAll(".edit")
	textArea[index].removeAttribute("disabled")
	textArea[index].classList.add("textarea-on")
	saveBtn[index].classList.add("show-btn")
	editBtn[index].classList.add("hide")
}
const updatePost = (index, id) => {
	const textArea = document.querySelectorAll(".posts__post-content")
	const saveBtn = document.querySelectorAll(".save")
	const editBtn = document.querySelectorAll(".edit")
	const content = textArea[index].value

	editPost(id, content)

	textArea[index].setAttribute("disabled", "")
	textArea[index].classList.remove("textarea-on")
	saveBtn[index].classList.remove("show-btn")
	editBtn[index].classList.remove("hide")
}

window.addEventListener("load", async () => await displayPosts())
