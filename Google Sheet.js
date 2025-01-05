const scriptURL = 'https://script.google.com/macros/s/AKfycbw2A8DoHuiynu_nE8rqY1291yVgEgh8GRMJO833mbbRv6L4VYfp5ah1q8niX_YR--IK/exec'

const form = document.forms['contact-form']

form.addEventListener('submit', e => {
	e.preventDefault()
	fetch(scriptURL, { method: 'POST', body: new FormData(form)})
	.then(response => alert("登録しました。" ))
	.then(() => { window.location.reload(); })
	.catch(error => console.error('Error!', error.message))
})
