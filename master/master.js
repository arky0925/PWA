document.addEventListener('DOMContentLoaded', function() {
	// 各ボタンのクリックイベントを設定
	document.getElementById('homeButton').addEventListener('click', function() {
		window.location.href = 'index.html'; // 遷移先のページ
	});

	document.getElementById('couponButton').addEventListener('click', function() {
		window.location.href = 'WAB.html'; // 遷移先のページ
	});

	document.getElementById('memoryButton').addEventListener('click', function() {
		window.location.href = 'WAC.html'; // 遷移先のページ
	});

	document.getElementById('stampButton').addEventListener('click', function() {
		window.location.href = 'WAD.html'; // 遷移先のページ
	});

	document.getElementById('knowledgeButton').addEventListener('click', function() {
		window.location.href = 'WAE.html'; // 遷移先のページ
	});
});

window.history.pushState(null, null, location.href);
window.addEventListener("popstate", function () {
	window.history.pushState(null, null, location.href);
});