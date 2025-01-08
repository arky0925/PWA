const scriptURL = 'https://script.google.com/macros/s/AKfycbwgUnTSNjkoCI8ekHeD5REW8ZFa9SEVKhmKC_cyMzkE_R6VEz5IEswkJJFO_rZ3sQ7_/exec'

//import scriptURL from './config.js'; // デフォルトインポート

const form = document.forms['contact-form']

form.addEventListener('submit', e => {
	e.preventDefault()
	fetch(scriptURL, { method: 'POST', body: new FormData(form)})
	.then(response => alert("登録しました。" ))
	.then(() => { window.location.reload(); })
	.catch(error => console.error('Error!', error.message))

    localStorage.removeItem('spreadsheetData');
//    alert('キャッシュがクリアされました。');
});