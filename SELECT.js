const scriptURL = 'https://script.google.com/macros/s/AKfycbyuyq7jC2YTAbIOzZUIQPcw-QMTxJ5jpNcWOkm0f1lCTzH3Q2t1XgC4X_KQHKjJL-yT/exec'

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

// データをテーブルに表示する関数
function displayData(data) {
    const display = document.getElementById('dataDisplay');
    const CHECKBOX_COLUMN_INDEX = 0; // 例: チェックボックスが1列目にある場合
    display.innerHTML = ''; // 既存の内容をクリア

    data.forEach((row, rowIndex) => {
        const newRow = document.createElement('tr');
        row.forEach((cell, index) => {
            const newCell = document.createElement('td');

            // チェックボックスの列のインデックス（例: 3列目の場合は2）
            if (index === CHECKBOX_COLUMN_INDEX) {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = cell === true; // TRUEの場合はチェックを入れる
                checkbox.addEventListener('change', () => {
                    updateCheckbox(rowIndex + 2, checkbox.checked); // 行番号は1ベースなので+2
                });
                newCell.appendChild(checkbox);
            } else {
                newCell.innerText = cell; // セルの内容を追加
            }

            newRow.appendChild(newCell); // 新しいセルを行に追加
        });
        display.appendChild(newRow); // 新しい行をテーブルに追加
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

//document.getElementById('clearCacheButton').addEventListener('click', () => {
//    localStorage.removeItem('spreadsheetData');
//    alert('キャッシュがクリアされました。');
//});