//document.addEventListener("touchstart", function (event) {
//	if (event.touches[0].pageX < 100) { // 画面の左端100px以内
//		event.preventDefault();
//	}
//}, { passive: false });

// テーマ設定開閉
const optionTheme = document.getElementById('optionTheme');
document.addEventListener('DOMContentLoaded', () => {
	// オプションを開く
	document.getElementById('theme').addEventListener('click', () => {
		optionTheme.classList.add('open');
	});
	// メニューを閉じる
	document.getElementById('closeOptionTheme').addEventListener('click', () => {
		optionTheme.classList.remove('open');
	});
});

function changeThemeColor(headerColor, backgroundColor, buttonColor) {
	document.documentElement.style.setProperty('--header-color', headerColor);
	document.documentElement.style.setProperty('--background-color', backgroundColor);
	document.documentElement.style.setProperty('--button-color', buttonColor);

	// localStorageに保存
	localStorage.setItem('headerColor', headerColor);
	localStorage.setItem('backgroundColor', backgroundColor);
	localStorage.setItem('buttonColor', buttonColor);
}

document.addEventListener('DOMContentLoaded', () => {
	// localStorageからテーマカラーを取得
	const headerColor = localStorage.getItem('headerColor') || '#C9A7A3'; // デフォルト色
	const backgroundColor = localStorage.getItem('backgroundColor') || '#fff2f2'; // デフォルト色
	const buttonColor = localStorage.getItem('buttonColor') || '#FFC4C4'; // デフォルト色

	// カラーを適用
	changeThemeColor(headerColor, backgroundColor, buttonColor);

	// イベントリスナーの設定
	document.getElementById('colorCheck1').addEventListener('click', () => {
		changeThemeColor('#C9A7A3', '#fff2f2', '#FFC4C4');
	});
	document.getElementById('colorCheck2').addEventListener('click', () => {
		changeThemeColor('#F44336', '#FFEBEE', '#FF8A80');
	});
	document.getElementById('colorCheck3').addEventListener('click', () => {
		changeThemeColor('#9C27B0', '#E1BEE7', '#EA80FC');
	});
	document.getElementById('colorCheck4').addEventListener('click', () => {
		changeThemeColor('#2196F3', '#E3F2FD', '#82B1FF');
	});
	document.getElementById('colorCheck5').addEventListener('click', () => {
		changeThemeColor('#009688', '#E0F2F1', '#A7FFEB');
	});
	document.getElementById('colorCheck6').addEventListener('click', () => {
		changeThemeColor('#FFEB3B', '#FFFDE7', '#FFFF8D');
	});
	document.getElementById('colorCheck7').addEventListener('click', () => {
		changeThemeColor('#795548', '#EFEBE9', '#8D6E63');
	});
	document.getElementById('colorCheck8').addEventListener('click', () => {
		changeThemeColor('#607D8B', '#ECEFF1', '#78909C');
	});
});

// パスコード設定開閉
const optionPassword = document.getElementById('optionPassword');
document.addEventListener('DOMContentLoaded', () => {
	// オプションを開く
	document.getElementById('password').addEventListener('click', () => {
		optionPassword.classList.add('open');
	});
	// メニューを閉じる
	document.getElementById('closeOptionPassword').addEventListener('click', () => {
		optionPassword.classList.remove('open');
	});
});

const passToggle = document.getElementById('passToggle');
const passwordChangeBlock = document.getElementById('passwordChangeBlock');
const passwordSettig = document.getElementById('passwordSettig');
const passwordCancel = document.getElementById('passwordCancel');
let previousPassAction = null; // 前のアクションを格納する変数
document.addEventListener('DOMContentLoaded', () => {

	passToggle.checked = registrationSuccess;
	passwordChangeBlock.style.display = registrationSuccess ? 'flex' : 'none';

	passToggle.addEventListener('change', () => {
		message.textContent = ''; // メッセージをクリア
		previousPassAction = "passToggle";
		if (passToggle.checked == true) {
			passwordSettig.classList.add('open');
			digitInputs[0].focus(); // ページが読み込まれたときに最初の入力ボックスにフォーカスを設定
		} else {
			localStorage.setItem('registrationSuccess', 'false');
			localStorage.removeItem('userPassword'); // パスワードをローカルストレージに保存
			passwordChangeBlock.style.display = 'none';
			passToggle.checked = false;
		}
	});

	passwordChangeBlock.addEventListener('click', () => {
		message.textContent = ''; // メッセージをクリア
		passwordSettig.classList.add('open');
		digitInputs[0].focus(); // ページが読み込まれたときに最初の入力ボックスにフォーカスを設定
		previousPassAction = "passwordChange";
	});

	// メニューを閉じる
	passwordCancel.addEventListener('click', () => {
		passwordSettig.classList.remove('open');
		message.textContent = ''; // メッセージをクリア
		if (previousPassAction === "passToggle") {
			passToggle.checked = false;
		}
		// 入力をリセット
		digitInputs.forEach(input => input.value = ''); // 1回目の入力クリア
		for (let i = 0; i < digitInputs.length; i++) {
			digitInputs[i].disabled = true; // 他の桁を無効にする
		}
		digitInputs[0].disabled = false;
		verifyInputs.forEach(input => input.value = ''); // 2回目の入力クリア
		for (let i = 0; i < verifyInputs.length; i++) {
			verifyInputs[i].disabled = true; // 他の桁を無効にする
		}
		verifyInputs[0].disabled = false;
		firstSection.style.display = 'block'; // 1回目のパスワード画面を再表示
		verifySection.style.display = 'none'; // 確認セクションを非表示にする
		document.activeElement.blur();
	});
});

