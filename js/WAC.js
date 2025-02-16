const scriptURL = 'https://script.google.com/macros/s/AKfycbzdvQN-SX6oauQdT3XWL2iRxkK9a1u9hnfSaWycWSToLSRMB1ERHyhIybht1gkMvd8m/exec';

const updateModal = document.getElementById('updateModal');
const modalOverlay = document.getElementById('modalOverlay'); // モーダルオーバーレイを取得
const reloadOverlay = document.getElementById('reloadOverlay'); // リロードオーバーレイを取得

const rowsToDelete = []; // 削除対象のレコード数

window.onload = function() {
	fetchData();
	fetchtemplateData();
	console.log(localStorage);
};

const chacheClearIcon = document.getElementById('chacheClearIcon');
chacheClearIcon.addEventListener('click', () => {
	localStorage.removeItem('spreadsheetData');
	localStorage.removeItem('templateData');
	fetchData();
	fetchtemplateData();
	alert('キャッシュをクリアしてデータを取得します。');
});

// サイドメニュー開閉
const sideMenu = document.getElementById('sideMenu');
const filterIcon = document.getElementById('filterIcon');
const reSearchButton = document.getElementById('reSearchButton');
document.addEventListener('DOMContentLoaded', () => {
	// メニューを開く
	filterIcon.addEventListener('click', sideMenuOpen);
	reSearchButton.addEventListener('click', sideMenuOpen);
	// メニューを閉じる
	document.getElementById('closeSideMenuButton').addEventListener('click', sideMenuClose);
});

// サイドメニューを開く
function sideMenuOpen() {
	sideMenu.classList.add('open');
	modalOverlay.style.display = 'block';
	document.body.style.overflow = 'hidden'; // bodyのオーバーフローを隠す
}

// サイドメニューを閉じる
function sideMenuClose() {
	sideMenu.classList.remove('open');
	modalOverlay.style.display = 'none';
	updateFilterIcon(); // 絞り込み条件の有無
	document.body.style.overflow = ''; // bodyのオーバーフローを元に戻す
}

// テンプレート選択メニュー開閉
const templateSelectMenu = document.getElementById('templateSelectMenu');
const templateSelectButton = document.getElementById('templateSelectButton');
document.addEventListener('DOMContentLoaded', () => {

	// メニューを開く
	templateSelectButton.addEventListener('click', () => {
		templateSelectMenu.classList.add('open');
		document.body.style.overflow = 'hidden'; // bodyのオーバーフローを隠す
	});

	// メニューを閉じる
	document.getElementById('closetemplateSelectMenu').addEventListener('click', () => {
		closetemplateSelectMenu();
	});
});

function closetemplateSelectMenu() {
	templateSelectMenu.classList.remove('open');
	// すべてのサブメニューを閉じる
	const allSubmenus = document.querySelectorAll('#accordion .submenu');
	allSubmenus.forEach(submenu => {
		submenu.classList.remove('open'); // openクラスを削除
	});
	// すべてのリストアイテムからopenクラスを削除
	const allListItems = document.querySelectorAll('#accordion li');
	allListItems.forEach(item => {
		item.classList.remove('open'); // openクラスを削除
	});
	document.body.style.overflow = ''; // bodyのオーバーフローを元に戻す
}

function fetchData() {
	const cachedData = localStorage.getItem('spreadsheetData');
	const action = 'spreadSheetGet';

	// オーバーレイを表示
	reloadOverlay.style.display = 'block';

	if (cachedData) {
		// キャッシュが存在する場合はそれを使用
		currentData = JSON.parse(cachedData); // currentDataにキャッシュを格納
		displayData(currentData); // データを表示
		search();

		// オーバーレイを非表示
		reloadOverlay.style.display = 'none';
	} else {
		// キャッシュがない場合はスプレッドシートからデータを取得
		fetch(`${scriptURL}?action=${action}`)
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
				reloadOverlay.style.display = 'none';
			});
	}
}

