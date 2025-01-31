const scriptURL = 'https://script.google.com/macros/s/AKfycbxXjO05S6ASBYNnLtkgYxTR4iA7srUuUegrydozpJRlYzHE99r_0HG3cbUHdbnRpUmn/exec';

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
	HFOverlaySetBlock();
}

function overlaySetNone() {
	reloadOverlay.style.display = 'none';
	HFOverlaySetNone();
}

function HFOverlaySetBlock() {
	headerOverlay.style.display = 'block';
	footerOverlay.style.display = 'block';
}

function HFOverlaySetNone() {
	headerOverlay.style.display = 'none';
	footerOverlay.style.display = 'none';
}

const chacheClearIcon = document.getElementById('chacheClearIcon');
chacheClearIcon.addEventListener('click', () => {
	localStorage.removeItem('spreadsheetData');
	fetchData();
	alert('キャッシュをクリアしてデータを取得します。');
});

// サイドメニュー開閉
const sideMenu = document.getElementById('sideMenu');
const filterIcon = document.getElementById('filterIcon');
const reSearchButton = document.getElementById('reSearchButton');
document.addEventListener('DOMContentLoaded', () => {

	// メニューを開く
	filterIcon.addEventListener('click', () => {
		sideMenuOpen();
	});
	reSearchButton.addEventListener('click', () => {
		sideMenuOpen();
	});

	// メニューを閉じる
	document.getElementById('closeSideMenuButton').addEventListener('click', () => {
		sideMenuClose();
	});
});

// サイドメニューを開く
function sideMenuOpen() {
	sideMenu.classList.add('open');
	modalOverlay.style.display = 'block';
	HFOverlaySetBlock();
}

// サイドメニューを閉じる
function sideMenuClose() {
	sideMenu.classList.remove('open');
	modalOverlay.style.display = 'none';
	HFOverlaySetNone();
	updateFilterIcon(); // 絞り込み条件の有無
}

// オプションメニュー開閉
const optionMenu = document.getElementById('optionMenu');
const settingIcon = document.getElementById('setting-icon');
document.addEventListener('DOMContentLoaded', () => {

	// オプションを開く
	settingIcon.addEventListener('click', () => {
		headerOverlay.style.display = 'block';
		optionMenu.classList.add('open');
	});

	// メニューを閉じる
	document.getElementById('closeOptionMenu').addEventListener('click', () => {
		headerOverlay.style.display = 'none';
		optionMenu.classList.remove('open');
	});
});

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
let filteredRows = []; // 絞り込み結果の行番号を格納

