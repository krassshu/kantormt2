const adminNick = document.querySelector(".nav__nick")
const storedUser = localStorage.getItem("6546613999528")

if (storedUser) {
	const nick = JSON.parse(storedUser)
	adminNick.textContent = nick.username
}

// Fetch utilities
const fetchOptions = (method, body) => ({
	method,
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify(body),
})

async function makeRequest(url, options) {
	const response = await fetch(url, options)
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`)
	}
	return await response.json()
}

// Post operations
async function deletePost(id) {
	try {
		await makeRequest("/article", fetchOptions("DELETE", { id }))
		displayPosts()
	} catch (error) {
		console.log(error)
	}
}

async function editPost(id, content) {
	try {
		await makeRequest("/article", fetchOptions("PATCH", { id, content }))
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


function getElements(selector) {
	return document.querySelectorAll(selector)
}

function toggleDisplay(index, selector) {
	const elements = getElements(selector)
	elements[index].style.display =
		elements[index].style.display === "flex" ? "" : "flex"
}

function toggleEdit(index) {
	const textAreas = getElements(".posts__post-content")
	const saveBtns = getElements(".save")
	const editBtns = getElements(".edit")

	textAreas[index].toggleAttribute("disabled")
	textAreas[index].classList.toggle("textarea-on")
	saveBtns[index].classList.toggle("show-btn")
	editBtns[index].classList.toggle("hide")
}

const startDelete = (index) => toggleDisplay(index, ".post-confirmation")
const abordDelete = (index) => toggleDisplay(index, ".post-confirmation")
const startEdit = (index) => toggleEdit(index)

const updatePost = (index, id) => {
	const textAreas = getElements(".posts__post-content")
	const content = textAreas[index].value

	editPost(id, content)
	toggleEdit(index)
}

window.addEventListener("load", async () => await displayPosts())
