const scriptURL = 'https://script.google.com/macros/s/AKfycbynA4RYqQBphW2FnR1FsfucfcFBeOMGHG-sOjPOGlMRHqoGP6LbsKJyyZD9Nxckslpw/exec';

const updateModal = document.getElementById('updateModal');
const modalOverlay = document.getElementById('modalOverlay'); // モーダルオーバーレイを取得
const reloadOverlay = document.getElementById('reloadOverlay'); // リロードオーバーレイを取得
const headerOverlay = document.getElementById('headerOverlay'); // ヘッダーオーバーレイを取得
const footerOverlay = document.getElementById('footerOverlay'); // ヘッダーオーバーレイを取得

const rowsToDelete = []; // 削除対象のレコード数

function overlaySetBlock() {
	reloadOverlay.style.display = 'block';
	headerOverlay.style.display = 'block';
	footerOverlay.style.display = 'block';
}

function overlaySetNone() {
	reloadOverlay.style.display = 'none';
	headerOverlay.style.display = 'none';
	footerOverlay.style.display = 'none';
}


const updateIcon = document.getElementById('update-icon');
updateIcon.addEventListener('click', () => {
	localStorage.removeItem('spreadsheetData');
	fetchData();
	alert('キャッシュをクリアしてデータを取得します。');
});

window.onload = function() {
	fetchData();
};

function fetchData() {
	const cachedData = localStorage.getItem('spreadsheetData');

	// オーバーレイを表示
	overlaySetBlock();

	if (cachedData) {
		// キャッシュが存在する場合はそれを使用
		displayData(JSON.parse(cachedData));

		// オーバーレイを非表示
		overlaySetNone();
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
			.catch(error => console.error('Error!', error.message))
			.finally(() => {
				// オーバーレイを非表示
				overlaySetNone();
			});
	}
}

// データをリストに表示する関数
function displayData(data) {
	const display = document.getElementById('dataDisplay');
	display.innerHTML = ''; // 既存の内容をクリア

	data.forEach((row, rowIndex) => {
		const listItem = document.createElement('li'); // リストアイテムを作成

		// チェックボックスを作成
		const checkbox = document.createElement('input'); // チェックボックスを作成
		checkbox.type = 'checkbox';
		checkbox.checked = row[0] === true; // チェックボックスの状態を設定
		listItem.appendChild(checkbox); // チェックボックスをリストアイテムに追加
		
		// チェックボックスの変更イベント
		checkbox.addEventListener('change', (event) => {
			// チェックボックスの変更時にリストアイテムのクリックイベントをトリガーしない
			event.stopPropagation();
			updateCheckbox(rowIndex + 2, checkbox.checked); // 行番号は1ベースなので+2
		});

		// 2列目の要素をリストアイテムに追加
		const secondColumnText = (row[1] !== undefined && row[1] !== null) ? row[1] : ''; // 0も表示 // 2列目の値を取得（存在しない場合は空文字）
		const textNode = document.createElement('span'); // テキストをラップするためのspan要素
		textNode.textContent = secondColumnText; // テキストを設定
		listItem.appendChild(textNode); // spanをリストアイテムに追加
		
		// 新しいチェックボックスを作成
		const deleteCheckbox = document.createElement('input'); // 新しいチェックボックスを作成
		deleteCheckbox.type = 'checkbox'; // 新しいチェックボックス
		deleteCheckbox.classList.add('delete-checkbox'); // クラスを追加して後で管理
		deleteCheckbox.style.visibility = 'hidden'; // 初期状態で非表示
		listItem.appendChild(deleteCheckbox); // 2つめのチェックボックスをリストアイテムに追加
		
		// 新しいチェックボックスの変更イベント（必要に応じて追加）
		deleteCheckbox.addEventListener('change', (event) => {
			// 新しいチェックボックスの変更時にリストアイテムのクリックイベントをトリガーしない
			event.stopPropagation();
			deleteSelect();
		});

		// リストアイテムにデータ属性を追加
		listItem.dataset.rowIndex = rowIndex + 2; // 行番号をデータ属性に追加

		// リストアイテムにクリックイベントを追加
		listItem.addEventListener('click', (event) => {
			if (deleteMode) {
				deleteSelect();
			}
			if (event.target !== checkbox && deleteMode == false) { // クリックがチェックボックスでない場合のみ遷移
				const rowIndex = listItem.dataset.rowIndex; // 行番号を取得
				const rowData = JSON.parse(localStorage.getItem('spreadsheetData'))[rowIndex - 2]; // キャッシュから行データを取得
				// モーダルにデータを渡す
				document.getElementById('modalInput1').value = (rowData[1] !== undefined && rowData[1] !== null) ? rowData[1] : ''; // データ1を設定
				document.getElementById('modalInput2').value = (rowData[2] !== undefined && rowData[2] !== null) ? rowData[2] : ''; // データ2を設定

				// 行番号をデータ属性に設定
				updateModal.dataset.rowIndex = rowIndex; // 行番号を設定

				// モーダルを表示
				updateModal.style.display = 'block'; // 編集モーダルを表示
				modalOverlay.style.display = 'block'; // オーバーレイを表示
				headerOverlay.style.display = 'block';
				footerOverlay.style.display = 'block';
			}
		});
		
		// 削除モードがTRUEのときの処理
		function deleteSelect() {
			deleteCheckbox.checked = !deleteCheckbox.checked; // チェックボックスの状態を切り替え
			const rowIndex = parseInt(listItem.dataset.rowIndex); // 行番号を取得
			// チェックボックスの状態に応じてリストアイテムのスタイルを変更
			console.log(rowsToDelete);
			if (deleteCheckbox.checked) {
				listItem.classList.add('selected'); // 選択状態のクラスを追加
				// 行を追加する					
				if (!rowsToDelete.includes(rowIndex)) {
					rowsToDelete.push(rowIndex); // 行番号を追加
				}
			} else {
				listItem.classList.remove('selected'); // 選択状態のクラスを削除
				const index = rowsToDelete.indexOf(rowIndex);
				if (index > -1) {
					rowsToDelete.splice(index, 1); // 行番号を削除
				}
			}
			// ヘッダーの削除レコード数を更新
			updateSelectedCount();
		}

		display.appendChild(listItem); // リストに追加
	});
}

