const scriptURL = 'https://script.google.com/macros/s/AKfycbw1B8X2A0o2qt0Fd-6nID1XoXdP1VdJoXxUzJjvO7Z7dc7k8Q3qgFloYzhcKe0eHu3m/exec'

const form = document.forms['contact-form']

form.addEventListener('submit', e => {
	e.preventDefault()
	fetch(scriptURL, { method: 'POST', body: new FormData(form)})
	.then(response => alert("登録しました。" ))
	.then(() => { window.location.reload(); })
	.catch(error => console.error('Error!', error.message))
})

