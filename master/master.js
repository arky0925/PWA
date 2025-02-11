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

document.addEventListener('DOMContentLoaded', () => {
	// localStorageからテーマカラーを取得
	const headerColor = localStorage.getItem('headerColor') || '#C9A7A3'; // デフォルト色
	const backgroundColor = localStorage.getItem('backgroundColor') || '#fff2f2'; // デフォルト色
	const buttonColor = localStorage.getItem('buttonColor') || '#FFC4C4'; // デフォルト色

	document.documentElement.style.setProperty('--header-color', headerColor);
	document.documentElement.style.setProperty('--background-color', backgroundColor);
	document.documentElement.style.setProperty('--button-color', buttonColor);
});