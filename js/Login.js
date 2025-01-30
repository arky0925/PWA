let registrationSuccess = localStorage.getItem('registrationSuccess') === 'true';

const body = document.getElementById('body');
body.style.display = registrationSuccess ? 'block' : 'none';

let message = document.getElementById('message');
const digitInputs = document.querySelectorAll('#firstSection .digit-input');
document.addEventListener('DOMContentLoaded', () => {

	let firstPassword = '';
	digitInputs[0].focus(); // ページが読み込まれたときに最初の入力ボックスにフォーカスを設定

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
				digitInputs.forEach(input => input.value = ''); // 入力をリセット
				const storedPassword = localStorage.getItem('userPassword');
				if (firstPassword === storedPassword) {
					window.location.href = 'index.html'; // 遷移先のページ
					message.textContent = '';
				} else {
					message.textContent = 'パスコードが間違っています';
					message.style.color = 'red'; // 失敗メッセージの色
					digitInputs[0].focus();
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
					digitInputs[index - 1].focus(); // 前の入力ボックスにフォーカス
				}
			}
		});
	});
});