let currentData = []; // 現在表示されているデータを保持する
let chacheDate = []; // キャッシュデータを保持する
let filteredRows = []; // 絞り込み結果の行番号を格納
let handOver;

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
		deleteButton.classList.add('material-icons', 'single-delete-icons'); // クラスを追加
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
				modalOverlay.style.display = 'block'; // オーバーレイを表示
			}
		});

		// 削除モードがTRUEのときの処理
		function deleteSelect() {
			const currentDataDelete = currentData.includes(rowData);
			if (currentDataDelete) {
				const isChecked = deleteCheckbox.checked;
				listItem.classList.toggle('selected', isChecked); // チェックボックスの状態に応じてクラスをトグル
				const index = rowsToDelete.indexOf(sheetRowIndex);
				if (isChecked && index === -1) {
					rowsToDelete.push(sheetRowIndex); // 行番号を追加
					rowsToDelete.sort((a, b) => a - b); // 昇順に並び替え
				} else if (!isChecked && index > -1) {
					rowsToDelete.splice(index, 1); // 行番号を削除
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

		deleteButton.addEventListener('click', (event) => {
			event.stopPropagation(); // リストアイテムのタッチイベントをトリガーしない
			deleteModalShow();
			doDeleteSingle.style.display = 'block';
			doDeleteAll.style.display = 'none';
			handOver = sheetRowIndex;
		});

		// 削除対象の1行を送信
		doDeleteSingle.addEventListener('click', (event) => {
			event.stopPropagation(); // リストアイテムのタッチイベントをトリガーしない
			if (sheetRowIndex == handOver) {
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
        if (navigator.vibrate) {
            // 100ミリ秒振動する
            navigator.vibrate(100);
        } else {
            console.log("このデバイスは振動に対応していません");
        }
		addIcon.classList.remove('active'); 
		circleCloseIcon.classList.remove('active'); 
		sircleContain.style.display = 'none';
		insertModal.style.display = 'block'; // モーダルを表示
		document.getElementById('insertModal1').focus();
		modalOverlay.style.display = 'block'; // オーバーレイを表示
		document.getElementById('addTitle').textContent = '新規追加';
	});

	// モーダルを閉じる
	document.getElementById('insertCloseButton').addEventListener('click', function() {
		insertModal.style.display = 'none'; // モーダルを非表示
		modalOverlay.style.display = 'none'; // オーバーレイを非表示
		insertForm.reset(); // フォームの内容をクリア
		continuityAddFlg = false;
	});

	// モーダルを閉じる
	document.getElementById('updateCloseButton').addEventListener('click', function() {
		updateModal.style.display = 'none'; // モーダルを非表示
		modalOverlay.style.display = 'none'; // オーバーレイを非表示
	});

	// モーダルの外側（オーバーレイ）をクリックしたときに閉じる
	modalOverlay.addEventListener('click', function() {
		insertModal.style.display = 'none'; // モーダルを非表示
		updateModal.style.display = 'none'; // モーダルを非表示
		insertForm.reset(); // フォームの内容をクリア
		sideMenuClose(); // ヘッダー、フッター、モーダルのオーバーレイ非表示を含む
		gsap.to(deleteModal, { opacity: 0, duration: 0.3, onComplete: () => {
			deleteModal.style.display = 'none'; // モーダルを非表示
		}});
		continuityAddFlg = false;
	});
});

function preventEnterKey(event) {
	if (event.key === 'Enter') {
		event.preventDefault(); // Enterキーのデフォルト動作を防ぐ
		document.activeElement.blur(); // フォーカスを外す
	}
}

document.getElementById('insertModal1').addEventListener('keydown', preventEnterKey);
document.getElementById('updateModal1').addEventListener('keydown', preventEnterKey);

const sircleContain = document.getElementById('sircleContain');
const circleCloseIcon = document.getElementById('circleCloseIcon');
const modalOverlayWhite = document.getElementById('modalOverlayWhite');
const footerOverlay = document.getElementById('footerOverlay'); // フッターオーバーレイを取得
const outer = document.getElementById('outer');
let timer;

// 長押しを検出する関数
const startLongPress = () => {
	timer = setTimeout(() => {
		sircleContain.style.display = 'flex';
		addIcon.classList.add('active'); 
		circleCloseIcon.classList.add('active'); 
		setTimeout(() => {
			outer.classList.add('isOpen');
			addIcon.classList.add('hidden');
			modalOverlayWhite.style.display = 'block';
			footerOverlay.style.display = 'block';
		}, 50);
	}, 300);
};

// タッチイベントの設定
addIcon.addEventListener('touchstart', startLongPress);
addIcon.addEventListener('mousedown', startLongPress);

function circleMenuClose() {
	outer.classList.remove('isOpen');
	addIcon.classList.remove('hidden');
	modalOverlayWhite.style.display = 'none';
	footerOverlay.style.display = 'none';
	addIcon.classList.remove('active'); 
	circleCloseIcon.classList.remove('active'); 
	setTimeout(() => {
		sircleContain.style.display = 'none';
	}, 300);
}

circleCloseIcon.addEventListener('click', circleMenuClose);
modalOverlayWhite.addEventListener('click', circleMenuClose);
footerOverlay.addEventListener('click', circleMenuClose);

// 終了イベントの設定
const clearLongPress = () => {
	clearTimeout(timer);
};

addIcon.addEventListener('touchend', clearLongPress);
addIcon.addEventListener('touchmove', clearLongPress);
addIcon.addEventListener('mouseup', clearLongPress);
addIcon.addEventListener('mouseleave', clearLongPress);

let continuityAddFlg = false;
document.getElementById('continuityAdd').addEventListener('click', function() {
	document.getElementById('addTitle').textContent = '連続追加';
	continuityAddFlg = true;
	circleMenuClose();
	insertModal.style.display = 'block'; // モーダルを表示
	document.getElementById('insertModal1').focus();
	modalOverlay.style.display = 'block'; // オーバーレイを表示
});

// 新規追加フォーム送信
const insertForm = document.forms['insert-form'];

insertForm.addEventListener('submit', function(event) {
	event.preventDefault(); // デフォルトの送信を防ぐ
	
	if (!continuityAddFlg) {
		insertModal.style.display = 'none'; // モーダルを非表示
		modalOverlay.style.display = 'none'; // オーバーレイを非表示
	}

	const insertModal1 = document.getElementById('insertModal1').value;
	const insertModal2 = document.getElementById('insertModal2').value;

	const now = new Date();
	const formattedDate = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

	insertForm.reset(); // フォームの内容をクリア

	const newDate = [false, insertModal1, insertModal2, false, formattedDate, formattedDate];

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
	updateModal.style.display = 'none'; // モーダルを非表示
	modalOverlay.style.display = 'none'; // オーバーレイを非表示

	const sheetRowIndex = parseInt(updateModal.dataset.sheetRowIndex) - 2; // キャッシュデータ内の行番号を取得
	const updateModal1 = document.getElementById('updateModal1').value;
	const updateModal2 = document.getElementById('updateModal2').value;
	const now = new Date();
	const formattedDate = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
	const cachedData = JSON.parse(localStorage.getItem('spreadsheetData'));

	if(!(cachedData[sheetRowIndex][1] == updateModal1 && cachedData[sheetRowIndex][2] == updateModal2)) {
		// キャッシュの更新
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
	}
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
	gsap.to(deleteModal, { opacity: 1, duration: 0.3 });
	modalOverlay.style.display = 'block'; // オーバーレイを表示
}

function deleteModalHidden() {
	gsap.to(deleteModal, { opacity: 0, duration: 0.3, onComplete: () => {
		deleteModal.style.display = 'none'; // モーダルを非表示
	}});
	modalOverlay.style.display = 'none'; // オーバーレイを非表示
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

	// addIcon,circleCloseIcon,outer,chacheClearIconの表示を切り替える
	addIcon.style.display = deleteMode ? 'none' : 'flex'; // 削除モード時は非表示、そうでない場合は表示
	circleCloseIcon.style.display = deleteMode ? 'none' : 'flex'; // 削除モード時は非表示、そうでない場合は表示
	outer.style.display = deleteMode ? 'none' : 'flex'; // 削除モード時は非表示、そうでない場合は表示
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
	header.classList.toggle('header-delete-mode', isVisible);
}

// ヘッダーの文字を切り替える関数
function headerChar(isVisible) {
	const cancelButton = document.getElementById('cancelButton');
	const title = document.querySelector('.center');
	cancelButton.style.display = isVisible ? 'inline' : 'none';
	title.classList.toggle('hidden', !isVisible);
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
	checkFlgFalse = false; // checkFalseは常にfalseに設定
	checkTrue.classList.toggle('searchOptionSelected', checkFlgTrue);
	checkFalse.classList.remove('searchOptionSelected'); // checkFalseのクラスは常に削除
	search();
});

const checkFalse = document.getElementById('checkFalse');
checkFalse.addEventListener('click', function() {
	checkFlgFalse = !checkFlgFalse; // フラグを切り替え
	checkFlgTrue = false; // checkTrueは常にfalseに設定
	checkFalse.classList.toggle('searchOptionSelected', checkFlgFalse);
	checkTrue.classList.remove('searchOptionSelected'); // checkTrueのクラスは常に削除
	search();
});

filterInput.addEventListener('blur', search);

filterInput.addEventListener('keydown', (event) => {
	if (event.key === 'Enter') {
		event.preventDefault(); // デフォルトのフォーム送信を防ぐ
		document.activeElement.blur();
		lastSearchValue = filterInput.value; // 値を保持
		search();
		updateFilterIcon();
		sideMenu.classList.remove('open');
		modalOverlay.style.display = 'none';
	}
});

// ブックマークのクリックイベント
const bookmarkFilter = document.getElementById('bookmarkFilter');
bookmarkFilter.addEventListener('click', function() {
	bookmarkSearchFlg = !bookmarkSearchFlg; // フラグを切り替え
	bookmarkFilter.classList.toggle('searchOptionSelected', bookmarkSearchFlg);
	search();
});

// 検索ボタン押下アクション
document.getElementById('searchButton').addEventListener('click', () => {
	lastSearchValue = filterInput.value; // 値を保持
	search();
	updateFilterIcon();
	sideMenu.classList.remove('open');
	modalOverlay.style.display = 'none';
});

// 絞り込み条件の有無
const filterResetIcon = document.getElementById('filterResetIcon');
function updateFilterIcon() {
	const filterIconText = document.querySelector('#filterIcon span:last-child');
	const isFiltering = checkFlgTrue || checkFlgFalse || bookmarkSearchFlg || filterInput.value !== '';
	filterIconText.textContent = isFiltering ? '絞り込み中' : '絞り込み';
	filterResetIcon.style.display = isFiltering ? 'flex' : 'none';
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
		descIcon.classList.add('actionButtonSelected');
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
let isDropdownVisible = false; // プルダウンの表示状態を管理するフラグ
sortIcon.addEventListener('click', () => {
	isDropdownVisible = !isDropdownVisible; // 状態をトグル
	if (isDropdownVisible) {
		sortDropdown.style.display = 'block'; // プルダウンを表示
		gsap.to(sortDropdown, { opacity: 1, duration: 0.2 });
	} else {
		sortDropdownHidden(); // プルダウンを非表示
	}
});

// プルダウンを非表示
function sortDropdownHidden() {
	isDropdownVisible = false;
	gsap.to(sortDropdown, { opacity: 0, duration: 0.2, onComplete: () => {
		sortDropdown.style.display = 'none'; // プルダウンを非表示
	}});
}

// 並び替えプルダウンをクリックしたときの処理
const sortInsert = document.getElementById('sortInsert');
const sortUpdate = document.getElementById('sortUpdate');
const sortCook = document.getElementById('sortCook');
const sortCheckbox = document.getElementById('sortCheckbox');
const handleSortClick = (mode) => {
	localStorage.setItem('sortMode', mode);
	sortMode = mode;
	sortList(sortMode);
	sortDropdownHidden(); // プルダウンを非表示
};
sortInsert.addEventListener('click', () => handleSortClick('insert'));
sortUpdate.addEventListener('click', () => handleSortClick('update'));
sortCook.addEventListener('click', () => handleSortClick('cook'));
sortCheckbox.addEventListener('click', () => handleSortClick('checkbox'));

// リストをソートする関数
function sortList(order) {
	currentData.sort((a, b) => {
		const aValue = String(a[1]);
		const bValue = String(b[1]);
		const aInsertTimestamp = new Date(a[4]);
		const bInsertTimestamp = new Date(b[4]);
		const aUpdateTimestamp = new Date(a[5]);
		const bUpdateTimestamp = new Date(b[5]);
		const compareTimestamps = (aTimestamp, bTimestamp) => {
			if (!aTimestamp && !bTimestamp) return 0;
			if (!aTimestamp) return 1;
			if (!bTimestamp) return -1;
			return aTimestamp - bTimestamp;
		};
		const compareBoolean = (aBool, bBool) => {
			return (aBool === bBool) ? 0 : (aBool ? -1 : 1);
		};
		// ①追加日時に基づいてソート
		if (order === 'insert') {
			return sort === 'asc' ? compareTimestamps(aInsertTimestamp, bInsertTimestamp) 
									: compareTimestamps(bInsertTimestamp, aInsertTimestamp);
		}
		// ②更新日時に基づいてソート
		if (order === 'update') {
			return sort === 'asc' ? compareTimestamps(aUpdateTimestamp, bUpdateTimestamp) 
									: compareTimestamps(bUpdateTimestamp, aUpdateTimestamp);
		}
		// ③テキストに基づいてソート
		if (order === 'cook') {
			return sort === 'asc' ? aValue.localeCompare(bValue) 
									: bValue.localeCompare(aValue);
		}
		// ④チェックボックスの状態に基づいてソート
		if (order === 'checkbox') {
			return sort === 'asc' ? compareBoolean(a[0], b[0]) 
									: compareBoolean(b[0], a[0]);
		}
	});
	displayData(currentData); // ソートされたcurrentDataをdisplayData関数に渡して表示
	dropdownColor(sortMode); // プルダウンの色を変更
	updateDropdownIcon(); // 並び替えの条件テキストを変更
}

// プルダウンの色を変更
function dropdownColor(order) {
	const sortOptions = {
		insert: sortInsert,
		update: sortUpdate,
		cook: sortCook,
		checkbox: sortCheckbox
	};

	Object.keys(sortOptions).forEach(key => {
		const element = sortOptions[key];
		if (key === order) {
			element.classList.add(`sort-${key === 'insert' ? 'top' : key === 'checkbox' ? 'bottom' : 'center'}`);
		} else {
			element.classList.remove(`sort-${key === 'insert' ? 'top' : key === 'checkbox' ? 'bottom' : 'center'}`);
		}
	});
}

// 並び替え条件のテキスト
function updateDropdownIcon() {
	const sortIconText = document.querySelector('#sortIcon span:last-child'); // <span>要素を取得
	const sortTexts = {
		insert: '追加日時順',
		update: '更新日時順',
		cook: '料理名順',
		checkbox: 'チェック順'
	};

	sortIconText.textContent = sortTexts[sortMode] || ''; // 対応するテキストを設定
}

// ドキュメントの他の部分がクリックされたときにプルダウンを閉じる
document.addEventListener('click', (event) => {
	if (!sortIcon.contains(event.target) && !sortDropdown.contains(event.target)) {
		isDropdownVisible = false;
		sortDropdownHidden(); // プルダウンを非表示
	}
});

let lastScrollTop = 0; // 最後のスクロール位置
window.addEventListener('scroll', function() {
	const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	if (scrollTop > lastScrollTop) {
		// スクロールダウン
		sortDropdownHidden(); // プルダウンを非表示
	} else {
		// スクロールアップ
		sortDropdownHidden(); // プルダウンを非表示
	}
	lastScrollTop = scrollTop; // 現在のスクロール位置を更新
});

// ヘルプページへ遷移
document.getElementById('helpIcon').addEventListener('click', () => {
	window.location.href = 'top.html'; // 遷移先のページ
});

function fetchtemplateData() {
	const chacheTemplateData = localStorage.getItem('templateData');
	const action = 'templateGet';

	if (chacheTemplateData) {
		// キャッシュが存在する場合はそれを使用
		templateData(JSON.parse(chacheTemplateData)); // データを表示
	} else {
		// キャッシュがない場合はスプレッドシートからデータを取得
		fetch(`${scriptURL}?action=${action}`)
			.then(response => {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				return response.json();
			})
			.then(data => {
				// キャッシュにデータを保存
				localStorage.setItem('templateData', JSON.stringify(data));
				templateData(data);
			})
			.catch(error => console.error('Error!', error.message))
	}
}

function templateData(data) {
	const accordion = document.getElementById('accordion');
	accordion.innerHTML = ''; // 既存の内容をクリア

	data.forEach((row) => {
		const li = document.createElement('li'); // リストアイテムを作成
		const linkDiv = document.createElement('div'); // div.link要素を作成
		linkDiv.className = 'link';
		const textNode = document.createElement('span'); // span.text-node要素を作成
		textNode.className = 'text-node';
		textNode.textContent = (row[0] !== undefined && row[0] !== null) ? row[0] : ''; // 0も表示 // 1列目の値を取得（存在しない場合は空文字）
		linkDiv.appendChild(textNode);
		const icon = document.createElement('i'); // i要素を作成
		icon.className = 'material-icons fa-chevron-down';
		icon.textContent = 'expand_more';
		linkDiv.appendChild(icon);
		li.appendChild(linkDiv);
		const submenu = document.createElement('ul'); // ul.submenu要素を作成
		submenu.className = 'submenu';
		const dishName = document.createElement('span'); // span要素（料理名）を作成
		dishName.textContent = '料理名';
		submenu.appendChild(dishName);
		const dishTextarea = document.createElement('textarea'); // textarea要素（料理）を作成
		dishTextarea.name = '料理';
		dishTextarea.className = 'textarea-single';
		dishTextarea.rows = 1;
		dishTextarea.placeholder = '料理';
		dishTextarea.readOnly = true;
		dishTextarea.textContent = (row[1] !== undefined && row[1] !== null) ? row[1] : ''; // 0も表示 // 2列目の値を取得（存在しない場合は空文字）
		submenu.appendChild(dishTextarea);
		const notesLabel = document.createElement('span'); // span要素（備考欄）を作成
		notesLabel.textContent = '備考欄';
		submenu.appendChild(notesLabel);
		const notesTextarea = document.createElement('textarea'); // textarea要素（備考欄）を作成
		notesTextarea.name = '備考欄';
		notesTextarea.rows = 7;
		notesTextarea.placeholder = 'メモ';
		notesTextarea.readOnly = true;
		notesTextarea.textContent = (row[2] !== undefined && row[2] !== null) ? row[2] : ''; // 0も表示 // 3列目の値を取得（存在しない場合は空文字）
		submenu.appendChild(notesTextarea);
		const button = document.createElement('button'); // button要素を作成
		button.id = 'templateButton';
		button.className = 'template-button';
		button.textContent = '選択';
		submenu.appendChild(button);
		li.appendChild(submenu);
		accordion.appendChild(li); // リストに追加

		// リンクにクリックイベントを追加
		linkDiv.addEventListener('click', () => {
			const isOpen = submenu.classList.contains('open');
			const allSubmenus = accordion.getElementsByClassName('submenu');
			// 他のサブメニューを閉じる
			for (let j = 0; j < allSubmenus.length; j++) {
				if (allSubmenus[j] !== submenu) {
					allSubmenus[j].classList.remove('open'); // 非表示
				}
			}
			// サブメニューのアニメーション
			submenu.classList.toggle('open', !isOpen); // アクティブ状態を切り替え

			// 他のリストアイテムからopenクラスを削除し、選択中のアイテムに追加
			const allListItems = accordion.getElementsByTagName('li');
			for (let k = 0; k < allListItems.length; k++) {
				if (allListItems[k] !== li) {
					allListItems[k].classList.remove('open');
				} else {
					allListItems[k].classList.toggle('open', !isOpen); // 選択中のアイテムにopenクラスを追加
				}
			}
		});

		button.addEventListener('click', () => {
			document.getElementById('insertModal1').value = (row[1] !== undefined && row[1] !== null) ? row[1] : '';
			document.getElementById('insertModal2').value = (row[2] !== undefined && row[2] !== null) ? row[2] : '';
			closetemplateSelectMenu();
		});
	});
}