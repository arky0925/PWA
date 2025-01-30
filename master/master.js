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

let startX;

document.addEventListener('touchstart', (event) => {
	startX = event.touches[0].clientX; // スワイプ開始位置を記録
});

document.addEventListener('touchmove', (event) => {
	const currentX = event.touches[0].clientX;
	const diffX = currentX - startX;

	// 右にスワイプした場合
	if (diffX < 50) {
		event.preventDefault(); // デフォルトの戻る動作をキャンセル
	}
});