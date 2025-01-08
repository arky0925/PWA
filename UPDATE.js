const scriptURL = 'https://script.google.com/macros/s/AKfycbwgUnTSNjkoCI8ekHeD5REW8ZFa9SEVKhmKC_cyMzkE_R6VEz5IEswkJJFO_rZ3sQ7_/exec'

//import scriptURL from './config.js'; // デフォルトインポート

	const form = document.forms['contact-form']

// フォーム送信時の処理
        document.getElementById('editForm').addEventListener('submit', function(event) {
            event.preventDefault();

            const params = getQueryParams();
            const rowIndex = params.row;

            fetch(scriptURL, {
                method: 'POST',
                body: new URLSearchParams({
                    action: 'update',
                    row: rowIndex,
                    data1: document.getElementById('dataInput1').value,
                    data2: document.getElementById('dataInput2').value
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.result === 'success') {
                    alert("データが更新されました。");
                    // 更新されたデータをフォームに表示
            document.getElementById('dataInput1').value = data.data[0]; // 更新されたデータ1
            document.getElementById('dataInput2').value = data.data[1]; // 更新されたデータ2
                } else {
                    alert("更新に失敗しました。");
                }
            })
            .catch(error => console.error('Error!', error.message));
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
        };

        // ページロード時にデータを取得して表示
        window.onload = function() {
            const params = getQueryParams();
            const rowIndex = params.row; // 行番号を取得

            // 行番号を使ってスプレッドシートからデータを取得
            fetch(`${scriptURL}?action=get&row=${rowIndex}`)
                .then(response => response.json())
                .then(data => {
                    if (data.length > 0) {
                        document.getElementById('dataInput1').value = data[0][1]; // 2列目のデータ
                        document.getElementById('dataInput2').value = data[0][2]; // 3列目のデータ
                    } else {
                        console.error('No data found for this row.');
                    }
                })
                .catch(error => console.error('Error fetching data:', error));
        };