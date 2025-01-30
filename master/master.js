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
	// スワイプ開始位置を記録
	startX = event.touches[0].clientX;
});

document.addEventListener('touchmove', (event) => {
	const currentX = event.touches[0].clientX;
	const diffX = currentX - startX;

	// 左端50pxから10px以上スワイプした場合
	if (startX <= 50 && diffX > 10) {
		event.preventDefault(); // デフォルトの動作をキャンセル
	}
}, { passive: false });