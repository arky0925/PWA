document.addEventListener('DOMContentLoaded', function() {
	// 各ボタンのクリックイベントを設定
	document.getElementById('homeButton').addEventListener('click', function() {
		window.location.href = 'top.html'; // 遷移先のページ
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

document.addEventListener("touchstart", function (event) {
	if (event.touches[0].pageX < 10) { // 画面の左端10px以内
		event.preventDefault();
	}
}, { passive: false });