// ヘッダーの削除レコード数をカウント
function updateSelectedCount() {
	const countElement = document.getElementById('selectedCount');
	countElement.textContent = rowsToDelete.length; // 選択された行の数を表示
}

// スプレッドシートを更新する関数
function updateCheckbox(row, isChecked) {
	const action = isChecked ? 'check' : 'uncheck'; // 更新アクションの決定
	
	// オーバーレイを表示
	overlaySetBlock();
	
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
	})
	.finally(() => {
		// オーバーレイを非表示
		overlaySetNone();
	});
}

// モーダル関連
const insertModal = document.getElementById('insertModal');
const addIcon = document.getElementById('add-icon');

document.addEventListener('DOMContentLoaded', function() {
	const closeModal1 = document.getElementById('closeModal1');
	const closeModal2 = document.getElementById('closeModal2');

	// モーダルを表示
	addIcon.addEventListener('click', function() {
		insertModal.style.display = 'block'; // モーダルを表示
		modalOverlay.style.display = 'block'; // オーバーレイを表示
		headerOverlay.style.display = 'block';
		footerOverlay.style.display = 'block';
	});

	// モーダルを閉じる
	closeModal1.addEventListener('click', function() {
		insertModal.style.display = 'none'; // モーダルを非表示
		modalOverlay.style.display = 'none'; // オーバーレイを非表示
		headerOverlay.style.display = 'none';
		footerOverlay.style.display = 'none';
		insertForm.reset(); // フォームの内容をクリア
	});

	// モーダルを閉じる
	closeModal2.addEventListener('click', function() {
		updateModal.style.display = 'none'; // モーダルを非表示
		modalOverlay.style.display = 'none'; // オーバーレイを非表示
		headerOverlay.style.display = 'none';
		footerOverlay.style.display = 'none';
	});

	// モーダルの外側（オーバーレイ）をクリックしたときに閉じる
	modalOverlay.addEventListener('click', function() {
		insertModal.style.display = 'none'; // モーダルを非表示
		updateModal.style.display = 'none'; // モーダルを非表示
		modalOverlay.style.display = 'none'; // オーバーレイを非表示
		headerOverlay.style.display = 'none';
		footerOverlay.style.display = 'none';
		insertForm.reset(); // フォームの内容をクリア
	});

});

// 新規追加フォーム送信
const insertForm = document.forms['insert-form'];

