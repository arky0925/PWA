const scriptURL = 'https://script.google.com/macros/s/AKfycbyPfHepmIjir1EKxbqzKsZ3s0Mghhe2E_0UhCnbHUz3wU106JzDy2KpbAyBc6cQo1r2/exec'

document.getElementById('fetchDataButton').addEventListener('click', () => {
	fetchData();
});

function fetchData() {
	const cachedData = localStorage.getItem('spreadsheetData');

	if (cachedData) {
		// キャッシュが存在する場合はそれを使用
		displayData(JSON.parse(cachedData));
	} else {
		// キャッシュがない場合はスプレッドシートからデータを取得
    fetch(scriptURL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
			// キャッシュにデータを保存
			localStorage.setItem('spreadsheetData', JSON.stringify(data));
                displayData(data);
            })
            .catch(error => console.error('Error!', error.message));
    }
}

        // データをリストに表示する関数
        function displayData(data) {
            const display = document.getElementById('dataDisplay');
            display.innerHTML = ''; // 既存の内容をクリア

            data.forEach((row, rowIndex) => {
                const listItem = document.createElement('li'); // リストアイテムを作成
                const checkbox = document.createElement('input'); // チェックボックスを作成
                checkbox.type = 'checkbox';
                checkbox.checked = row[0] === true; // チェックボックスの状態を設定
                // チェックボックスの変更イベント
                checkbox.addEventListener('change', (event) => {
                    // チェックボックスの変更時にリストアイテムのクリックイベントをトリガーしない
                    event.stopPropagation();
                    updateCheckbox(rowIndex + 2, checkbox.checked); // 行番号は1ベースなので+2
                });


                // 2列目の要素をリストアイテムに追加
                const secondColumnText = row[1] || ''; // 2列目の値を取得（存在しない場合は空文字）
                
                listItem.appendChild(checkbox); // チェックボックスをリストアイテムに追加
                listItem.appendChild(document.createTextNode(` ${secondColumnText}`)); // 2列目のテキストを追加

                // リストアイテムにデータ属性を追加
                listItem.dataset.rowIndex = rowIndex + 2; // 行番号をデータ属性に追加

                // リストアイテムにクリックイベントを追加
        listItem.addEventListener('click', (event) => {
            if (event.target !== checkbox) { // クリックがチェックボックスでない場合のみ遷移
                const rowIndex = listItem.dataset.rowIndex; // 行番号を取得
                const secondColumnText = row[1] || ''; // 2列目の値を取得
        const thirdColumnText = row[2] || ''; // 3列目の値を取得
        const encodedSecondColumn = encodeURIComponent(secondColumnText); // 2列目のテキストをエンコード
        const encodedThirdColumn = encodeURIComponent(thirdColumnText); // 3列目のテキストをエンコード
                window.location.href = `UPDATE.html?row=${rowIndex}&data1=${encodedSecondColumn}&data2=${encodedThirdColumn}`; // 編集ページに遷移
            }
        });
                
                display.appendChild(listItem); // リストに追加
            });
        }

function updateCheckbox(row, isChecked) {
    const action = isChecked ? 'update' : 'uncheck'; // 更新アクションの決定
    fetch(scriptURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            action: action,
            row: row,
            // チェックボックスの列のインデックスを追加
            checkbox: isChecked,
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

document.getElementById('clearCacheButton').addEventListener('click', () => {
    localStorage.removeItem('spreadsheetData');
    alert('キャッシュがクリアされました。');
});