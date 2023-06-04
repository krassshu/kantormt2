const adminNick = document.querySelector(".nav__nick")
const storedUser = localStorage.getItem("6546613999528")

if (storedUser) {
	const nick = JSON.parse(storedUser)
	adminNick.textContent = nick.username
}
