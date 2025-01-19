
const scriptURL = 'https://script.google.com/macros/s/AKfycbz6SIHhP63YdN_rOMVQ9_qew9KD02FvXhW4sDeDPN67QSEABV9pCljZoIWIff1d8TF9/exec';

const updateModal = document.getElementById('updateModal');
const modalOverlay = document.getElementById('modalOverlay'); // モーダルオーバーレイを取得
const reloadOverlay = document.getElementById('reloadOverlay'); // リロードオーバーレイを取得
const headerOverlay = document.getElementById('headerOverlay'); // ヘッダーオーバーレイを取得
const footerOverlay = document.getElementById('footerOverlay'); // ヘッダーオーバーレイを取得

const rowsToDelete = []; // 削除対象のレコード数

window.onload = function() {
	fetchData();
};

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

// サイドメニュー開閉
const sideMenu = document.getElementById("side-menu");
document.addEventListener("DOMContentLoaded", () => {
	const tuneIcon = document.getElementById("tune-icon");
	

	// メニューを開く
	tuneIcon.addEventListener("click", () => {
		sideMenu.classList.add("open");
		modalOverlay.style.display = 'block';
		footerOverlay.style.display = 'block';
	});
	
	// メニューを閉じる
	const closeMenu = document.getElementById("close-menu");
	closeMenu.addEventListener("click", () => {
		sideMenuClose();
	});
});
	
// サイドメニューを閉じる
function sideMenuClose() {
	sideMenu.classList.remove("open");
	modalOverlay.style.display = 'none';
	footerOverlay.style.display = 'none';
	updateFilterIcon(); // 絞り込み条件の有無
}

function fetchData() {
	const cachedData = localStorage.getItem('spreadsheetData');

	// オーバーレイを表示
	overlaySetBlock();

	if (cachedData) {
		// キャッシュが存在する場合はそれを使用
		currentData = JSON.parse(cachedData); // currentDataにキャッシュを格納
		displayData(currentData); // データを表示
		search();

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
				currentData = data; // currentDataに取得したデータを格納
				displayData(data);
				search();
			})
			.catch(error => console.error('Error!', error.message))
			.finally(() => {
				// オーバーレイを非表示
				overlaySetNone();
			});
	}
}

let currentData = []; // 現在表示されているデータを保持する
let chacheDate = []; // キャッシュデータを保持する