// データをリストに表示する関数
function displayData(data) {
	currentData = data; // 現在表示されているデータを更新
	chacheDate = JSON.parse(localStorage.getItem('spreadsheetData')); // chacheDateにキャッシュを格納
	const display = document.getElementById('dataDisplay');
	display.innerHTML = ''; // 既存の内容をクリア

	data.forEach((row, rowIndex) => {
		const listItem = document.createElement('li'); // リストアイテムを作成
		// リストアイテムにデータ属性を追加
		listItem.dataset.rowIndex = rowIndex + 2; // 行番号をデータ属性に追加

		// 行番号を取得（1ベース）
		rowIndex = parseInt(listItem.dataset.rowIndex) - 2; // データ配列のインデックスに変換
		const rowData = currentData[rowIndex]; // フィルタリングされたデータから正しい行データを取得

		// 更新対象の値を取得
		const checkboxValue = rowData[0]; // 1列目の値
		const cookValue = rowData[1]; // 2列目の値
		const memoValue = rowData[2]; // 3列目の値
		const bookmarkValue = rowData[3]; // 4列目の値
		const insertTimeValue = rowData[4]; // 5列目の値
		const updateTimeValue = rowData[5]; // 6列目の値

		// キャッシュ内での行番号を検索
		const chacheRowIndex = chacheDate.findIndex(chacheRow => {
		// 比較するプロパティを指定
			return chacheRow[0] === checkboxValue && // 1列目で比較
				   chacheRow[1] === cookValue && // 2列目で比較
				   chacheRow[2] === memoValue && // 3列目で比較
				   chacheRow[3] === bookmarkValue && // 4列目で比較
				   chacheRow[4] === insertTimeValue && // 5列目で比較
				   chacheRow[5] === updateTimeValue; // 6列目で比較
		});

		// スプレッドシート上の行番号
		const sheetRowIndex = chacheRowIndex + 2; // chacheRowIndexに+2する

		// チェックボックスを作成
		const checkbox = document.createElement('input'); // チェックボックスを作成
		checkbox.type = 'checkbox';
		checkbox.checked = row[0] === true; // チェックボックスの状態を設定
		listItem.appendChild(checkbox); // チェックボックスをリストアイテムに追加

		// チェックボックスの変更イベント
		checkbox.addEventListener('change', (event) => {
			// チェックボックスの変更時にリストアイテムのクリックイベントをトリガーしない
			event.stopPropagation();
			// スプレッドシートを更新する関数（チェックボックス）
			updateCheckbox(sheetRowIndex, checkbox.checked); // 行番号は1ベースなので+2
		});

		// 2列目の要素をリストアイテムに追加
		const secondColumnText = (row[1] !== undefined && row[1] !== null) ? row[1] : ''; // 0も表示 // 2列目の値を取得（存在しない場合は空文字）
		const textNode = document.createElement('span'); // テキストをラップするためのspan要素
		textNode.classList.add('text-node'); // クラスを追加してデザインを管理
		textNode.textContent = secondColumnText; // テキストを設定
		listItem.appendChild(textNode); // spanをリストアイテムに追加

		// チェックボックスの状態に応じて取り消し線を設定
		if (checkbox.checked) {
			textNode.style.textDecoration = 'line-through'; // チェックされている場合は取り消し線を追加
		}

		// ブックマーク中アイコンを作成
		const bookmarkOn = document.createElement('span');
		bookmarkOn.textContent = 'bookmark';
		bookmarkOn.classList.add('material-icons', 'bookmark-icon'); // クラスを追加
		bookmarkOn.id = 'bookmark-on'; // idを追加
		bookmarkOn.style.display = bookmarkValue ? 'inline' : 'none'; // ブックマーク状態に応じて表示
		listItem.appendChild(bookmarkOn); // ブックマークオンアイコンをリストアイテムに追加

		// ブックマーク未アイコンを作成
		const bookmarkOff = document.createElement('span');
		bookmarkOff.textContent = 'bookmark_border';
		bookmarkOff.classList.add('material-icons', 'bookmark-icon'); // クラスを追加
		bookmarkOff.id = 'bookmark-off'; // idを追加
		bookmarkOff.style.display = bookmarkValue ? 'none' : 'inline'; // ブックマーク状態に応じて表示
		listItem.appendChild(bookmarkOff); // ブックマークオフアイコンをリストアイテムに追加

		// ブックマークの変更イベント (TRUE→FALSE)
		bookmarkOn.addEventListener('click', (event) => {
			// ブックマークの変更時にリストアイテムのクリックイベントをトリガーしない
			event.stopPropagation();
			// スプレッドシートを更新する関数（ブックマーク）
			updateBookmark(sheetRowIndex, false); // 行番号は1ベースなので+2
			bookmarkOn.style.display = 'none'; // 表示を切り替え
			bookmarkOff.style.display = 'inline'; // 表示を切り替え
		});

		// ブックマークの変更イベント (TRUE→FALSE)
		bookmarkOff.addEventListener('click', (event) => {
			// ブックマークの変更時にリストアイテムのクリックイベントをトリガーしない
			event.stopPropagation();
			// スプレッドシートを更新する関数（ブックマーク）
			updateBookmark(sheetRowIndex, true); // 行番号は1ベースなので+2
			bookmarkOn.style.display = 'inline'; // 表示を切り替え
			bookmarkOff.style.display = 'none'; // 表示を切り替え
		});

		// 削除チェックボックスを作成
		const deleteCheckbox = document.createElement('input'); // 新しいチェックボックスを作成
		deleteCheckbox.type = 'checkbox'; // 新しいチェックボックス
		deleteCheckbox.classList.add('delete-checkbox'); // クラスを追加して後で管理
		deleteCheckbox.style.display = 'none'; // 初期状態で非表示
		listItem.appendChild(deleteCheckbox); // 2つめのチェックボックスをリストアイテムに追加

		// 削除チェックボックスの変更イベント（必要に応じて追加）
		deleteCheckbox.addEventListener('change', function() {
			deleteCheckbox.checked = !deleteCheckbox.checked;
			deleteSelect();
		});

		// 削除ボタンを作成
		const deleteButton = document.createElement('span');
		deleteButton.textContent = 'delete_outline';
		deleteButton.classList.add('material-icons'); // クラスを追加
		deleteButton.classList.add('single-delete-icons'); // クラスを追加
		listItem.appendChild(deleteButton); // リストアイテムに追加

		// リストアイテムにクリックイベントを追加
		listItem.addEventListener('click', (event) => {
			if (deleteMode) {
				deleteCheckbox.checked = !deleteCheckbox.checked;
				deleteSelect();
			}
			if (event.target !== checkbox && deleteMode == false) { // クリックがチェックボックスでない場合のみ遷移
				// モーダルにデータを渡す
				document.getElementById('updateModal1').value = (rowData[1] !== undefined && rowData[1] !== null) ? rowData[1] : ''; // データ1を設定
				document.getElementById('updateModal2').value = (rowData[2] !== undefined && rowData[2] !== null) ? rowData[2] : ''; // データ2を設定
				console.log(`Filtered Row Index: ${rowIndex}, Original Row Index: ${sheetRowIndex}`); // デバッグ用
				// 行番号をデータ属性に設定
				updateModal.dataset.rowIndex = rowIndex; // 検索結果内の行番号を設定
				updateModal.dataset.sheetRowIndex = sheetRowIndex; // キャッシュデータ内の行番号を設定

				// モーダルを表示
				updateModal.style.display = 'block'; // 編集モーダルを表示
				gsap.to(updateModal, { opacity: 1, duration: 0.3 });
				modalOverlay.style.display = 'block'; // オーバーレイを表示
				HFOverlaySetBlock();
			}
		});

		// 削除モードがTRUEのときの処理
		function deleteSelect() {
			const currentDataDelete = currentData.some(value => value === rowData);
			if (currentDataDelete) {
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
			}
			// ヘッダーの削除レコード数を更新
			updateSelectedCount();
		}

		// 削除全選択
		document.getElementById('selectAllIcon').addEventListener('click', function() {
			deleteCheckbox.checked = true; // チェックボックスの状態を切り替え
			deleteSelect();
		});

		// 削除全解除
		document.getElementById('resetAllIcon').addEventListener('click', function() {
			deleteCheckbox.checked = false; // チェックボックスの状態を切り替え
			deleteSelect();
		});

		let handOver;
		deleteButton.addEventListener('click', (event) => {
			event.stopPropagation(); // リストアイテムのタッチイベントをトリガーしない
			deleteModalShow();
			doDeleteSingle.style.display = 'block';
			doDeleteAll.style.display = 'none';
			handOver = rowData;
		});

		// 削除対象の1行を送信
		doDeleteSingle.addEventListener('click', (event) => {
			event.stopPropagation(); // リストアイテムのタッチイベントをトリガーしない
			if (handOver) {
				handOver = null;
				deleteModalHidden();

				const cachedData = JSON.parse(localStorage.getItem('spreadsheetData'));
				cachedData.splice(sheetRowIndex - 2, 1); // 1は削除する要素の数
				localStorage.setItem('spreadsheetData', JSON.stringify(cachedData)); // キャッシュを更新

				search(); // 更新されたデータを表示
				
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
				})
				.catch(error => {
					console.error('Error deleting record:', error);
					// alert("エラーが発生しました。");
				});
			}
		});

		display.appendChild(listItem); // リストに追加
	});
}

// ヘッダーの削除レコード数をカウント
function updateSelectedCount() {
	const countElement = document.getElementById('selectedCount');
	countElement.textContent = rowsToDelete.length; // 選択された行の数を表示
}