let registrationSuccess = localStorage.getItem('registrationSuccess') === 'true';
let message = document.getElementById('message');
const digitInputs = document.querySelectorAll('#firstSection .digit-input');
const verifyInputs = document.querySelectorAll('#verifySection .digit-input');
const firstSection = document.getElementById('firstSection');
const verifySection = document.getElementById('verifySection');
document.addEventListener('DOMContentLoaded', () => {
	let firstPassword = '';
	// 入力ボックスの自動フォーカス処理
	digitInputs.forEach((input, index) => {
		input.addEventListener('input', () => {
			// 半角数字でない場合はクリア
			if (!/^[0-9]*$/.test(input.value)) {
				input.value = '';
			}
			// 次の桁を有効にする
			if (input.value.length === 1) {
				if (index < digitInputs.length - 1) {
					digitInputs[index + 1].disabled = false; // 次の桁を有効にする
					digitInputs[index + 1].focus(); // 次の桁にフォーカスを移動
				}
				// 現在の桁以外を無効にする
				for (let i = 0; i < digitInputs.length; i++) {
					if (i !== index + 1) {
						digitInputs[i].disabled = true;
					}
				}
			}
			if (input.value.length === 1 && index < digitInputs.length - 1) {
				digitInputs[index + 1].focus(); // 次の入力ボックスにフォーカス
				input.type = 'text';
				input.type = 'password';
			}
			// すべての入力ボックスが埋まったらパスワードを確認
			if (Array.from(digitInputs).every(input => input.value.length === 1)) {
				firstPassword = Array.from(digitInputs).map(input => input.value).join('');
				message.textContent = 'パスコードが登録されました。次にもう一度入力してください。';
				message.style.color = 'green'; // 成功メッセージの色
				firstSection.style.display = 'none';
				verifySection.style.display = 'block';
				verifyInputs[0].focus(); // 確認の最初の入力ボックスにフォーカス
				digitInputs.forEach(input => input.value = ''); // 1回目の入力クリア
				for (let i = 0; i < digitInputs.length; i++) {
					digitInputs[i].disabled = true; // 他の桁を無効にする
				}
				digitInputs[0].disabled = false;
			}
		});
		// バックスペースで前のボックスに移動
		input.addEventListener('keydown', (event) => {
			if (event.key === 'Backspace' && input.value === '') {
				if (index > 0) {
					input.type = 'text';
					input.type = 'password';
					digitInputs[index - 1].disabled = false; // 前の桁を有効にする
					digitInputs[index - 1].value = '';
					digitInputs[index - 1].focus(); // 前の入力ボックスにフォーカス
					// 現在の桁以外を無効にする
					for (let i = 0; i < digitInputs.length; i++) {
						if (i !== index - 1) {
							digitInputs[i].disabled = true; // 他の桁を無効にする
						}
					}
				}
			}
		});
		passwordSettig.addEventListener('click', (event) => {
			if (event.target !== input && event.target !== passwordCancel) {
				input.focus(); // inputにフォーカスを戻す
			}
		});
	});

	// 確認のための入力ボックス
	verifyInputs.forEach((input, index) => {
		input.addEventListener('input', () => {
			// 半角数字でない場合はクリア
			if (!/^[0-9]*$/.test(input.value)) {
				input.value = '';
			}
			// 次の桁を有効にする
			if (input.value.length === 1) {
				if (index < verifyInputs.length - 1) {
					verifyInputs[index + 1].disabled = false; // 次の桁を有効にする
					verifyInputs[index + 1].focus(); // 次の桁にフォーカスを移動
				}
				// 現在の桁以外を無効にする
				for (let i = 0; i < verifyInputs.length; i++) {
					if (i !== index + 1) {
						verifyInputs[i].disabled = true;
					}
				}
			}
			if (input.value.length === 1 && index < verifyInputs.length - 1) {
				verifyInputs[index + 1].focus(); // 次の入力ボックスにフォーカス
				input.type = 'text';
				input.type = 'password'; // 入力されたらアスタリスクにする
			}
			// すべての確認入力ボックスが埋まったら比較
			if (Array.from(verifyInputs).every(input => input.value.length === 1)) {
				const verifyPassword = Array.from(verifyInputs).map(input => input.value).join('');
				// パスワードが一致するか確認
				if (firstPassword === verifyPassword) {
					localStorage.setItem('userPassword', firstPassword); // パスワードをローカルストレージに保存
					localStorage.setItem('registrationSuccess', 'true');
					passwordSettig.classList.remove('open');
					// 入力をリセット
					verifyInputs.forEach(input => input.value = ''); // 2回目の入力クリア
					// 現在の桁以外を無効にする
					for (let i = 0; i < verifyInputs.length; i++) {
						verifyInputs[i].disabled = true; // 他の桁を無効にする
					}
					verifyInputs[0].disabled = false;
					firstSection.style.display = 'block';
					verifySection.style.display = 'none'; // 確認セクションを非表示にする
					passwordChangeBlock.style.display = 'flex';
					passToggle.checked = true;
				} else {
					message.textContent = 'パスワードが一致しません。もう一度入力してください。';
					message.style.color = 'red'; // エラーメッセージの色
					// 入力をリセット
					verifyInputs.forEach(input => input.value = ''); // 2回目の入力クリア
					// 現在の桁以外を無効にする
					for (let i = 0; i < verifyInputs.length; i++) {
						verifyInputs[i].disabled = true; // 他の桁を無効にする
					}
					verifyInputs[0].disabled = false;
					verifyInputs.forEach(input => input.value = '');
					firstSection.style.display = 'block'; // 1回目のパスワードを再表示
					verifySection.style.display = 'none'; // 確認セクションを非表示にする
					digitInputs[0].focus(); // 最初の入力ボックスにフォーカス
					input.type = 'text';
					input.type = 'password';
				}
			}
		});
		// バックスペースで前のボックスに移動
		input.addEventListener('keydown', (event) => {
			if (event.key === 'Backspace' && input.value === '') {
				if (index > 0) {
					input.type = 'text';
					input.type = 'password';
					verifyInputs[index - 1].disabled = false; // 前の桁を有効にする
					verifyInputs[index - 1].value = '';
					verifyInputs[index - 1].focus(); // 前の入力ボックスにフォーカス
					// 現在の桁以外を無効にする
					for (let i = 0; i < verifyInputs.length; i++) {
						if (i !== index - 1) {
							verifyInputs[i].disabled = true; // 他の桁を無効にする
						}
					}
				}
			}
		});
		passwordSettig.addEventListener('click', (event) => {
			if (event.target !== input && event.target !== passwordCancel) {
				input.focus(); // inputにフォーカスを戻す
			}
		});
	});
});

function getLocalStorageSize() {
	let total = 0;
	// localStorageの各アイテムのサイズを計算
	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i);
		const value = localStorage.getItem(key);
		total += key.length + value.length; // キーと値のサイズを加算
	}
	// サイズをKB単位に変換
	const sizeInKB = total / 1024;
	return sizeInKB.toFixed(2); // 小数点以下2桁にフォーマット
}

// 容量をHTMLに表示
document.addEventListener('DOMContentLoaded', () => {
	const storageSizeElement = document.getElementById('storageSize');
	const size = getLocalStorageSize();
	storageSizeElement.textContent += `${size} KB`;
});

//function clearLocalStorageExcept(exceptKeys) {
//	// localStorageの全てのキーを取得
//	const keys = Object.keys(localStorage);
//	// exceptKeysに含まれないキーを削除
//	keys.forEach(key => {
//		if (!exceptKeys.includes(key)) {
//			localStorage.removeItem(key);
//		}
//	});
//}

document.getElementById('chacheClear').addEventListener('click', () => {
	localStorage.removeItem('spreadsheetData');
	localStorage.removeItem('templateData');
	window.location.href = 'WAE.html';
});