// データをリストに表示する関数
function displayData(data) {
	currentData = data; // 現在表示されているデータを更新
	chacheDate = JSON.parse(localStorage.getItem('spreadsheetData')); // chacheDateにキャッシュを格納
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
				
			const rowIndex = parseInt(listItem.dataset.rowIndex) - 2; // データ配列のインデックスに変換
			const rowData = currentData[rowIndex]; // フィルタリングされたデータから正しい行データを取得

			// 更新対象の値を取得
			const targetValue1 = rowData[0]; // 1列目の値
			const targetValue2 = rowData[1]; // 2列目の値
			const targetValue3 = rowData[2]; // 3列目の値

			// キャッシュ内での行番号を検索
			const chacheRowIndex = chacheDate.findIndex(chacheRow => {
			// 比較するプロパティを指定
				return chacheRow[0] === targetValue1 && // 1列目で比較
					   chacheRow[1] === targetValue2 && // 2列目で比較
					   chacheRow[2] === targetValue3; // 3列目で比較
			});
			updateCheckbox(chacheRowIndex + 2, checkbox.checked); // 行番号は1ベースなので+2
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

		// 行番号を取得（1ベース）
		rowIndex = parseInt(listItem.dataset.rowIndex) - 2; // データ配列のインデックスに変換
		const rowData = currentData[rowIndex]; // フィルタリングされたデータから正しい行データを取得

		// 更新対象の値を取得
		const targetValue1 = rowData[0]; // 1列目の値
		const targetValue2 = rowData[1]; // 2列目の値
		const targetValue3 = rowData[2]; // 3列目の値

		// キャッシュ内での行番号を検索
		const chacheRowIndex = chacheDate.findIndex(chacheRow => {
		// 比較するプロパティを指定
			return chacheRow[0] === targetValue1 && // 1列目で比較
				   chacheRow[1] === targetValue2 && // 2列目で比較
				   chacheRow[2] === targetValue3; // 3列目で比較
		});
		
		// スプレッドシート上の行番号
		const sheetRowIndex = chacheRowIndex + 2; // chacheRowIndexに+2する

		// リストアイテムにクリックイベントを追加
		listItem.addEventListener('click', (event) => {
			if (deleteMode) {
				deleteSelect();
			}
			if (event.target !== checkbox && deleteMode == false) { // クリックがチェックボックスでない場合のみ遷移
				// モーダルにデータを渡す
				document.getElementById('modalInput1').value = (rowData[1] !== undefined && rowData[1] !== null) ? rowData[1] : ''; // データ1を設定
				document.getElementById('modalInput2').value = (rowData[2] !== undefined && rowData[2] !== null) ? rowData[2] : ''; // データ2を設定
				console.log(`Filtered Row Index: ${rowIndex}, Original Row Index: ${sheetRowIndex}`); // デバッグ用

				// 行番号をデータ属性に設定
				updateModal.dataset.rowIndex = rowIndex; // 検索結果内の行番号を設定
				updateModal.dataset.chacheRowIndex = chacheRowIndex + 2; // キャッシュデータ内の行番号を設定

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
			// チェックボックスの状態に応じてリストアイテムのスタイルを変更
			if (deleteCheckbox.checked) {
				listItem.classList.add('selected'); // 選択状態のクラスを追加
				// 削除対象の行を追加する					
				if (!rowsToDelete.includes(sheetRowIndex)) {
					rowsToDelete.push(sheetRowIndex); // 行番号を追加
				}
			} else {
				listItem.classList.remove('selected'); // 選択状態のクラスを削除
				const index = rowsToDelete.indexOf(sheetRowIndex);
				if (index > -1) {
					rowsToDelete.splice(index, 1); // 行番号を削除
				}
			}
			// ヘッダーの削除レコード数を更新
			updateSelectedCount();
		}

		// 削除ボタンを作成
        const deleteButton = document.createElement('button');
        deleteButton.textContent = '削除';
        deleteButton.classList.add('delete-button'); // クラスを追加
        deleteButton.style.display = 'none'; // 初期状態では非表示
        listItem.appendChild(deleteButton); // リストアイテムに追加


        // スワイプを検出するための変数
        let startX, endX;

        // タッチ開始イベント
        listItem.addEventListener('touchstart', (event) => {
            startX = event.touches[0].clientX; // スタート位置を記録
        });

        // タッチ移動イベント
        listItem.addEventListener('touchmove', (event) => {
            endX = event.touches[0].clientX; // エンド位置を記録
            
            const distanceX = startX - endX;
    // スワイプ距離に応じてリストアイテムを移動
    if (distanceX > 0 && distanceX < 50) { // 右から左にスワイプ
        listItem.style.transform = `translateX(${-distanceX}px)`;
        deleteButton.style.display = 'block'; // 削除ボタンを表示
    }
        });

        // タッチ終了イベント
        listItem.addEventListener('touchend', () => {
			if (endX) {
            // スワイプの距離を計算
            const distanceX = startX - endX;

            // スワイプが一定の距離を超えたらスライドする
            if (distanceX > 50) { // 左にスワイプ
            // 完全にスワイプしたときの動作を追加
            listItem.style.transform = 'translateX(-50px)'; // スワイプ完了

            } else {
            // スワイプが不十分な場合は元に戻す
            listItem.style.transform = 'translateX(0)';
                deleteButton.style.display = 'none'; // 削除ボタンを非表示
            }
            }
        });
        
/*                        // ドキュメントの他の部分がクリックされたときにプルダウンを閉じる
document.addEventListener('click', (event) => {
	if (!deleteButton.contains(event.target)) {
		listItem.style.transform = 'translateX(0)';
		deleteButton.style.display = 'none';
	}
});*/

            // 削除対象の1行を送信
deleteButton.addEventListener('click', (event) => {
    event.stopPropagation(); // リストアイテムのタッチイベントをトリガーしない
    // スプレッドシートへの削除リクエストを送信
    fetch(scriptURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            action: 'singleDelete', // 削除アクション
            row: sheetRowIndex // 行番号を送信
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
        if (data.result === 'error') {
            alert("削除に失敗しました。該当データが見つかりませんでした。");
        } else {
            alert("削除が成功しました。");
            listItem.remove(); // リストアイテムを削除
				localStorage.removeItem('spreadsheetData');
				fetchData(); // データを再取得してリストを更新
        }
    })
    .catch(error => {
        console.error('Error deleting record:', error);
        alert("エラーが発生しました。");
    });
});

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
		headerOverlay.style.display = 'none';
		insertForm.reset(); // フォームの内容をクリア
		sideMenuClose(); // フッターとモーダルのオーバーレイ非表示を含む
	});

});