// スプレッドシートを更新する関数（チェックボックス）
function updateCheckbox(row, isChecked) {
	const action = isChecked ? 'check' : 'uncheck'; // 更新アクションの決定
	const now = new Date();
	const formattedDate = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

	// キャッシュの更新
	const cachedData = JSON.parse(localStorage.getItem('spreadsheetData'));
	const rowIndex = row - 2; // 1ベースから0ベースに変換
	if (cachedData && cachedData[rowIndex]) {
		cachedData[rowIndex][0] = isChecked; // ブックマークの値を更新
		cachedData[rowIndex][5] = formattedDate; // 更新日時の値を更新
		localStorage.setItem('spreadsheetData', JSON.stringify(cachedData)); // キャッシュを更新
	}

	search(); // 更新されたデータを表示

	fetch(scriptURL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams({
			action: action,
			row: row,
			checkbox: isChecked, // チェックボックスの列のインデックスを追加
			updateTime: formattedDate,
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
	})
	.catch(error => {
		console.error('Error updating spreadsheet:', error);
		// alert("エラーが発生しました。");
	})
}

// スプレッドシートを更新する関数（ブックマーク）
function updateBookmark(row, isBookmarked) {
	const action = isBookmarked ? 'bookmark' : 'unbookmark'; // 更新アクションの決定

	// キャッシュの更新
	const cachedData = JSON.parse(localStorage.getItem('spreadsheetData'));
	const rowIndex = row - 2; // 1ベースから0ベースに変換
	if (cachedData && cachedData[rowIndex]) {
		cachedData[rowIndex][3] = isBookmarked; // ブックマークの値を更新
		localStorage.setItem('spreadsheetData', JSON.stringify(cachedData)); // キャッシュを更新
	}

	search(); // 更新されたデータを表示

	fetch(scriptURL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams({
			action: action,
			row: row,
			bookmark: isBookmarked, // ブックマークの列のインデックスを追加
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
	})
	.catch(error => {
		console.error('Error updating spreadsheet:', error);
		// alert("エラーが発生しました。");
	})
}

// モーダル関連
const insertModal = document.getElementById('insertModal');
const addIcon = document.getElementById('addIcon');

document.addEventListener('DOMContentLoaded', function() {

	// モーダルを表示
	addIcon.addEventListener('click', function() {
		gsap.to(insertModal, { opacity: 1, duration: 0.3 });
		insertModal.style.display = 'block'; // モーダルを表示
		modalOverlay.style.display = 'block'; // オーバーレイを表示
		HFOverlaySetBlock();
	});

	// モーダルを閉じる
	document.getElementById('insertCloseButton').addEventListener('click', function() {
		setTimeout(function() {
			insertModal.style.display = 'none'; // モーダルを非表示
		}, 300);
		gsap.to(insertModal, { opacity: 0, duration: 0.5 });
		modalOverlay.style.display = 'none'; // オーバーレイを非表示
		HFOverlaySetNone();
		insertForm.reset(); // フォームの内容をクリア
	});

	// モーダルを閉じる
	document.getElementById('updateCloseButton').addEventListener('click', function() {
		setTimeout(function() {
			updateModal.style.display = 'none'; // モーダルを非表示
		}, 300);
		gsap.to(updateModal, { opacity: 0, duration: 0.5 });
		modalOverlay.style.display = 'none'; // オーバーレイを非表示
		HFOverlaySetNone();
	});

	// モーダルの外側（オーバーレイ）をクリックしたときに閉じる
	modalOverlay.addEventListener('click', function() {
		setTimeout(function() {
			insertModal.style.display = 'none'; // モーダルを非表示
			updateModal.style.display = 'none'; // モーダルを非表示
		}, 300);
		gsap.to(insertModal, { opacity: 0, duration: 0.3 });
		gsap.to(updateModal, { opacity: 0, duration: 0.3 });
		insertForm.reset(); // フォームの内容をクリア
		sideMenuClose(); // ヘッダー、フッター、モーダルのオーバーレイ非表示を含む
		deleteModal.style.display = 'none';
	});
});

// 新規追加フォーム送信
const insertForm = document.forms['insert-form'];

insertForm.addEventListener('submit', function(event) {
	event.preventDefault(); // デフォルトの送信を防ぐ
	setTimeout(function() {
		insertModal.style.display = 'none'; // モーダルを非表示
	}, 300);
	gsap.to(insertModal, { opacity: 0, duration: 0.3 });
	modalOverlay.style.display = 'none'; // オーバーレイを非表示
	HFOverlaySetNone();

	const insertModal1 = document.getElementById('insertModal1').value;
	const insertModal2 = document.getElementById('insertModal2').value;

	const now = new Date();
	const formattedDate = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

	insertForm.reset(); // フォームの内容をクリア

	const newDate = [];
	newDate.push(false);
	newDate.push(insertModal1);
	newDate.push(insertModal2);
	newDate.push(false);
	newDate.push(formattedDate);
	newDate.push(formattedDate);

	// キャッシュの更新
	const cachedData = JSON.parse(localStorage.getItem('spreadsheetData'));
	cachedData.push(newDate);
	localStorage.setItem('spreadsheetData', JSON.stringify(cachedData)); // キャッシュを更新

	search(); // 更新されたデータを表示

	const insertFormData = new FormData(insertForm); // フォームデータを新たに作成

	// FormDataにパラメータを追加
	insertFormData.append('action', 'add'); // actionを'add'に設定
	insertFormData.append('data1', insertModal1); // モーダルの入力データを設定
	insertFormData.append('data2', insertModal2); // モーダルの入力データを設定
	insertFormData.append('time', formattedDate); // 追加、更新時間を設定

	fetch(scriptURL, { method: 'POST', body: insertFormData })
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json(); // レスポンスをJSON形式で取得
		})
		.then(data => {
			console.log('Insert successful:', data); // レスポンスの内容を確認
		})
		.catch(error => {
			console.error('Error!', error.message);
			// alert("エラーが発生しました。");
		})
});

// 更新フォーム送信
const updateForm = document.forms['update-form'];

