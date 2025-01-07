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

// URLパラメータを取得する関数
        function getQueryParams() {
            const params = {};
            const queryString = window.location.search.substring(1);
            const regex = /([^&=]+)=([^&]*)/g;
            let m;

            while (m = regex.exec(queryString)) {
                params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
            }
            return params;
        }

        // ページロード時にデータをフォームに表示
        window.onload = function() {
            const params = getQueryParams();
            const dataInput1 = document.getElementById('dataInput1');
            const dataInput2 = document.getElementById('dataInput2');

            // URLから取得したデータを入力欄に設定
            if (params.data1) {
                dataInput1.value = params.data1;
            }
            if (params.data2) {
                dataInput2.value = params.data2;
            } else {
                console.log("data2 is not set."); // デバッグ用
            }
        };