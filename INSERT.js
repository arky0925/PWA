const scriptURL = 'https://script.google.com/macros/s/AKfycbz1PLhTKOiSCH6rTVkuJ-5r5hPYZV8RsMbO7U7hv3wM9gb6vUTuwBLsPQ16jz9RmPNz/exec';

// import scriptURL from './config.js'; // デフォルトインポート

const form = document.forms['contact-form'];

form.addEventListener('submit', e => {
    e.preventDefault();

    // FormDataにactionパラメータを追加
    const formData = new FormData(form);
    formData.append('action', 'add'); // actionを'add'に設定

    fetch(scriptURL, { method: 'POST', body: formData })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // レスポンスをJSON形式で取得
        })
        .then(data => {
            alert("登録しました。");
            console.log(data); // レスポンスデータをログに出力（デバッグ用）
            window.location.reload(); // ページをリロード
        })
        .catch(error => console.error('Error!', error.message));

    localStorage.removeItem('spreadsheetData');
    // alert('キャッシュがクリアされました。');
});
