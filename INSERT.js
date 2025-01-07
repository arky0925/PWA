const scriptURL = 'https://script.google.com/macros/s/AKfycbyPfHepmIjir1EKxbqzKsZ3s0Mghhe2E_0UhCnbHUz3wU106JzDy2KpbAyBc6cQo1r2/exec'

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