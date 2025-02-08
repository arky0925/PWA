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

	// 各ボタンのクリックイベントを設定
	document.getElementById('newsButton').addEventListener('click', () => {
		window.location.href = 'index.html'; // 遷移先のページ
	});

	document.getElementById('couponButton2').addEventListener('click', () => {
		window.location.href = 'WAB.html'; // 遷移先のページ
	});

	document.getElementById('stampButton2').addEventListener('click', () => {
		window.location.href = 'WAD.html'; // 遷移先のページ
	});

	document.getElementById('profileButton').addEventListener('click', () => {
		window.location.href = 'WAF.html'; // 遷移先のページ
	});

	document.getElementById('memoryButton2').addEventListener('click', () => {
		window.location.href = 'WAC.html'; // 遷移先のページ
	});

	document.getElementById('knowledgeButton2').addEventListener('click', () => {
		window.location.href = 'WAE.html'; // 遷移先のページ
	});
});

const radioButtons = document.querySelectorAll('input[name="radio-btn"]');
let currentIndex = 0;
let intervalId;

// ラジオボタンを自動で切り替える関数
function startAutoSwitch() {
	intervalId = setInterval(() => {
		// 次のインデックスを計算
		currentIndex = (currentIndex + 1) % radioButtons.length; // 循環するように
		radioButtons[currentIndex].checked = true; // 新しいラジオボタンを選択
	}, 3000);
}

// 自動切り替えを開始
startAutoSwitch();

// 手動での切り替えに応じてcurrentIndexを更新し、カウントをリセット
radioButtons.forEach((radioButton, index) => {
	radioButton.addEventListener('change', () => {
		currentIndex = index; // 手動で選択したラジオボタンのインデックスを更新
		clearInterval(intervalId); // 現在のインターバルをクリア
		startAutoSwitch(); // 新たに自動切り替えを開始
	});
});