insertForm.addEventListener('submit', e => {
	e.preventDefault();
	// FormDataにactionパラメータを追加
	const insertFormData = new FormData(insertForm);

	insertModal.style.display = 'none'; // モーダルを非表示
	modalOverlay.style.display = 'none'; // オーバーレイを非表示
	insertForm.reset(); // フォームの内容をクリア
	overlaySetBlock();

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

	modalOverlay.style.display = 'none'; // オーバーレイを非表示
	updateModal.style.display = 'none'; // モーダルを非表示
	overlaySetBlock();

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

let deleteMode = false; // 削除モードの状態を管理

document.addEventListener('DOMContentLoaded', () => {
	document.getElementById('delete-icon-false').addEventListener('click', () => {
		deleteModeChange(); // 削除モード=TRUE
	});
});

document.addEventListener('DOMContentLoaded', () => {
	document.getElementById('delete-icon-true').addEventListener('click', () => {
		overlaySetBlock();
		deleteModeChange(); // 削除モード=FALSE
		// 削除処理を実行
		deleteSelectedRecords();
		// ヘッダーの削除レコード数をリセット
		rowsToDelete.length = 0; // 配列を空にする
		updateSelectedCount(); // 選択数を更新
	});
});

document.addEventListener('DOMContentLoaded', () => {
	document.getElementById('cancelButton').addEventListener('click', () => {
		deleteModeChange(); // 削除モード=FALSE
		// ヘッダーの削除レコード数をリセット
		rowsToDelete.length = 0; // 配列を空にする
		updateSelectedCount(); // 選択数を更新
	});
});

// 削除するレコードを選択する関数
function deleteSelectedRecords() {
	if (rowsToDelete.length === 0) {
		alert('削除するレコードが選択されていません。');
		overlaySetNone();
		return;
	}
	// 削除リクエストを送信
	fetch(scriptURL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams({
			action: 'delete',
			rows: JSON.stringify(rowsToDelete) // 削除する行の配列を送信
		}),
	})
	.then(response => {
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
	return response.json();
	})
	.then(data => {
		console.log('Delete successful:', data);
		alert("データを削除しました。");
		localStorage.removeItem('spreadsheetData');
		fetchData(); // データを再取得してリストを更新
		// rowsToDeleteを初期化
		rowsToDelete.length = 0; // 配列を空にする
	})
	.catch(error => {
		console.error('Error deleting records:', error);
	});
}

// ゴミ箱アイコン押下アクション
function deleteModeChange() {
	deleteMode = !deleteMode; // モードを切り替え
	headerColor(deleteMode); // ヘッダーの色を切り替え
	headerChar(deleteMode); // ヘッダーの文字を切り替え
	deleteCheckboxes(deleteMode); // チェックボックスの表示を切り替え
	deleteIcon(deleteMode); // ゴミ箱アイコンの表示を切り替え
	selectedCount(deleteMode); // ヘッダーの削除レコード数の表示を切り替え
	
	// add-icon,update-conの表示を切り替える
	addIcon.style.display = deleteMode ? 'none' : 'inline'; // 削除モード時は非表示、そうでない場合は表示
	updateIcon.style.display = deleteMode ? 'none' : 'inline'; // 削除モード時は非表示、そうでない場合は表示
	
	// リストの全てのチェックボックスを非活性または活性にする
	const checkboxes = document.querySelectorAll('#dataDisplay input[type="checkbox"]');
	checkboxes.forEach(cb => {
		// deleteCheckboxクラスを持つチェックボックスは非活性にしない
		if (!cb.classList.contains('delete-checkbox')) {
			cb.disabled = deleteMode; // チェックボックスを非活性または活性に設定
		}
	});
	// 削除モードが無効な場合、全てのリストアイテムからselectedクラスを外す
	if (!deleteMode) {
		const listItems = document.querySelectorAll('#dataDisplay li');
			listItems.forEach(item => {
			item.classList.remove('selected'); // selectedクラスを削除

			// deleteCheckboxをすべてFALSEに設定
			const deleteCheckbox = item.querySelector('.delete-checkbox');
			if (deleteCheckbox) {
				deleteCheckbox.checked = false; // チェックボックスをFALSEに設定
			}
		});
	}
}

// ヘッダーの色を切り替える関数
function headerColor(isVisible) {
	const header = document.getElementById('header');
		if (isVisible) {
			header.classList.add('header-delete-mode');
		} else {
			header.classList.remove('header-delete-mode');
		} 
}

// ヘッダーの文字を切り替える関数
function headerChar(isVisible) {
	const cancelButton = document.querySelector('.left');
	const title = document.querySelector('.center');
		if (isVisible) {
			cancelButton.classList.remove('hidden'); // キャンセルボタンを非表示
			title.classList.remove('hidden'); // タイトルを非表示
		} else {
			cancelButton.classList.add('hidden'); // キャンセルボタンを非表示
			title.classList.add('hidden'); // タイトルを非表示
		} 
}

// チェックボックスの表示を切り替える関数
function deleteCheckboxes(isVisible) {
	const checkboxes = document.querySelectorAll('.delete-checkbox'); // 削除用のチェックボックスを取得
	checkboxes.forEach(checkbox => {
		checkbox.style.visibility = isVisible ? 'visible' : 'hidden'; // 表示/非表示を切り替え
	});
}

// ゴミ箱アイコンの表示を切り替える関数
function deleteIcon(isVisible) {
	const deleteIconTrue = document.getElementById('delete-icon-true'); // ゴミ箱アイコンを取得
	const deleteIconFalse = document.getElementById('delete-icon-false'); // ゴミ箱アイコンを取得
	deleteIconTrue.style.display = isVisible ? 'inline' : 'none'; // 表示/非表示を切り替え
	deleteIconFalse.style.display = isVisible ? 'none' : 'inline'; // 表示/非表示を切り替え
}

// ヘッダーの削除レコード数の表示を切り替える関数
function selectedCount(isVisible) {
	const selectedCount = document.getElementById('selectedCount'); // 削除レコード数を取得
	selectedCount.style.display = isVisible ? 'inline' : 'none'; // 表示/非表示を切り替え
}