updateForm.addEventListener('submit', function(event) {
	event.preventDefault(); // デフォルトの送信を防ぐ
	setTimeout(function() {
		updateModal.style.display = 'none'; // モーダルを非表示
	}, 300);
	gsap.to(updateModal, { opacity: 0, duration: 0.3 });
	modalOverlay.style.display = 'none'; // オーバーレイを非表示
	HFOverlaySetNone();

	const sheetRowIndex = parseInt(updateModal.dataset.sheetRowIndex) - 2; // キャッシュデータ内の行番号を取得
	const updateModal1 = document.getElementById('updateModal1').value;
	const updateModal2 = document.getElementById('updateModal2').value;
	const now = new Date();
	const formattedDate = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

	// キャッシュの更新
	const cachedData = JSON.parse(localStorage.getItem('spreadsheetData'));
	cachedData[sheetRowIndex][1] = updateModal1; // 2列目を更新
	cachedData[sheetRowIndex][2] = updateModal2; // 3列目を更新
	cachedData[sheetRowIndex][5] = formattedDate; // 6列目を更新
	localStorage.setItem('spreadsheetData', JSON.stringify(cachedData));

	search(); // 更新されたデータを表示

	const updateFormData = new FormData(updateForm); // フォームデータを新たに作成

	// 更新アクションと行番号を追加
	updateFormData.append('action', 'update'); // actionを'update'に設定
	updateFormData.append('row', sheetRowIndex + 2); // 更新する行番号を追加

	// モーダルの入力データを追加
	updateFormData.append('data1', updateModal1);
	updateFormData.append('data2', updateModal2);

	// 更新時間を追加
	updateFormData.append('updateTime', formattedDate);

	fetch(scriptURL, { method: 'POST', body: updateFormData })
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json(); // レスポンスをJSON形式で取得
		})
		.then(data => {
			console.log('Update successful:', data); // レスポンスの内容を確認
		})
		.catch(error => {
			console.error('Error!', error.message);
			// alert("エラーが発生しました。");
		})
});

let deleteMode = false; // 削除モードの状態を管理

const deleteModeIcon = document.getElementById('deleteModeIcon');
document.addEventListener('DOMContentLoaded', () => {
	deleteModeIcon.addEventListener('click', () => {
		deleteModeChange(); // 削除モード=TRUE
	});
});

const deleteAllIcon = document.getElementById('deleteAllIcon');
deleteAllIcon.addEventListener('click', () => {
	if (rowsToDelete.length === 0) {
		alert('削除するデータが選択されていません。');
	} else {
		deleteModalShow();
		doDeleteAll.style.display = 'block';
		doDeleteSingle.style.display = 'none';
	}
});

