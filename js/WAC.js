const scriptURL = 'https://script.google.com/macros/s/AKfycbz2Og-umBRxJi2mfcMV8qiA8OroKN03ys4pzeVB2hYzuI1ucT3rYnda53VyHGs4diPO/exec';
 
const updateModal = document.getElementById('updateModal');
const overlay = document.querySelector('.overlay'); // オーバーレイを取得

document.getElementById('fetchDataButton').addEventListener('click', () => {
	fetchData();
});

window.onload = function() {
	fetchData();
};

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
//			localStorage.removeItem('spreadsheetData');
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
				const rowData = JSON.parse(localStorage.getItem('spreadsheetData'))[rowIndex - 2]; // キャッシュから行データを取得
                // モーダルにデータを渡す
                document.getElementById('modalInput1').value = rowData[1] || ''; // データ1を設定
                document.getElementById('modalInput2').value = rowData[2] || ''; // データ2を設定
                
                // 行番号をデータ属性に設定
                updateModal.dataset.rowIndex = rowIndex; // 行番号を設定
                
                // モーダルを表示
                updateModal.style.display = 'block'; // 編集モーダルを表示
                overlay.style.display = 'block'; // オーバーレイを表示
			}
		});

		display.appendChild(listItem); // リストに追加
	});
}

// スプレッドシートを更新する関数
function updateCheckbox(row, isChecked) {
	const action = isChecked ? 'check' : 'uncheck'; // 更新アクションの決定
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
	.then(response => {
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		return response.json();
	})
	.then(data => {
		console.log('Update successful:', data);
		// キャッシュの更新
        const cachedData = JSON.parse(localStorage.getItem('spreadsheetData'));
        const rowIndex = row - 2; // 1ベースから0ベースに変換
        if (cachedData && cachedData[rowIndex]) {
            cachedData[rowIndex][0] = isChecked; // チェックボックスの値を更新
            localStorage.setItem('spreadsheetData', JSON.stringify(cachedData)); // キャッシュを更新
        }

        fetchData(); // 更新後にデータを再取得
//		alert('成功');
	})
	.catch(error => {
		console.error('Error updating spreadsheet:', error);
//		alert('失敗');
	});
}

document.getElementById('clearCacheButton').addEventListener('click', () => {
	localStorage.removeItem('spreadsheetData');
	alert('キャッシュがクリアされました。');
});


// モーダル関連
const insertModal = document.getElementById('insertModal');

document.addEventListener('DOMContentLoaded', function() {
    const closeModal1 = document.getElementById('closeModal1');
    const closeModal2 = document.getElementById('closeModal2');
    const addicon = document.getElementById('add-icon');

    // モーダルを表示
    addicon.addEventListener('click', function() {
        insertModal.style.display = 'block'; // モーダルを表示
        overlay.style.display = 'block'; // オーバーレイを表示
    });
    
    // モーダルを閉じる
    closeModal1.addEventListener('click', function() {
        insertModal.style.display = 'none'; // モーダルを非表示
        overlay.style.display = 'none'; // オーバーレイを非表示
    });

    // モーダルを閉じる
    closeModal2.addEventListener('click', function() {
        updateModal.style.display = 'none'; // モーダルを非表示
        overlay.style.display = 'none'; // オーバーレイを非表示
    });

    // モーダルの外側（オーバーレイ）をクリックしたときに閉じる
    overlay.addEventListener('click', function() {
        insertModal.style.display = 'none'; // モーダルを非表示
        updateModal.style.display = 'none'; // モーダルを非表示
        overlay.style.display = 'none'; // オーバーレイを非表示
    });

});

// 新規追加フォーム送信
const insertForm = document.forms['insert-form'];

insertForm.addEventListener('submit', e => {
    e.preventDefault();
    // FormDataにactionパラメータを追加
    const insertFormData = new FormData(insertForm);
    
    insertModal.style.display = 'none'; // モーダルを非表示
    overlay.style.display = 'none'; // オーバーレイを非表示
    
    insertFormData.append('action', 'add'); // actionを'add'に設定

    fetch(scriptURL, { method: 'POST', body: insertFormData })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // レスポンスをJSON形式で取得
        })
        .then(data => {
            alert("登録しました。");
            console.log(data); // レスポンスデータをログに出力（デバッグ用）
            localStorage.removeItem('spreadsheetData');
            fetchData(); // データを再取得してリストを更新
        })
        .catch(error => console.error('Error!', error.message));

    localStorage.removeItem('spreadsheetData');
    // alert('キャッシュがクリアされました。');
});

// 更新フォーム送信
const updateForm = document.forms['update-form'];

updateForm.addEventListener('submit', function(event) {
    event.preventDefault(); // デフォルトの送信を防ぐ

    const rowIndex = updateModal.dataset.rowIndex; // 行番号を取得
    const updateFormData = new FormData(updateForm); // フォームデータを新たに作成
    
    overlay.style.display = 'none'; // オーバーレイを非表示
    updateModal.style.display = 'none'; // モーダルを非表示
    
    // 更新アクションと行番号を追加
    updateFormData.append('action', 'update'); // actionを'update'に設定
    updateFormData.append('row', rowIndex); // 更新する行番号を追加
    
    // モーダルの入力データを追加
    updateFormData.append('data1', document.getElementById('modalInput1').value);
    updateFormData.append('data2', document.getElementById('modalInput2').value);
    
    fetch(scriptURL, { method: 'POST', body: updateFormData })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // レスポンスをJSON形式で取得
        })
        .then(data => {
            console.log(data); // レスポンスの内容を確認
            if (data.result === 'success') {
                alert("データが更新されました。");
                localStorage.removeItem('spreadsheetData');
                fetchData(); // データを再取得してリストを更新
            } else {
                alert("更新に失敗しました。");
            }
        })
        .catch(error => console.error('Error!', error.message));
});

