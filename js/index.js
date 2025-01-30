document.addEventListener('DOMContentLoaded', () => {
	// ローカルストレージからパスワードを取得
	const storedPassword = localStorage.getItem('userPassword');

	// パスワードが設定されている場合
	if (storedPassword) {
		// パスワード設定画面に遷移
		window.location.href = 'Login.html';
	} else {
		// パスワードが設定されていない場合、トップ画面に遷移
		window.location.href = 'top.html';
	}
});
