const scriptURL = 'https://script.google.com/macros/s/AKfycbz2Og-umBRxJi2mfcMV8qiA8OroKN03ys4pzeVB2hYzuI1ucT3rYnda53VyHGs4diPO/exec';

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
