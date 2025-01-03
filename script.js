document.addEventListener("DOMContentLoaded", () => {
	const menuIcon = document.getElementById("menu-icon");
	const sideMenu = document.getElementById("side-menu");
	const closeMenu = document.getElementById("close-menu");

	// メニューを開く
	menuIcon.addEventListener("click", () => {
		sideMenu.classList.add("open");
	});

	// メニューを閉じる
	closeMenu.addEventListener("click", () => {
		sideMenu.classList.remove("open");
	});
});