document.addEventListener('DOMContentLoaded', () => {
	doDeleteAll.addEventListener('click', () => {
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
	deleteModalHidden();
	const cachedData = JSON.parse(localStorage.getItem('spreadsheetData'));
	for (let i = rowsToDelete.length - 1; i >= 0; i--) {
		cachedData.splice(rowsToDelete[i] - 2, 1); // 1は削除する要素の数
	}
	localStorage.setItem('spreadsheetData', JSON.stringify(cachedData)); // キャッシュを更新

	search(); // 更新されたデータを表示

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
		rowsToDelete.length = 0; // 配列を初期化する
	})
	.catch(error => {
		console.error('Error deleting records:', error);
		// alert("エラーが発生しました。");
	});
}

// 削除確認モーダル機能
const deleteModal = document.getElementById('deleteModal');
const doDeleteSingle = document.getElementById('doDeleteSingle');
const doDeleteAll = document.getElementById('doDeleteAll');

function deleteModalShow() {
	deleteModal.style.display = 'block'; // モーダルを表示
	modalOverlay.style.display = 'block'; // オーバーレイを表示
	HFOverlaySetBlock();
}

function deleteModalHidden() {
	deleteModal.style.display = 'none'; // モーダルを非表示
	modalOverlay.style.display = 'none'; // オーバーレイを非表示
	HFOverlaySetNone();
}

document.getElementById('deleteCancel').addEventListener('click', () => {
	deleteModalHidden();
});

// ゴミ箱アイコン押下アクション
function deleteModeChange() {
	deleteMode = !deleteMode; // モードを切り替え
	headerColor(deleteMode); // ヘッダーの色を切り替え
	headerChar(deleteMode); // ヘッダーの文字を切り替え
	deleteCheckboxes(deleteMode); // チェックボックスの表示を切り替え
	deleteButton(deleteMode); // 単体削除ボタンの表示を切り替える関数
	deleteIcon(deleteMode); // ゴミ箱アイコンの表示を切り替え
	selectedCount(deleteMode); // ヘッダーの削除レコード数の表示を切り替え

	// addIcon,chacheClearIconの表示を切り替える
	addIcon.style.display = deleteMode ? 'none' : 'flex'; // 削除モード時は非表示、そうでない場合は表示
	chacheClearIcon.style.display = deleteMode ? 'none' : 'inline'; // 削除モード時は非表示、そうでない場合は表示
	// NavigationButtonsの表示を切り替える
	document.getElementById('navigationButtons').style.display = deleteMode ? 'none' : 'flow-root'; // 削除モードがTRUEの場合、非表示にする
	document.getElementById('deleteNavigationButtons').style.display = deleteMode ? 'flow-root' : 'none'; // 削除モードがTRUEの場合、非表示にする

	// リストの全てのチェックボックスを非活性または活性にする
	const checkboxes = document.querySelectorAll('#dataDisplay input[type="checkbox"]');
	checkboxes.forEach(cb => {
		// deleteCheckboxクラスを持つチェックボックスは非活性にしない
		if (!cb.classList.contains('delete-checkbox')) {
			cb.disabled = deleteMode; // チェックボックスを非活性または活性に設定
		}
	});
	// ブックマークアイコンの非活性化
	const bookmarkOnIcons = document.querySelectorAll('#bookmark-on');
	const bookmarkOffIcons = document.querySelectorAll('#bookmark-off');
	bookmarkOnIcons.forEach(icon => {
		icon.style.pointerEvents = deleteMode ? 'none' : 'auto'; // クリックイベントを無効化
		icon.style.opacity = deleteMode ? '0.5' : '1'; // 見た目を変えるために透明度を変更
	});
	bookmarkOffIcons.forEach(icon => {
		icon.style.pointerEvents = deleteMode ? 'none' : 'auto'; // クリックイベントを無効化
		icon.style.opacity = deleteMode ? '0.5' : '1'; // 見た目を変えるために透明度を変更
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
	const cancelButton = document.getElementById('cancelButton');
	const settingIcon = document.getElementById('setting-icon');
	const title = document.querySelector('.center');
	if (isVisible) {
		cancelButton.style.display = 'inline'; // キャンセルボタンを表示
		settingIcon.style.display = 'none'; // キャンセルボタンを非表示
		title.classList.remove('hidden'); // タイトルを表示
	} else {
		cancelButton.style.display = 'none'; // キャンセルボタンを非表示
		settingIcon.style.display = 'inline'; // キャンセルボタンを表示
		title.classList.add('hidden'); // タイトルを非表示
	}
}

// チェックボックスの表示を切り替える関数
function deleteCheckboxes(isVisible) {
	const checkboxes = document.querySelectorAll('.delete-checkbox'); // 削除用のチェックボックスを取得
	checkboxes.forEach(checkbox => {
		checkbox.style.display = isVisible ? 'inline' : 'none'; // 表示/非表示を切り替え
	});
}

// 単体削除ボタンの表示を切り替える関数
function deleteButton(isVisible) {
	const deleteButton = document.querySelectorAll('.single-delete-icons'); // 削除用のチェックボックスを取得
	deleteButton.forEach(deleteButton => {
		deleteButton.style.display = isVisible ? 'none' : 'inline'; // 表示/非表示を切り替え
	});
}

// ゴミ箱アイコンの表示を切り替える関数
function deleteIcon(isVisible) {
	deleteAllIcon.style.display = isVisible ? 'inline' : 'none'; // 表示/非表示を切り替え
	deleteModeIcon.style.display = isVisible ? 'none' : 'inline'; // 表示/非表示を切り替え
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
let bookmarkSearchFlg = false; // ブックマークのレコード用フラグ
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
	checkTrue.classList.remove('searchOptionSelected');
	checkFlgFalse = false;
	checkFalse.classList.remove('searchOptionSelected');
	bookmarkSearchFlg = false;
	bookmarkFilter.classList.remove('searchOptionSelected');
}

// 検索機能
function search() {
	const filterInputSearch = filterInput.value.toLowerCase(); // 小文字に変換して取得
	const checkTrueSelected = checkFlgTrue; // チェックありのフラグ
	const checkFalseSelected = checkFlgFalse; // チェックなしのフラグ
	const bookmarkSelected = bookmarkSearchFlg; // ブックマークのフラグ
	const cachedData = JSON.parse(localStorage.getItem('spreadsheetData')) || []; // キャッシュからデータを取得

	// フィルタリングされたデータを格納する配列
	const filteredData = cachedData.filter(row => {
		const matchesText = (typeof row[1] === 'string' || typeof row[1] === 'number') && 
				String(row[1]).toLowerCase().includes(filterInputSearch); // 2列目の値に基づくフィルタリング
		const matchesCheckbox = (checkTrueSelected && row[0] === true) || (checkFalseSelected && row[0] === false);
		const matchesBookmark = bookmarkSelected ? row[3] === true : true; // 4列目（ブックマーク）でフィルタリング

		return matchesText && (checkTrueSelected || checkFalseSelected ? matchesCheckbox : true) && matchesBookmark;
	});

	displayData(filteredData); // フィルタリングされたデータを表示
	sortList(sortMode);
	searchNone(); // 検索結果が0件の場合の表示制御
}

// チェックボタンのクリックイベント
const checkTrue = document.getElementById('checkTrue');
checkTrue.addEventListener('click', function() {
	checkFlgTrue = !checkFlgTrue; // フラグを切り替え
	if (checkFlgTrue) {
		checkFlgFalse = false;
		checkTrue.classList.add('searchOptionSelected');
		checkFalse.classList.remove('searchOptionSelected');
	} else {
		checkTrue.classList.remove('searchOptionSelected');
	}
	search();
});

const checkFalse = document.getElementById('checkFalse');
checkFalse.addEventListener('click', function() {
	checkFlgFalse = !checkFlgFalse; // フラグを切り替え
	if (checkFlgFalse) {
		checkFlgTrue = false;
		checkFalse.classList.add('searchOptionSelected');
		checkTrue.classList.remove('searchOptionSelected');
	} else {
		checkFalse.classList.remove('searchOptionSelected');
	}
	search();
});

filterInput.addEventListener('blur', function() {
	search();
});

filterInput.addEventListener('keypress', (event) => {
	if (event.key === 'Enter') {
		event.preventDefault(); // デフォルトのフォーム送信を防ぐ
		document.activeElement.blur();
		lastSearchValue = filterInput.value; // 値を保持
		search();
		updateFilterIcon();
		sideMenu.classList.remove('open');
		modalOverlay.style.display = 'none';
		HFOverlaySetNone();
	}
});

// ブックマークのクリックイベント
const bookmarkFilter = document.getElementById('bookmarkFilter');
bookmarkFilter.addEventListener('click', function() {
	bookmarkSearchFlg = !bookmarkSearchFlg; // フラグを切り替え
	if (bookmarkSearchFlg) {
		bookmarkFilter.classList.add('searchOptionSelected');
	} else {
		bookmarkFilter.classList.remove('searchOptionSelected');
	}
	search();
});

// 検索ボタン押下アクション
document.getElementById('searchButton').addEventListener('click', () => {
	lastSearchValue = filterInput.value; // 値を保持
	search();
	updateFilterIcon();
	sideMenu.classList.remove('open');
	modalOverlay.style.display = 'none';
	HFOverlaySetNone();
});

// 絞り込み条件の有無
const filterResetIcon = document.getElementById('filterResetIcon');
function updateFilterIcon() {
	const filterIconText = document.querySelector('#filterIcon span:last-child'); // <span>要素を取得
	if (checkFlgTrue == true || checkFlgFalse == true || bookmarkSearchFlg == true || filterInput.value != ''){
		filterIconText.textContent = '絞り込み中'; // テキストを変更
		filterResetIcon.style.display = 'flex'; // 絞り込み中の場合、表示する
	} else {
		filterIconText.textContent = '絞り込み'; // テキストを変更
		filterResetIcon.style.display = 'none'; // 絞り込み中の場合、非表示する
	}
}

// 絞り込み条件リセットアクション
filterResetIcon.addEventListener('click', () => {
	doClear();
	search();
	updateFilterIcon();
});

// 検索結果が0件の場合の表示制御
const searchNoneScreen = document.getElementById('searchNoneScreen');
function searchNone() {
	const isSearchNoneScreen = currentData.length === 0;
	searchNoneScreen.style.display = isSearchNoneScreen ? 'inline' : 'none';
	deleteModeIcon.style.display = isSearchNoneScreen ? 'none' : 'inline'; // 表示/非表示を切り替え
}

const resetSerch = document.getElementById('resetSerch');
resetSerch.addEventListener('click', () => {
	doClear();
	search();
	updateFilterIcon();
});

// 昇順、降順の切り替え
let sortMode = localStorage.getItem('sortMode') || 'insert';
const ascIcon = document.getElementById('ascIcon');
const descIcon = document.getElementById('descIcon');
let sort = localStorage.getItem('sort') || 'desc';
document.addEventListener('DOMContentLoaded', () => {
	if (sort == 'asc') {
		ascIcon.classList.add('actionButtonSelected');
	} else {
		descIcon.classList.add('actionButtonSelected'); // 初期状態でasc-iconを赤に
	}

	ascIcon.addEventListener('click', function() {
		localStorage.setItem('sort', 'asc');
		sort = 'asc';
		ascIcon.classList.add('actionButtonSelected');
		descIcon.classList.remove('actionButtonSelected');
		sortList(sortMode);
	});

	descIcon.addEventListener('click', function() {
		localStorage.setItem('sort', 'desc');
		sort = 'desc';
		descIcon.classList.add('actionButtonSelected');
		ascIcon.classList.remove('actionButtonSelected');
		sortList(sortMode);
	});
});

// sortIconをクリックしたときにプルダウンを表示
const sortIcon = document.getElementById('sortIcon');
const sortDropdown = document.getElementById('sortDropdown');
sortIcon.addEventListener('click', () => {
	sortDropdown.style.display = sortDropdown.style.display === 'block' ? 'none' : 'block';
});

// 並び替えプルダウンをクリックしたときの処理
const sortInsert = document.getElementById('sortInsert');
sortInsert.addEventListener('click', () => {
	// 追加日時の処理
	localStorage.setItem('sortMode', 'insert');
	sortMode = 'insert';
	sortList(sortMode);
	sortDropdown.style.display = 'none'; // プルダウンを非表示にする
});

const sortUpdate = document.getElementById('sortUpdate');
sortUpdate.addEventListener('click', () => {
	// 更新日時の処理
	localStorage.setItem('sortMode', 'update');
	sortMode = 'update';
	sortList(sortMode);
	sortDropdown.style.display = 'none'; // プルダウンを非表示にする
});

const sortCook = document.getElementById('sortCook');
sortCook.addEventListener('click', () => {
	// 料理名の処理
	localStorage.setItem('sortMode', 'cook');
	sortMode = 'cook';
	sortList(sortMode);
	sortDropdown.style.display = 'none'; // プルダウンを非表示にする
});

const sortCheckbox = document.getElementById('sortCheckbox');
sortCheckbox.addEventListener('click', () => {
	// チェックボックスの処理
	localStorage.setItem('sortMode', 'checkbox');
	sortMode = 'checkbox';
	sortList(sortMode);
	sortDropdown.style.display = 'none'; // プルダウンを非表示にする
});

// リストをソートする関数
function sortList(order) {
	currentData.sort((a, b) => {

		const aValue = String(a[1]); // 明示的に文字列に変換
		const bValue = String(b[1]); // 明示的に文字列に変換
		const ainsertTimestamp = new Date(a[4]); // E列の値を日時に変換
		const binsertTimestamp = new Date(b[4]); // E列の値を日時に変換
		const aupdateTimestamp = new Date(a[5]); // F列の値を日時に変換
		const bupdateTimestamp = new Date(b[5]); // F列の値を日時に変換

		// ①追加日時に基づいてソート
		if (order === 'insert' && sort === 'asc') {
			if (!a[4] && !b[4]) return 0; // 両方空の場合はそのまま
			if (!a[4]) return 1; // aが空の場合はbを上に
			if (!b[4]) return -1; // bが空の場合はaを上に
			return ainsertTimestamp - binsertTimestamp; // 昇順でソート
		} else if (order === 'insert' && sort === 'desc') {
			if (!a[4] && !b[4]) return 0; // 両方空の場合はそのまま
			if (!a[4]) return -1; // aが空の場合はbを上に
			if (!b[4]) return 1; // bが空の場合はaを上に
			return binsertTimestamp - ainsertTimestamp; // 降順でソート
		}
		// ②更新日時に基づいてソート
		if (order === 'update' && sort === 'asc') {
			if (!a[5] && !b[5]) return 0; // 両方空の場合はそのまま
			if (!a[5]) return 1; // aが空の場合はbを上に
			if (!b[5]) return -1; // bが空の場合はaを上に
			return aupdateTimestamp - bupdateTimestamp; // 昇順でソート
		} else if (order === 'update' && sort === 'desc') {
			if (!a[5] && !b[5]) return 0; // 両方空の場合はそのまま
			if (!a[5]) return -1; // aが空の場合はbを上に
			if (!b[5]) return 1; // bが空の場合はaを上に
			return bupdateTimestamp - aupdateTimestamp; // 降順でソート
		}
		// ③テキストに基づいてソート
		if (order === 'cook' && sort === 'asc') {
			// 表示テキストを文字列として比較
			return aValue.localeCompare(bValue); // 昇順でソート
		} else if (order === 'cook' && sort === 'desc') {
			// 表示テキストを文字列として比較
			return bValue.localeCompare(aValue); // 降順でソート
		}
		// ④チェックボックスの状態に基づいてソート
		if (order === 'checkbox' && sort === 'asc') {
			if (a[0] === true && b[0] === false) {
				return -1; // aを上に
			} else if (a[0] === false && b[0] === true) {
				return 1; // bを上に
			} else {
				return 0; // 同じ場合はそのまま
			}
		} else if (order === 'checkbox' && sort === 'desc') {	
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
	dropdownColor(sortMode);
	// 並び替えの条件テキストを変更
	updateDropdownIcon();
}

// プルダウンの色を変更
function dropdownColor(order) {
	if (order === 'insert') {
		sortInsert.classList.add('sort-top'); // クラスを追加
	} else {
		sortInsert.classList.remove('sort-top'); // クラスを削除
	}
	if (order === 'update') {
		sortUpdate.classList.add('sort-center'); // クラスを追加
	} else {
		sortUpdate.classList.remove('sort-center'); // クラスを削除
	}
	if (order === 'cook') {
		sortCook.classList.add('sort-center'); // クラスを追加
	} else {
		sortCook.classList.remove('sort-center'); // クラスを削除
	}
	if (order === 'checkbox') {
		sortCheckbox.classList.add('sort-bottom'); // クラスを追加
	} else {
		sortCheckbox.classList.remove('sort-bottom'); // クラスを削除
	}
}

// 並び替え条件のテキスト
function updateDropdownIcon() {
	const sortIconText = document.querySelector('#sortIcon span:last-child'); // <span>要素を取得
	if (sortMode == 'insert'){
		sortIconText.textContent = '追加日時順'; // テキストを変更
	} else if (sortMode == 'update') {
		sortIconText.textContent = '更新日時順'; // テキストを変更
	} else if (sortMode == 'cook') {
		sortIconText.textContent = '料理名順'; // テキストを変更
	} else if (sortMode == 'checkbox') {
		sortIconText.textContent = 'チェック順'; // テキストを変更
	}
}

// ドキュメントの他の部分がクリックされたときにプルダウンを閉じる
document.addEventListener('click', (event) => {
	if (!sortIcon.contains(event.target) && !sortDropdown.contains(event.target)) {
		sortDropdown.style.display = 'none';
	}
});

let lastScrollTop = 0; // 最後のスクロール位置
window.addEventListener('scroll', function() {
	const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	if (scrollTop > lastScrollTop) {
		// スクロールダウン
		sortDropdown.style.display = 'none';
	} else {
		// スクロールアップ
		sortDropdown.style.display = 'none';
	}
	lastScrollTop = scrollTop; // 現在のスクロール位置を更新
});

// ヘルプページへ遷移
document.getElementById('helpIcon').addEventListener('click', () => {
	window.location.href = 'top.html'; // 遷移先のページ
});

// テーマ設定開閉
const optionTheme = document.getElementById('optionTheme');
document.addEventListener('DOMContentLoaded', () => {
	// オプションを開く
	document.getElementById('theme').addEventListener('click', () => {
		optionTheme.classList.add('open');
	});
	// メニューを閉じる
	document.getElementById('closeOptionTheme').addEventListener('click', () => {
		optionTheme.classList.remove('open');
	});
});

function changeThemeColor(headerColor, backgroundColor, buttonColor) {
	document.documentElement.style.setProperty('--header-color', headerColor);
	document.documentElement.style.setProperty('--background-color', backgroundColor);
	document.documentElement.style.setProperty('--button-color', buttonColor);

	// localStorageに保存
	localStorage.setItem('headerColor', headerColor);
	localStorage.setItem('backgroundColor', backgroundColor);
	localStorage.setItem('buttonColor', buttonColor);
}

document.addEventListener('DOMContentLoaded', () => {
	// localStorageからテーマカラーを取得
	const headerColor = localStorage.getItem('headerColor') || '#C9A7A3'; // デフォルト色
	const backgroundColor = localStorage.getItem('backgroundColor') || '#fff2f2'; // デフォルト色
	const buttonColor = localStorage.getItem('buttonColor') || '#FFC4C4'; // デフォルト色

	// カラーを適用
	changeThemeColor(headerColor, backgroundColor, buttonColor);

	// イベントリスナーの設定
	document.getElementById('colorCheck1').addEventListener('click', () => {
		changeThemeColor('#C9A7A3', '#fff2f2', '#FFC4C4');
	});
	document.getElementById('colorCheck2').addEventListener('click', () => {
		changeThemeColor('#F44336', '#FFEBEE', '#FF8A80');
	});
	document.getElementById('colorCheck3').addEventListener('click', () => {
		changeThemeColor('#9C27B0', '#E1BEE7', '#EA80FC');
	});
	document.getElementById('colorCheck4').addEventListener('click', () => {
		changeThemeColor('#2196F3', '#E3F2FD', '#82B1FF');
	});
	document.getElementById('colorCheck5').addEventListener('click', () => {
		changeThemeColor('#009688', '#E0F2F1', '#A7FFEB');
	});
	document.getElementById('colorCheck6').addEventListener('click', () => {
		changeThemeColor('#FFEB3B', '#FFFDE7', '#FFFF8D');
	});
	document.getElementById('colorCheck7').addEventListener('click', () => {
		changeThemeColor('#795548', '#EFEBE9', '#8D6E63');
	});
	document.getElementById('colorCheck8').addEventListener('click', () => {
		changeThemeColor('#607D8B', '#ECEFF1', '#78909C');
	});
});

// パスコード設定開閉
const optionPassword = document.getElementById('optionPassword');
document.addEventListener('DOMContentLoaded', () => {
	// オプションを開く
	document.getElementById('password').addEventListener('click', () => {
		optionPassword.classList.add('open');
	});
	// メニューを閉じる
	document.getElementById('closeOptionPassword').addEventListener('click', () => {
		optionPassword.classList.remove('open');
	});
});

const passToggle = document.getElementById('passToggle');
const passwordChangeBlock = document.getElementById('passwordChangeBlock');
const passwordSettig = document.getElementById('passwordSettig');
const passwordCancel = document.getElementById('passwordCancel');
let previousPassAction = null; // 前のアクションを格納する変数
document.addEventListener('DOMContentLoaded', () => {

	passToggle.checked = registrationSuccess;
	passwordChangeBlock.style.display = registrationSuccess ? 'flex' : 'none';

	passToggle.addEventListener('change', () => {
		message.textContent = ''; // メッセージをクリア
		previousPassAction = "passToggle";
		if (passToggle.checked == true) {
			passwordSettig.classList.add('open');
			digitInputs[0].focus(); // ページが読み込まれたときに最初の入力ボックスにフォーカスを設定
		} else {
			localStorage.setItem('registrationSuccess', 'false');
			localStorage.removeItem('userPassword'); // パスワードをローカルストレージに保存
			passwordChangeBlock.style.display = 'none';
			passToggle.checked = false;
		}
	});

	passwordChangeBlock.addEventListener('click', () => {
		message.textContent = ''; // メッセージをクリア
		passwordSettig.classList.add('open');
		digitInputs[0].focus(); // ページが読み込まれたときに最初の入力ボックスにフォーカスを設定
		previousPassAction = "passwordChange";
	});

	// メニューを閉じる
	passwordCancel.addEventListener('click', () => {
		passwordSettig.classList.remove('open');
		message.textContent = ''; // メッセージをクリア
		if (previousPassAction === "passToggle") {
			passToggle.checked = false;
		}
		// 入力をリセット
		digitInputs.forEach(input => input.value = ''); // 1回目の入力クリア
		for (let i = 0; i < digitInputs.length; i++) {
			digitInputs[i].disabled = true; // 他の桁を無効にする
		}
		digitInputs[0].disabled = false;
		verifyInputs.forEach(input => input.value = ''); // 2回目の入力クリア
		for (let i = 0; i < verifyInputs.length; i++) {
			verifyInputs[i].disabled = true; // 他の桁を無効にする
		}
		verifyInputs[0].disabled = false;
		firstSection.style.display = 'block'; // 1回目のパスワード画面を再表示
		verifySection.style.display = 'none'; // 確認セクションを非表示にする
		document.activeElement.blur();
	});
});

let registrationSuccess = localStorage.getItem('registrationSuccess') === 'true';
let message = document.getElementById('message');
const digitInputs = document.querySelectorAll('#firstSection .digit-input');
const verifyInputs = document.querySelectorAll('#verifySection .digit-input');
const firstSection = document.getElementById('firstSection');
const verifySection = document.getElementById('verifySection');
document.addEventListener('DOMContentLoaded', () => {
	let firstPassword = '';
	// 入力ボックスの自動フォーカス処理
	digitInputs.forEach((input, index) => {
		input.addEventListener('input', () => {
			// 半角数字でない場合はクリア
			if (!/^[0-9]*$/.test(input.value)) {
				input.value = '';
			}
			// 次の桁を有効にする
			if (input.value.length === 1) {
				if (index < digitInputs.length - 1) {
					digitInputs[index + 1].disabled = false; // 次の桁を有効にする
					digitInputs[index + 1].focus(); // 次の桁にフォーカスを移動
				}
				// 現在の桁以外を無効にする
				for (let i = 0; i < digitInputs.length; i++) {
					if (i !== index + 1) {
						digitInputs[i].disabled = true;
					}
				}
			}
			if (input.value.length === 1 && index < digitInputs.length - 1) {
				digitInputs[index + 1].focus(); // 次の入力ボックスにフォーカス
				input.type = 'text';
				input.type = 'password';
			}
			// すべての入力ボックスが埋まったらパスワードを確認
			if (Array.from(digitInputs).every(input => input.value.length === 1)) {
				firstPassword = Array.from(digitInputs).map(input => input.value).join('');
				message.textContent = 'パスコードが登録されました。次にもう一度入力してください。';
				message.style.color = 'green'; // 成功メッセージの色
				firstSection.style.display = 'none';
				verifySection.style.display = 'block';
				verifyInputs[0].focus(); // 確認の最初の入力ボックスにフォーカス
				digitInputs.forEach(input => input.value = ''); // 1回目の入力クリア
				for (let i = 0; i < digitInputs.length; i++) {
					digitInputs[i].disabled = true; // 他の桁を無効にする
				}
				digitInputs[0].disabled = false;
			}
		});
		// バックスペースで前のボックスに移動
		input.addEventListener('keydown', (event) => {
			if (event.key === 'Backspace' && input.value === '') {
				if (index > 0) {
					input.type = 'text';
					input.type = 'password';
					digitInputs[index - 1].disabled = false; // 前の桁を有効にする
					digitInputs[index - 1].value = '';
					digitInputs[index - 1].focus(); // 前の入力ボックスにフォーカス
					// 現在の桁以外を無効にする
					for (let i = 0; i < digitInputs.length; i++) {
						if (i !== index - 1) {
							digitInputs[i].disabled = true; // 他の桁を無効にする
						}
					}
				}
			}
		});
	});

	// 確認のための入力ボックス
	verifyInputs.forEach((input, index) => {
		input.addEventListener('input', () => {
			// 半角数字でない場合はクリア
			if (!/^[0-9]*$/.test(input.value)) {
				input.value = '';
			}
			// 次の桁を有効にする
			if (input.value.length === 1) {
				if (index < verifyInputs.length - 1) {
					verifyInputs[index + 1].disabled = false; // 次の桁を有効にする
					verifyInputs[index + 1].focus(); // 次の桁にフォーカスを移動
				}
				// 現在の桁以外を無効にする
				for (let i = 0; i < verifyInputs.length; i++) {
					if (i !== index + 1) {
						verifyInputs[i].disabled = true;
					}
				}
			}
			if (input.value.length === 1 && index < verifyInputs.length - 1) {
				verifyInputs[index + 1].focus(); // 次の入力ボックスにフォーカス
				input.type = 'text';
				input.type = 'password'; // 入力されたらアスタリスクにする
			}
			// すべての確認入力ボックスが埋まったら比較
			if (Array.from(verifyInputs).every(input => input.value.length === 1)) {
				const verifyPassword = Array.from(verifyInputs).map(input => input.value).join('');
				// パスワードが一致するか確認
				if (firstPassword === verifyPassword) {
					localStorage.setItem('userPassword', firstPassword); // パスワードをローカルストレージに保存
					localStorage.setItem('registrationSuccess', 'true');
					passwordSettig.classList.remove('open');
					// 入力をリセット
					verifyInputs.forEach(input => input.value = ''); // 2回目の入力クリア
					// 現在の桁以外を無効にする
					for (let i = 0; i < verifyInputs.length; i++) {
						verifyInputs[i].disabled = true; // 他の桁を無効にする
					}
					verifyInputs[0].disabled = false;
					firstSection.style.display = 'block';
					verifySection.style.display = 'none'; // 確認セクションを非表示にする
					passwordChangeBlock.style.display = 'flex';
					passToggle.checked = true;
				} else {
					message.textContent = 'パスワードが一致しません。もう一度入力してください。';
					message.style.color = 'red'; // エラーメッセージの色
					// 入力をリセット
					verifyInputs.forEach(input => input.value = ''); // 2回目の入力クリア
					// 現在の桁以外を無効にする
					for (let i = 0; i < verifyInputs.length; i++) {
						verifyInputs[i].disabled = true; // 他の桁を無効にする
					}
					verifyInputs[0].disabled = false;
					verifyInputs.forEach(input => input.value = '');
					firstSection.style.display = 'block'; // 1回目のパスワードを再表示
					verifySection.style.display = 'none'; // 確認セクションを非表示にする
					digitInputs[0].focus(); // 最初の入力ボックスにフォーカス
					input.type = 'text';
					input.type = 'password';
				}
			}
		});
		// バックスペースで前のボックスに移動
		input.addEventListener('keydown', (event) => {
			if (event.key === 'Backspace' && input.value === '') {
				if (index > 0) {
					input.type = 'text';
					input.type = 'password';
					verifyInputs[index - 1].disabled = false; // 前の桁を有効にする
					verifyInputs[index - 1].value = '';
					verifyInputs[index - 1].focus(); // 前の入力ボックスにフォーカス
					// 現在の桁以外を無効にする
					for (let i = 0; i < verifyInputs.length; i++) {
						if (i !== index - 1) {
							verifyInputs[i].disabled = true; // 他の桁を無効にする
						}
					}
				}
			}
		});
	});
});