// 新規追加フォーム送信
const insertForm = document.forms['insert-form'];

insertForm.addEventListener('submit', e => {
	e.preventDefault();
	
	const insertFormData = new FormData(insertForm);

	insertModal.style.display = 'none'; // モーダルを非表示
	modalOverlay.style.display = 'none'; // オーバーレイを非表示
	insertForm.reset(); // フォームの内容をクリア
	overlaySetBlock();

	// FormDataにactionパラメータを追加
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

	const rowIndex = parseInt(updateModal.dataset.rowIndex); // 検索結果内の行番号を取得
	const chacheRowIndex = parseInt(updateModal.dataset.chacheRowIndex); // キャッシュデータ内の行番号を取得

	const modalInput1 = document.getElementById('modalInput1').value;
	const modalInput2 = document.getElementById('modalInput2').value;

	// currentDataを更新
	if (rowIndex !== -1 && currentData[rowIndex]) {
		currentData[rowIndex][1] = modalInput1; // 1列目を更新
		currentData[rowIndex][2] = modalInput2; // 2列目を更新

		// localStorageを更新
		localStorage.setItem('spreadsheetData', JSON.stringify(currentData));
		displayData(currentData); // 更新されたデータを表示
	} 

	modalOverlay.style.display = 'none'; // オーバーレイを非表示
	updateModal.style.display = 'none'; // モーダルを非表示
	overlaySetBlock();

	const updateFormData = new FormData(updateForm); // フォームデータを新たに作成
	
	// 更新アクションと行番号を追加
	updateFormData.append('action', 'update'); // actionを'update'に設定
	updateFormData.append('row', chacheRowIndex); // 更新する行番号を追加

	// モーダルの入力データを追加
	updateFormData.append('data1', modalInput1);
	updateFormData.append('data2', modalInput2);

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
	// action-buttonの表示を切り替える
	const actionbutton = document.getElementById('action-button');
	actionbutton.style.display = deleteMode ? 'none' : 'flow-root'; // 削除モードがTRUEの場合、非表示にする
	
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

// 検索機能
let checkFlgTrue = false; // チェックありのレコード用フラグ
let checkFlgFalse = false; // チェックなしのレコード用フラグ
let lastSearchValue = ''; // 検索ボックスの最後の値を保持するための変数
const filterInput = document.getElementById('filterInput'); // 現在の値を取得

// クリアボタン押下アクション
document.getElementById('clear').addEventListener('click', function() {
	doClear();
	search();
});

// 絞り込み条件解除
function doClear() {
	filterInput.value = ''; // テキストボックスの値を空にする
	lastSearchValue = ''; // 検索の最後の値もクリア
	checkFlgTrue = false;
	checkTrue.classList.remove('checkboxSelected');
	checkFlgFalse = false;
	checkFalse.classList.remove('checkboxSelected');
}

// 検索機能
function search() {
	const filterInputSearch = filterInput.value.toLowerCase(); // 小文字に変換して取得
	const checkTrueSelected = checkFlgTrue; // チェックありのフラグ
	const checkFalseSelected = checkFlgFalse; // チェックなしのフラグ
	const cachedData = JSON.parse(localStorage.getItem('spreadsheetData')) || []; // キャッシュからデータを取得

	// フィルタリングされたデータを格納する配列
	const filteredData = cachedData.filter(row => {
		const matchesText = (typeof row[1] === 'string' || typeof row[1] === 'number') && 
				String(row[1]).toLowerCase().includes(filterInputSearch); // 2列目の値に基づくフィルタリング
		const matchesCheckbox = (checkTrueSelected && row[0] === true) || (checkFalseSelected && row[0] === false);
		return matchesText && (checkTrueSelected || checkFalseSelected ? matchesCheckbox : true);
	});

	displayData(filteredData); // フィルタリングされたデータを表示
	sortList(sortIconMode);
}

// チェックボタンのクリックイベント
const checkTrue = document.getElementById('checkTrue');
checkTrue.addEventListener('click', function() {
	checkFlgTrue = !checkFlgTrue; // フラグを切り替え
	if (checkFlgTrue) {
		checkFlgFalse = false;
		checkTrue.classList.add('checkboxSelected');
		checkFalse.classList.remove('checkboxSelected');
	} else {
		checkTrue.classList.remove('checkboxSelected');
	}
	search();
});

const checkFalse = document.getElementById('checkFalse');
checkFalse.addEventListener('click', function() {
	checkFlgFalse = !checkFlgFalse; // フラグを切り替え
	if (checkFlgFalse) {
		checkFlgTrue = false;
		checkFalse.classList.add('checkboxSelected');
		checkTrue.classList.remove('checkboxSelected');
	} else {
		checkFalse.classList.remove('checkboxSelected');
	}
	search();
});

filterInput.addEventListener('blur', function() {
	search();
	if (filterInput.value != '') {
		if (checkFlgTrue == true || checkFlgFalse == true) {
	}}
});

// 検索ボタン押下アクション
document.getElementById('searchButton').addEventListener('click', () => {
	lastSearchValue = filterInput.value; // 値を保持
	search();
	updateFilterIcon();
	sideMenu.classList.remove("open");
	modalOverlay.style.display = 'none';
	footerOverlay.style.display = 'none';
});

// 絞り込み条件の有無
function updateFilterIcon() {
	const tuneIconText = document.querySelector('#tune-icon span:last-child'); // <span>要素を取得
	// filter-reset-iconの表示を切り替える
	const filterResetIcon = document.getElementById('filter-reset-icon');
	if (checkFlgTrue == true || checkFlgFalse == true || filterInput.value != ''){
		tuneIconText.textContent = '絞り込み中'; // テキストを変更
		filterResetIcon.style.display = 'flex'; // 絞り込み中の場合、表示する
	} else {
		tuneIconText.textContent = '絞り込み'; // テキストを変更
		filterResetIcon.style.display = 'none'; // 絞り込み中の場合、表示する
	}
}

document.getElementById('filter-reset-icon').addEventListener('click', () => {
	doClear();
	search();
	updateFilterIcon();
});

// プルダウン表示
const sortIcon = document.getElementById('sort-icon');
const sortDropdown = document.getElementById('sort-dropdown');
let sortIconMode = "cookasc";

// sort-iconをクリックしたときにプルダウンを表示
sortIcon.addEventListener('click', () => {
	sortDropdown.style.display = sortDropdown.style.display === 'block' ? 'none' : 'block';
});

// 並び替えプルダウンをクリックしたときの処理
const sortCookAsc = document.getElementById('sort-cook-asc');
sortCookAsc.addEventListener('click', () => {
	// 昇順ソートの処理をここに追加
	sortIconMode = "cookasc";
	sortList(sortIconMode);
	sortDropdown.style.display = 'none'; // プルダウンを非表示にする
});

const sortCookDesc = document.getElementById('sort-cook-desc');
sortCookDesc.addEventListener('click', () => {
	// 降順ソートの処理をここに追加
	sortIconMode = "cookdesc";
	sortList(sortIconMode);
	sortDropdown.style.display = 'none'; // プルダウンを非表示にする
});

const sortCheckboxAsc = document.getElementById('sort-checkbox-asc');
sortCheckboxAsc.addEventListener('click', () => {
	// 昇順ソートの処理をここに追加
	sortIconMode = "checkboxasc";
	sortList(sortIconMode);
	sortDropdown.style.display = 'none'; // プルダウンを非表示にする
});

const sortCheckboxDesc = document.getElementById('sort-checkbox-desc');
sortCheckboxDesc.addEventListener('click', () => {
	// 降順ソートの処理をここに追加
	sortIconMode = "checkboxdesc";
	sortList(sortIconMode);
	sortDropdown.style.display = 'none'; // プルダウンを非表示にする
});

// リストをソートする関数
function sortList(order) {
	currentData.sort((a, b) => {

		const aValue = String(a[1]); // 明示的に文字列に変換
		const bValue = String(b[1]); // 明示的に文字列に変換

		// テキストに基づいてソート
		if (order === 'cookasc') {
			// 表示テキストを文字列として比較
			return aValue.localeCompare(bValue); // 昇順でソート
		} else if (order === 'cookdesc') {
			// 表示テキストを文字列として比較
			return bValue.localeCompare(aValue); // 降順でソート
		// チェックボックスの状態に基づいてソート
		} else if (order === 'checkboxasc') {
			if (a[0] === true && b[0] === false) {
				return -1; // aを上に
			} else if (a[0] === false && b[0] === true) {
				return 1; // bを上に
			} else {
				return 0; // 同じ場合はそのまま
			}
		} else if (order === 'checkboxdesc') {	
			if (a[0] === false && b[0] === true) {
				return -1; // aを上に
			} else if (a[0] === true && b[0] === false) {
				return 1; // bを上に
			} else {
				return 0; // 同じ場合はそのまま
			}
		}
	});

	// ソートされたcurrentDataをdisplayData関数に渡して表示
	displayData(currentData);
	// プルダウンの色を変更
	dropdownColor(sortIconMode);
}

// プルダウンの色を変更
function dropdownColor(order) {
	if (order === 'cookasc') {
		sortCookAsc.classList.add('sort-top'); // クラスを追加
	} else {
		sortCookAsc.classList.remove('sort-top'); // クラスを削除
	}
	if (order === 'cookdesc') {
		sortCookDesc.classList.add('sort-center'); // クラスを追加
	} else {
		sortCookDesc.classList.remove('sort-center'); // クラスを削除
	}
	if (order === 'checkboxasc') {
		sortCheckboxAsc.classList.add('sort-center'); // クラスを追加
	} else {
		sortCheckboxAsc.classList.remove('sort-center'); // クラスを削除
	}
	if (order === 'checkboxdesc') {
		sortCheckboxDesc.classList.add('sort-bottom'); // クラスを追加
	} else {
		sortCheckboxDesc.classList.remove('sort-bottom'); // クラスを削除
	}
}

// ドキュメントの他の部分がクリックされたときにプルダウンを閉じる
document.addEventListener('click', (event) => {
	if (!sortIcon.contains(event.target) && !sortDropdown.contains(event.target)) {
		sortDropdown.style.display = 'none';
	}
});