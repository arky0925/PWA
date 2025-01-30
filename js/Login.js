const userPassword = localStorage.getItem('userPassword');

let message = document.getElementById('message');
const digitInputs = document.querySelectorAll('#firstSection .digit-input');
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
				if (!(firstPassword === userPassword)) {
					message.textContent = 'パスコードが間違っています';
					message.style.color = 'red'; // 成功メッセージの色
					digitInputs.forEach(input => input.value = ''); // 1回目の入力クリア
					for (let i = 0; i < digitInputs.length; i++) {
						digitInputs[i].disabled = true; // 他の桁を無効にする
					}
					digitInputs[0].disabled = false;
				} else {
					window.location.href = 'top.html';
				}
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
	});
});
