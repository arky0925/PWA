const scriptURL = 'https://script.google.com/macros/s/AKfycbyuyq7jC2YTAbIOzZUIQPcw-QMTxJ5jpNcWOkm0f1lCTzH3Q2t1XgC4X_KQHKjJL-yT/exec'

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