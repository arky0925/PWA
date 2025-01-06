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

// ページが読み込まれた後に実行
document.addEventListener('DOMContentLoaded', function() {
    // ボタンのクリックイベントを設定
    document.getElementById('homeButton').addEventListener('click', function() {
        window.location.href = 'index.html'; // 遷移先のページ
    });
});

// ページが読み込まれた後に実行
document.addEventListener('DOMContentLoaded', function() {
    // ボタンのクリックイベントを設定
    document.getElementById('couponButton').addEventListener('click', function() {
        window.location.href = 'INSERT.html'; // 遷移先のページ
    });
});

// ページが読み込まれた後に実行
document.addEventListener('DOMContentLoaded', function() {
    // ボタンのクリックイベントを設定
    document.getElementById('memoryButton').addEventListener('click', function() {
        window.location.href = 'SELECT.html'; // 遷移先のページ
    });
});

// ページが読み込まれた後に実行
document.addEventListener('DOMContentLoaded', function() {
    // ボタンのクリックイベントを設定
    document.getElementById('stampButton').addEventListener('click', function() {
        window.location.href = 'stamp.html'; // 遷移先のページ
    });
});

// ページが読み込まれた後に実行
document.addEventListener('DOMContentLoaded', function() {
    // ボタンのクリックイベントを設定
    document.getElementById('knowledgeButton').addEventListener('click', function() {
        window.location.href = 'knowledge.html'; // 遷移先のページ
    });
});

