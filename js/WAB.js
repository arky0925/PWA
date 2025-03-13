const scriptURL = 'https://script.google.com/macros/s/AKfycbwYNNnTIo05uKaxlXXEWSkDW5cU3VAGZ40DAn0VNLyUJsCO9ESLv96IY_o_j61lqzVv/exec';

const monthYear = document.getElementById('month-year');
const dateContainer = document.getElementById('date-container');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const selectedDateText = document.getElementById('selected-date-text'); // 日付表示用
const selectedDateWeekday = document.getElementById('selected-date-weekday'); // 曜日表示用
const dayWeek = document.getElementById('dayWeek');

let currentDate = new Date(); // 現在の日付を取得
let selectedDay = currentDate.getDate(); // 選択中の日付を保持
let selectedMonth = currentDate.getMonth(); // 選択中の月を保持
let selectedYear = currentDate.getFullYear(); // 選択中の年を保持
let selectedDateDiv = null; // 選択中の日付の要素を保持

window.onload = function() {
	fetchCalendarData();
};

function fetchCalendarData() {
	const chacheCalendarData = localStorage.getItem('calendarData');
	const action = 'calendarGet';

	const arrayNone = [];
	renderCalendar(arrayNone); // ロード中画面

	if (chacheCalendarData) {
		// キャッシュが存在する場合
		const events = chacheCalendarData ? JSON.parse(chacheCalendarData) : [];
		renderCalendar(fixDates(events)); // 初回カレンダーを描画
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
				localStorage.setItem('calendarData', JSON.stringify(data));
				const events = localStorage.getItem('calendarData') ? JSON.parse(localStorage.getItem('calendarData')) : [];
				renderCalendar(fixDates(events)); // 初回カレンダーを描画
				console.log(fixDates(events))
			})
			.catch(error => console.error('Error!', error.message))
	}
}

function fixDates(data) {
	return data.map(item => {
		const date = new Date(item.date);
		// 日本のタイムゾーン（UTC+9）に変換
		const localDate = new Date(date.getTime() + (9 * 60 * 60 * 1000));

		// 修正後の日付をISO形式でフォーマット
		const formattedDate = localDate.toISOString().split('T')[0]; // "YYYY-MM-DD"形式

		return {
			...item,
			date: formattedDate // 修正した日付を設定
		};
	});
}

function renderCalendar(events) {
	dateContainer.innerHTML = '';
	const year = currentDate.getFullYear();
	const month = currentDate.getMonth();

	monthYear.innerText = `${year}年 ${month + 1}月`;

	const firstDay = new Date(year, month, 1).getDay();
	const daysInMonth = new Date(year, month + 1, 0).getDate();

	// 前月の日付を表示
	const prevMonthDays = new Date(year, month, 0).getDate();
	for (let i = prevMonthDays - firstDay + 1; i <= prevMonthDays; i++) {
		const dateDiv = document.createElement('div');
		dateDiv.classList.add('date');

		const dateWrapper = document.createElement('div');
		dateWrapper.classList.add('date-wrapper', 'faded'); // 薄い文字を追加
		dateWrapper.innerText = i; // 日付を追加

		dateDiv.appendChild(dateWrapper); // 日付を新しい div に追加
		dateContainer.appendChild(dateDiv);

		// 土日を判定
		const dayOfWeek = new Date(year, month - 1, i).getDay();
		if (dayOfWeek === 0 || dayOfWeek === 6) {
			dateDiv.classList.add('weekend'); // 土日スタイルを追加
		}
	}

	// 今月の日付を表示
	for (let day = 1; day <= daysInMonth; day++) {
		const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
		const dateDiv = document.createElement('div');
		dateDiv.classList.add('date');

		const dateWrapper = document.createElement('div');
		dateWrapper.classList.add('date-wrapper'); // スタイルを適用するためのクラスを追加
		dateWrapper.innerText = day; // 日付を追加

		dateDiv.appendChild(dateWrapper); // 日付を新しい div に追加
		dateContainer.appendChild(dateDiv);

		// 土日を判定してクラスを追加
		const dayOfWeek = new Date(year, month, day).getDay();
		if (dayOfWeek === 0 || dayOfWeek === 6) {
			dateDiv.classList.add('weekend');
			dateWrapper.classList.add('saturday');
		}

		// 祝日かどうかをチェック
		if (holidays.includes(dateString)) {
			dateDiv.classList.add('weekend');
			dateWrapper.classList.add('sunday');
		}

		// 日曜日のスタイルを追加
		if (dayOfWeek === 0) {
			dateWrapper.classList.add('sunday');
		}

		// 今日の日付に丸い矩形を追加
		if (day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
			dateDiv.classList.add('today'); // 今日の日付にクラスを追加

			// 丸い矩形を作成
			const circleDiv = document.createElement('div');
			circleDiv.classList.add('circle'); // 丸のクラスを追加

			if (dateWrapper.classList.contains('sunday')) {
				circleDiv.style.backgroundColor = '#d10000';
			}

			// 本日の日付を追加
			circleDiv.innerText = day; // 日付を丸の中に設定
			dateDiv.appendChild(circleDiv); // 日付の要素に追加
		}

		// イベントがあるかどうかをチェック
		const dayEvents = events.filter(event => event.date === dateString);
		if (dayEvents.length > 0) {
			const eventListDiv = document.createElement('div'); // イベントリストを作成
			eventListDiv.classList.add('event-list'); // イベントリスト用のクラスを追加

			// ソート順を定義
			const sortOrder = ['breakfast', 'lunch', 'dinner', 'tea-time'];
			// dayEventsをカスタムソート
			dayEvents.sort((a, b) => {
				return sortOrder.indexOf(a.style) - sortOrder.indexOf(b.style);
			});

			// イベントをループして表示
			dayEvents.forEach(({ display, style, takeout }) => {
				const eventDiv = document.createElement('div');
				if (takeout === true) {
					eventDiv.classList.add('event', 'takeout'); // スタイルを追加
				} else {
					eventDiv.classList.add('event', style); // スタイルを追加
				}
				eventDiv.innerText = display; // イベントの内容を表示
				eventListDiv.appendChild(eventDiv); // イベントリストに追加
			});

			dateDiv.appendChild(eventListDiv); // 日付の div にイベントリストを追加
		}

		dateDiv.addEventListener('click', () => {
			// 以前の選択を解除
			if (selectedDateDiv) {
				selectedDateDiv.style.backgroundColor = ''; // 背景色を元に戻す
			}

			// 選択した日付を保持
			selectedDay = day;
			selectedMonth = month; // 選択した月を保持
			selectedYear = year; // 選択した年を保持
			selectedDateDiv = dateDiv; // 選択中の日付の要素を保持

			// 選択した日付を表示
			selectedDateText.innerText = `${selectedDay}`;
			// 曜日を表示
			const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
			const selectedWeekday = new Date(selectedYear, selectedMonth, selectedDay).getDay();
			selectedDateWeekday.innerText = `${weekdays[selectedWeekday]}`;
			if (weekdays[selectedWeekday] === '日' || holidays.includes(dateString)) {
				dayWeek.classList.add('sunday');
			} else if (weekdays[selectedWeekday] === '土') {
				dayWeek.classList.remove('sunday');
				dayWeek.classList.add('saturday');
			} else {
				dayWeek.classList.remove('saturday');
				dayWeek.classList.remove('sunday');
			}

			// その日のイベントを表示
			displayEventsForSelectedDate(dateString);

			// 選択した日付の背景色を薄い灰色に変更
			selectedDateDiv.style.backgroundColor = 'lightgray'; // 選択中の日付の背景色

			// 選択した日付に設定
			dateInput.value = dateString; // 選択した日付をdateInputに設定
			updateFormattedDate(dateString);
			dateInput.setAttribute('data-info', dateString); // data-info を更新
		});

		// 選択中の日付の背景色を維持
		if (day === selectedDay && month === selectedMonth && year === selectedYear) {
			selectedDateDiv = dateDiv; // 選択中の要素を保持
			dateDiv.style.backgroundColor = 'lightgray'; // 選択中の日付の背景色
		}

		dateContainer.appendChild(dateDiv);
	}

	// イベントを表示する関数
	function displayEventsForSelectedDate(dateString) {
		// .main-schedule 内のイベントをクリア
		const mainSchedule = document.getElementById('main-schedule');
		mainSchedule.innerHTML = ''; // 以前のイベントをクリア

		// 選択した日付のイベントをフィルタリング
		const dayEvents = events.filter(event => event.date === dateString);

		// ソート順を定義
		const sortOrder = ['breakfast', 'lunch', 'dinner', 'tea-time'];
		// dayEventsをカスタムソート
		dayEvents.sort((a, b) => {
			return sortOrder.indexOf(a.style) - sortOrder.indexOf(b.style);
		});

		// イベントがある場合、表示
		if (dayEvents.length > 0) {
			dayEvents.forEach(({ id, display, style, takeout }) => {
				const eventDiv = document.createElement('div');
				if (takeout === true) {
					eventDiv.classList.add('event-main', 'takeout'); // スタイルを追加
				} else {
					eventDiv.classList.add('event-main', style); // スタイルを追加
				}
				eventDiv.innerHTML = `<span>${display}</span>`; // イベント名を設定
				// クリックイベントの追加
				eventDiv.addEventListener('click', (event) => {
					event.stopPropagation(); // 親要素のクリックイベントを防ぐ
					showPopup(event, dateString, id, display); // ポップアップを表示
				});
				mainSchedule.appendChild(eventDiv); // .main-schedule に追加
			});
		}
	}

	// ポップアップを表示する関数
	function showPopup(event, dateString, id, display) {
		const popupContainer = document.getElementById('popup-container');
		const popupArrow = document.getElementById('popup-arrow');
		const popupMark = document.getElementById('popup-mark');

		popupContainer.style.display = 'flex'; // プルダウンを表示

		const buttonColor = window.getComputedStyle(event.currentTarget).backgroundColor;
		popupMark.style.backgroundColor = buttonColor; // 背景色を設定

		// 日付をDateオブジェクトに変換
		const date = new Date(dateString);
		const formattedDate = formatDate(date); // 日付をフォーマット

		document.getElementById('event-name').innerHTML = display; // イベント名を設定
		document.getElementById('event-date').innerHTML = formattedDate; // 日付を設定

		const rect = event.currentTarget.getBoundingClientRect(); // イベント項目の位置を取得

		// ポップアップの高さを取得
		const popupHeight = popupContainer.offsetHeight; // ポップアップの高さ
		const arrowHeight = popupArrow.offsetHeight; // ポップアップの高さ

		// 中心位置を計算
		const left = rect.left + 30;
		const top = rect.top - popupHeight - arrowHeight - 4; // 上に矢印の高さと4pxの余白を持たせる

		// ポップアップのスタイルを設定
		popupContainer.style.left = `${left}px`;
		popupContainer.style.top = `${top}px`;

		// フェードインのアニメーションを適用
		gsap.to(popupContainer, { opacity: 1, duration: 0.2 });

		// ドキュメント全体にクリックイベントを追加
		document.addEventListener('click', (event) => {
			// クリック先がポップアップ内でない場合
			if (!popupContainer.contains(event.target) && !modalOverlay.contains(event.target) && ![deleteModal, deleteCancel].includes(event.target)) {
				// フェードアウトのアニメーションを開始
				gsap.to(popupContainer, { opacity: 0, duration: 0.2, onComplete: () => {
					popupContainer.style.display = 'none'; // プルダウンを非表示
				}});
			}
		});

		// idのデータを持たせる
		const editButton = document.getElementById('editButton');
		const deleteButton = document.getElementById('deleteButton');
		editButton.setAttribute('data-info', id); // data-info を更新
		deleteButton.setAttribute('data-info', id); // data-info を更新
	}

	function formatDate(date) {
		const year = date.getFullYear(); // 年を取得
		const month = date.getMonth() + 1; // 月を取得（0から始まるため+1）
		const day = date.getDate(); // 日を取得
		const options = { weekday: 'short' }; // 曜日のオプション
		const weekDay = new Intl.DateTimeFormat('ja-JP', options).format(date); // 曜日を取得

		return `${year}年${month}月${day}日(${weekDay})`; // フォーマットを整える
	}

	// 次月の日付を表示
	let firstDayAndMonth = firstDay + daysInMonth
	let nextDaysToShow = 42 - firstDayAndMonth; // 42は6週分
	if (nextDaysToShow >= 7) {
		nextDaysToShow = nextDaysToShow - 7;
	}
	for (let i = 1; i <= nextDaysToShow; i++) {
		const dateDiv = document.createElement('div');
		dateDiv.classList.add('date');

		const dateWrapper = document.createElement('div');
		dateWrapper.classList.add('date-wrapper', 'faded'); // 薄い文字を追加
		dateWrapper.innerText = i; // 日付を追加

		dateDiv.appendChild(dateWrapper); // 日付を新しい div に追加
		dateContainer.appendChild(dateDiv);

		// 土日を判定
		const dayOfWeek = new Date(year, month + 1, i).getDay();
		if (dayOfWeek === 0 || dayOfWeek === 6) {
			dateDiv.classList.add('weekend'); // 土日スタイルを追加
		}
	}

	// 前月の月の日数＋今月の日数が5週間以内を算出
	if (firstDayAndMonth <= 35) {
		const dateDivs = document.querySelectorAll('.date');
		dateDivs.forEach(div => {
			div.style.height = '90px'; // 高さを設定
		});
	}

	// 初期表示を現在の日に設定
	selectedDateText.innerText = `${selectedDay}`; // 選択中の日付を表示
	const initialWeekday = new Date(selectedYear, selectedMonth, selectedDay).getDay();
	const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
	selectedDateWeekday.innerText = `${weekdays[initialWeekday]}`; // 選択中の曜日を表示
	if (weekdays[initialWeekday] === '土') {
		dayWeek.classList.add('saturday');
	} else if (weekdays[initialWeekday] === '日') {
		dayWeek.classList.add('sunday');
	}
	// 初期表示時に現在の日付のイベントを表示
	const initialDateString = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
	displayEventsForSelectedDate(initialDateString);

	// 現在の日付に設定
	dateInput.value = initialDateString; // dateInputに選択した日付を設定
	updateFormattedDate(initialDateString);
	dateInput.setAttribute('data-info', initialDateString);
}

// ボタンのイベントリスナー
prevButton.addEventListener('click', () => {
	changeMonth(-1); // 1カ月前に遷移
	fetchCalendarData();
	monthSelect.value = currentDate.getMonth(); // 現在の月に設定
	yearSelect.value = currentDate.getFullYear(); // 現在の年に設定
});

nextButton.addEventListener('click', () => {
	changeMonth(1); // 1カ月後に遷移
	fetchCalendarData();
	monthSelect.value = currentDate.getMonth(); // 現在の月に設定
	yearSelect.value = currentDate.getFullYear(); // 現在の年に設定
});

function changeMonth(delta) {
	const newMonth = currentDate.getMonth() + delta; // 新しい月を計算
	const newYear = currentDate.getFullYear() + Math.floor(newMonth / 12); // 年を調整
	const adjustedMonth = (newMonth + 12) % 12; // 0-11の範囲に調整

	// 年の調整
	if (newMonth < 0) {
		currentDate.setFullYear(currentDate.getFullYear() - 1); // 前の年に移動
		currentDate.setMonth(11); // 12月に設定
	} else if (newMonth > 11) {
		currentDate.setFullYear(currentDate.getFullYear() + 1); // 次の年に移動
		currentDate.setMonth(0); // 1月に設定
	} else {
		currentDate.setMonth(adjustedMonth);
	}

	// 新しい月の最終日を取得
	const lastDayOfNewMonth = new Date(newYear, adjustedMonth + 1, 0).getDate();

	// 現在の日付を保持し、変更する
	if (currentDate.getDate() > lastDayOfNewMonth) {
		currentDate.setDate(lastDayOfNewMonth); // 最終日に設定
	}

	// 月を設定
	currentDate.setMonth(adjustedMonth); // 月を変更
}

let startX; // タッチ開始位置
let endX; // タッチ終了位置

// タッチ開始イベント
dateContainer.addEventListener('touchstart', (event) => {
	startX = event.touches[0].clientX; // タッチ開始位置を取得
});

// タッチ終了イベント
dateContainer.addEventListener('touchend', (event) => {
	endX = event.changedTouches[0].clientX; // タッチ終了位置を取得
	handleSwipe(); // スワイプを処理
});

// スワイプを処理する関数
function handleSwipe() {
	if (startX > endX + 50) {
		changeMonth(1); // 1カ月後に遷移
		fetchCalendarData();
		monthSelect.value = currentDate.getMonth(); // 現在の月に設定
		yearSelect.value = currentDate.getFullYear(); // 現在の年に設定
	} else if (startX < endX - 50) {
		changeMonth(-1); // 1カ月前に遷移
		fetchCalendarData();
		monthSelect.value = currentDate.getMonth(); // 現在の月に設定
		yearSelect.value = currentDate.getFullYear(); // 現在の年に設定
	}
}

document.getElementById('today').addEventListener('click', () => {
	const today = new Date();
	currentDate.setFullYear(today.getFullYear());
	currentDate.setMonth(today.getMonth());
	// 今日の日付を選択中の日付として設定
	selectedDay = today.getDate();
	selectedMonth = today.getMonth();
	selectedYear = today.getFullYear();
	fetchCalendarData();
	monthSelect.value = today.getMonth(); // 現在の月に設定
	yearSelect.value = today.getFullYear(); // 現在の年に設定
});

const monthSelect = document.getElementById('month-select');
const yearSelect = document.getElementById('year-select');
const dropdowns = document.getElementById('dropdowns');

// 月の選択肢を生成
for (let month = 0; month < 12; month++) {
	const option = document.createElement('option');
	option.value = month;
	option.innerText = `${month + 1}月`;
	monthSelect.appendChild(option);
}

// 年の選択肢を生成
const currentYear = currentDate.getFullYear();
for (let i = currentYear - 10; i <= currentYear + 10; i++) {
	const option = document.createElement('option');
	option.value = i;
	option.innerText = `${i}年`;
	yearSelect.appendChild(option);
}

// 初期表示の設定
monthSelect.value = currentDate.getMonth(); // 現在の月を選択
yearSelect.value = currentYear; // 現在の年を選択
monthYear.innerText = `${currentYear}年 ${currentDate.getMonth() + 1}月`; // 初期表示

// 年月をクリックしたときにドロップダウンを表示
monthYear.addEventListener('click', () => {
	dropdowns.classList.toggle('show'); // スライドアニメーションをトグル
});

// ドロップダウンで選択されたときに年月を更新
monthSelect.addEventListener('change', () => {
	const selectedMonth = parseInt(monthSelect.value, 10);
	const selectedYear = yearSelect.value;
	monthYear.innerText = `${selectedYear}年 ${selectedMonth + 1}月`;
	updateCalendar(selectedYear, selectedMonth);
	dropdowns.classList.remove('show');
});

yearSelect.addEventListener('change', () => {
	const selectedMonth = parseInt(monthSelect.value, 10);
	const selectedYear = yearSelect.value;
	monthYear.innerText = `${selectedYear}年 ${selectedMonth + 1}月`;
	updateCalendar(selectedYear, selectedMonth);
});

// ドロップダウン以外をクリックしたときに非表示にする
document.addEventListener('click', (event) => {
	if (!monthYear.contains(event.target) && !monthSelect.contains(event.target) && !yearSelect.contains(event.target)) {
		dropdowns.classList.remove('show'); // スライドアニメーションをトグル
	}
});

// カレンダーを更新する関数
function updateCalendar(selectedYear, selectedMonth) {
	currentDate.setFullYear(selectedYear);
	currentDate.setMonth(selectedMonth);
	fetchCalendarData();
}

const deleteButton = document.getElementById('deleteButton');
const deleteModal = document.getElementById('deleteModal');
const modalOverlay = document.getElementById('modalOverlay');
const deleteDo = document.getElementById('deleteDo');
const deleteCancel = document.getElementById('deleteCancel');

deleteButton.addEventListener('click', deleteModalShow);
deleteDo.addEventListener('click', deleteModalClose);
deleteCancel.addEventListener('click', deleteModalClose);
modalOverlay.addEventListener('click', deleteModalClose);

function deleteModalShow() {
	deleteModal.style.display = 'flex'; // モーダルを表示
	timer = setTimeout(() => {
		deleteModal.classList.add('open');
	}, 1);
	modalOverlay.style.display = 'block'; // オーバーレイを表示
	gsap.to(modalOverlay, { opacity: 1, duration: 0.3 });
}

function deleteModalClose() {
	deleteModal.classList.remove('open');
	timer = setTimeout(() => {
		deleteModal.style.display = 'none'; // モーダルを表示
	}, 300);
	gsap.to(modalOverlay, { opacity: 0, duration: 0.3, onComplete: () => {
		modalOverlay.style.display = 'none'; // オーバーレイを表示
	}});
}

deleteDo.addEventListener('click', () => {
	const id = deleteButton.getAttribute('data-info');
	let events = localStorage.getItem('calendarData') ? JSON.parse(localStorage.getItem('calendarData')) : [];

	// 対象の行を削除
	events = events.filter(event => event.id != id); // ID が一致しない行だけを残す
	localStorage.setItem('calendarData', JSON.stringify(events)); // 更新されたデータを localStorage に保存

	renderCalendar(fixDates(events));

	fetch(scriptURL, {
		method: 'POST', // POSTメソッドを指定
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams({
			action: 'deleteCalendar', id: id
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
	});
});

// フォームメニュー開閉
const formMenu = document.getElementById('formMenu');
const add = document.getElementById('add');
const editButton = document.getElementById('editButton');
const editModal = document.getElementById('editModal');
const editDelete = document.getElementById('editDelete');
const editCancel = document.getElementById('editCancel');
const headerCenter = document.getElementById('headerCenter');
const addSubmit = document.getElementById('addSubmit');
const editSubmit = document.getElementById('editSubmit');
document.addEventListener('DOMContentLoaded', () => {
	const initialTextareas = document.querySelectorAll('.text-node');
	const formattedDate = document.getElementById('formattedDate');
	const date = document.getElementById('dateInput');
	// メニューを開く
	add.addEventListener('click', () => {
		// 初期値に戻す
		const textareas = document.querySelectorAll('.text-node');
		textareas.forEach(textarea => {
			textarea.value = '';
		});
		formattedDate.value = updateFormattedDate(dateInput.getAttribute('data-info'));
		date.value = dateInput.getAttribute('data-info');
		clearDynamicElements();
		checkbox.checked = false;
		radioButtons[2].checked = true; // ラジオボタンの初期値

		formStyle("add", null, null);
	});

	// メニューを開く
	editButton.addEventListener('click', () => {
		const id = editButton.getAttribute('data-info');
		let events = localStorage.getItem('calendarData') ? JSON.parse(localStorage.getItem('calendarData')) : [];
		events = fixDates(events);
		const eventIndex = events.findIndex(event => event.id === parseInt(id, 10));

		const display = document.getElementById('display');
		const radioButtons = document.querySelectorAll('input[name="meal"]');
		const staple = document.getElementById('staple');
		const main = document.getElementById('main');
		const side = document.getElementById('side');
		const soup = document.getElementById('soup');
		const snack = document.getElementById('snack');
		const drink = document.getElementById('drink');
		const dessert = document.getElementById('dessert');
		const otherMeal = document.getElementById('otherMeal');
		const otherSnack = document.getElementById('otherSnack');
		const memo = document.getElementById('memo');
		const checkbox = document.getElementById('takeoutCheckbox');
		const stapleItem = document.getElementById('stapleItem');
		const mainItem = document.getElementById('mainItem');
		const sideItem = document.getElementById('sideItem');
		const soupItem = document.getElementById('soupItem');
		const snackItem = document.getElementById('snackItem');
		const drinkItem = document.getElementById('drinkItem');
		const dessertItem = document.getElementById('dessertItem');
		const otherMealItem = document.getElementById('otherMealItem');
		const otherSnackItem = document.getElementById('otherSnackItem');

		// 既存の動的要素をクリア
		clearDynamicElements();

		// 既存の値を設定
		display.value = events[eventIndex].display;
		formattedDate.value = updateFormattedDate(events[eventIndex].date);
		date.value = events[eventIndex].date;

		// ラジオボタンの設定
		radioButtons.forEach(radio => {
			if (radio.value === events[eventIndex].style) {
				radio.checked = true;
			}
		});

		// 配列の要素を取得
		const stapleArray = events[eventIndex].staple;
		const mainArray = events[eventIndex].main;
		const sideArray = events[eventIndex].side;
		const soupArray = events[eventIndex].soup;
		const snackArray = events[eventIndex].snack;
		const drinkArray = events[eventIndex].drink;
		const dessertArray = events[eventIndex].dessert;
		const otherArray = events[eventIndex].other;

		// stapleの値を設定
		if (stapleArray.length > 0) {
			staple.value = stapleArray[0]; // 最初の要素を設定
			stapleArray.slice(1).forEach(item => createTextArea(stapleItem, item, 'staple')); // 2つ目以降を追加
		}

		// mainの値を設定
		if (mainArray.length > 0) {
			main.value = mainArray[0];
			mainArray.slice(1).forEach(item => createTextArea(mainItem, item, 'main'));
		}

		// sideの値を設定
		if (sideArray.length > 0) {
			side.value = sideArray[0];
			sideArray.slice(1).forEach(item => createTextArea(sideItem, item, 'side'));
		}

		// soupの値を設定
		if (soupArray.length > 0) {
			soup.value = soupArray[0];
			soupArray.slice(1).forEach(item => createTextArea(soupItem, item, 'soup'));
		}

		// snackの値を設定
		if (snackArray.length > 0) {
			snack.value = snackArray[0];
			snackArray.slice(1).forEach(item => createTextArea(snackItem, item, 'snack'));
		}

		// drinkの値を設定
		if (drinkArray.length > 0) {
			drink.value = drinkArray[0];
			drinkArray.slice(1).forEach(item => createTextArea(drinkItem, item, 'drink'));
		}

		// dessertの値を設定
		if (dessertArray.length > 0) {
			dessert.value = dessertArray[0];
			dessertArray.slice(1).forEach(item => createTextArea(dessertItem, item, 'dessert'));
		}

		// その他の値を設定
		if (otherArray.length > 0) {
			if (events[eventIndex].style === 'tea-time') {
				otherSnack.value = otherArray[0];
				otherArray.slice(1).forEach(item => createTextArea(otherSnackItem, item, 'otherSnack'));
			} else {
				otherMeal.value = otherArray[0];
				otherArray.slice(1).forEach(item => createTextArea(otherMealItem, item, 'otherMeal'));
			}
		}

		memo.value = events[eventIndex].memo || '';
		checkbox.checked = events[eventIndex].takeout;

		formStyle("edit", events, eventIndex);
	});

	// テキストエリアを作成する関数
	function createTextArea(container, value, dataType) {
		const separator = document.createElement('div');
		separator.className = 'separator'; // 仕切りのクラスを追加

		const itemContainer = document.createElement('div');
		itemContainer.className = 'item-container'; // アイテムコンテナのクラスを追加
		itemContainer.setAttribute('data-type', dataType); // データタイプを設定

		const newTextarea = document.createElement('textarea');
		newTextarea.className = 'text-node'; // クラスを追加
		newTextarea.rows = '1'; // 行の数
		newTextarea.value = value; // 初期値を設定

		// プレースホルダーを設定（必要に応じて）
		newTextarea.placeholder = placeholders[dataType] || '追加のテキスト';

		const removeButton = document.createElement('span');
		removeButton.className = 'material-icons remove-button'; // クラスを追加
		removeButton.textContent = 'remove_circle_outline'; // ボタンテキスト

		removeButton.addEventListener('click', function() {
			container.removeChild(itemContainer); // アイテムコンテナを削除
			container.removeChild(separator); // 仕切りを削除
		});

		itemContainer.appendChild(newTextarea);
		itemContainer.appendChild(removeButton);
		container.appendChild(separator);
		container.appendChild(itemContainer);

		addTextareaEventListeners(newTextarea); // 新しいテキストエリアにイベントリスナーを追加
	}

	function formStyle(option, events, eventIndex) {
		updateRadioBackground(); // ラジオボタンの背景色を更新
		isChanged = false;
		if (option === "add") {
			setColor(radioButtons[2].value); // 色丸の初期値
			headerCenter.style.display = 'none';
			addSubmit.style.display = 'flex'; // 保存ボタンを表示
			editSubmit.style.display = 'none'; // 完了ボタンを非表示
		} else if (option === "edit") {
			setColor(events[eventIndex].style); // 選択されたイベントのスタイルを設定
			headerCenter.style.display = 'flex';
			addSubmit.style.display = 'none'; // 保存ボタンを非表示
			editSubmit.style.display = 'flex'; // 完了ボタンを表示
		}

		// 初期のテキストエリアにもイベントリスナーを追加
		initialTextareas.forEach(textarea => {
			addTextareaEventListeners(textarea);
		});

		formMenu.classList.add('open'); // フォームメニューを開く
		updateVisibility(); // 項目の表示切替
		toggleButtons(); // ボタンの状態を更新
	}

	// メニューを閉じる
	document.getElementById('closeFormMenu').addEventListener('click', function() {
		if (isChanged) {
			editModalShow();
		} else {
			closeFormMenu();
		}
	});

	editDelete.addEventListener('click', editModalClose);
	editDelete.addEventListener('click', closeFormMenu);
	editCancel.addEventListener('click', editModalClose);
	modalOverlay.addEventListener('click', editModalClose);
});

// 変更があったかどうかのフラグ
let isChanged = false;

// 変更があった場合の処理
function handleChange() {
	isChanged = true; // 変更があったことをフラグで示す
}

// 動的要素をクリアする関数
function clearDynamicElements() {
	// item-container クラスを持つ要素をすべて取得
	const itemContainers = document.querySelectorAll('.item-container');
	itemContainers.forEach(itemContainer => {
		itemContainer.parentNode.removeChild(itemContainer); // 各要素を削除
	});

	// separator クラスを持つ要素をすべて取得
	const separators = document.querySelectorAll('.separator');
	separators.forEach(separator => {
		separator.parentNode.removeChild(separator); // 各要素を削除
	});
}

function closeFormMenu() {
	formMenu.classList.remove('open');
}

function editModalShow() {
	editModal.style.display = 'flex'; // モーダルを表示
	timer = setTimeout(() => {
		editModal.classList.add('open');
	}, 1);
	modalOverlay.style.display = 'block'; // オーバーレイを表示
	gsap.to(modalOverlay, { opacity: 1, duration: 0.2 });
}

function editModalClose() {
	editModal.classList.remove('open');
	timer = setTimeout(() => {
		editModal.style.display = 'none'; // モーダルを表示
	}, 200);
	gsap.to(modalOverlay, { opacity: 0, duration: 0.2, onComplete: () => {
		modalOverlay.style.display = 'none'; // オーバーレイを表示
	}});
}

addSubmit.addEventListener('click', function() {
	formOperation('add');
	closeFormMenu();
});

editSubmit.addEventListener('click', function() {
	formOperation('edit');
	closeFormMenu();
});

function formOperation(option) {
	const id = editButton.getAttribute('data-info');
	const display = document.getElementById('display').value;
	const date = document.getElementById('dateInput').value;
	const style = document.querySelector('input[name="meal"]:checked').value;
	const takeout = document.getElementById('takeoutCheckbox').checked;
	const memo = document.getElementById('memo').value;

	// 各項目に対する追加されたテキストエリアの値を収集
	const dataTypes = ['staple', 'main', 'side', 'soup', 'snack', 'drink', 'dessert', 'otherMeal', 'otherSnack'];
	const additionalValues = {};

	dataTypes.forEach(type => {
		const additionalItems = Array.from(document.querySelectorAll(`.item-container[data-type="${type}"] textarea`))
			.map(textarea => textarea.value)
			.filter(value => value);
		// 基本値と追加値を結合
		const basicValue = document.getElementById(type).value; // ここで基本値を取得
		additionalValues[type] = [basicValue, ...additionalItems].filter(Boolean).join(', ');
	});

	const data = {
		display,
		date,
		style,
		takeout,
		...additionalValues, // 各項目の値を追加
		memo,
	};

	// 既存のデータを取得
	let calendarData = localStorage.getItem('calendarData');

	// もしデータが存在しない場合は空の配列を作成
	if (!calendarData) {
		calendarData = [];
	} else {
		// データがある場合は JSON をパースして配列に変換
		calendarData = JSON.parse(calendarData);
	}

	// 新しいデータを追加するためのオブジェクトを作成
	const newEntry = {
		id: calendarData.length > 0 ? calendarData[calendarData.length - 1].id + 1 : 1, // 最後のIDに+1
		date: data.date,
		style: data.style,
		display: data.display,
		staple: data.staple ? data.staple.split(',').map(item => item.trim()) : [], // 空でない場合のみ分割
		main: data.main ? data.main.split(',').map(item => item.trim()) : [], // 空でない場合のみ分割
		side: data.side ? data.side.split(',').map(item => item.trim()) : [], // 空でない場合のみ分割
		soup: data.soup ? data.soup.split(',').map(item => item.trim()) : [], // 空でない場合のみ分割
		snack: data.snack ? data.snack.split(',').map(item => item.trim()) : [], // 空でない場合のみ分割
		drink: data.drink ? data.drink.split(',').map(item => item.trim()) : [], // 空でない場合のみ分割
		dessert: data.dessert ? data.dessert.split(',').map(item => item.trim()) : [], // 空でない場合のみ分割
		other: data.style === "tea-time"
			? (data.otherSnack ? data.otherSnack.split(',').map(item => item.trim()) : []) // tea-time の場合
			: (data.otherMeal ? data.otherMeal.split(',').map(item => item.trim()) : []), // それ以外の場合
		memo: data.memo,
		takeout: data.takeout
	};

	let action;

	if (option === "add") {
		action = 'addCalendar';
		calendarData.push(newEntry); // 新しいエントリを既存のデータに追加
		localStorage.setItem('calendarData', JSON.stringify(calendarData)); // 更新されたデータを localStorage に保存
		fetchCalendarData(); // 再描画
	} else if (option === "edit") {
		action = 'editCalendar';
		newEntry.id = parseInt(id, 10);
		const recordIndex = calendarData.findIndex(index => index.id == newEntry.id); // localStrage内の対象のインデックスを特定
		calendarData[recordIndex] = newEntry; // 新しいデータでレコードを一括更新
		localStorage.setItem('calendarData', JSON.stringify(calendarData)); // 更新されたデータを localStorage に保存
		fetchCalendarData(); // 再描画
	}

	fetch(scriptURL, {
		method: 'POST',
		body: new URLSearchParams({
			action: action,
			...newEntry // newEntryのプロパティを展開
		})
	})
	.then(response => {
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
	return response.json();
	})
	.then(data => {
		console.log(data); // 結果を処理する
	})
	.catch(error => {
		console.error('Error:', error);
	})
}

function toggleButtons() {
	const display = document.getElementById("display");
	if (display.value.trim() === "") {
		addSubmit.classList.add("disabled");
		editSubmit.classList.add("disabled");
	} else {
		addSubmit.classList.remove("disabled");
		editSubmit.classList.remove("disabled");
	}
}

const dateInput = document.getElementById('dateInput');
// 日付選択イベントのリスナー
dateInput.addEventListener('change', function() {
	updateFormattedDate(this.value); // 直接関数を呼び出す
	handleChange();
});

// フォーマットを更新する関数
function updateFormattedDate(dateValue) {
	if (dateValue) {
		const date = new Date(dateValue);

		// フォーマットを作成
		const year = date.getFullYear();
		const month = date.getMonth() + 1; // 月は0から始まるため +1
		const day = date.getDate();
		const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
		const shortWeekday = weekdays[date.getDay()]; // 短い曜日

		const formattedDate = `${year}年${month}月${day}日(${shortWeekday})`;

		// フォーマットされた日付を表示
		document.getElementById('formattedDate').textContent = formattedDate;
	}
}

// formattedDateをクリックしたときにdateInputを表示
document.getElementById('formattedDate').addEventListener('click', function() {
	dateInput.focus(); // フォーカスを当てる
});

const radioButtons = document.querySelectorAll('input[name="meal"]');
const colorCircle = document.getElementById('colorCircle');
const checkbox = document.getElementById('takeoutCheckbox');

// ラジオボタンの変更イベント
radioButtons.forEach(radio => {
	radio.addEventListener('change', function() {
		setColor(this.value);
		updateVisibility();
		updateRadioBackground();
		handleChange();
	});
});

// チェックボックスの変更イベント
checkbox.addEventListener('change', function() {
	setColor(radioButtons[0].checked ? radioButtons[0].value : radioButtons[1].checked ? radioButtons[1].value : radioButtons[2].checked ? radioButtons[2].value : radioButtons[3].value);
	updateRadioBackground();
	handleChange();
});

// 色を設定する関数
function setColor(value) {
	colorCircle.className = 'color-circle'; // クラスをリセット
	if (checkbox.checked) {
		colorCircle.classList.add('takeout'); // 一律黄色
	} else {
		switch (value) {
			case 'breakfast':
				colorCircle.classList.add('breakfast');
				break;
			case 'lunch':
				colorCircle.classList.add('lunch');
				break;
			case 'dinner':
				colorCircle.classList.add('dinner');
				break;
			case 'tea-time':
				colorCircle.classList.add('tea-time');
				break;
		}
	}
}

// ラジオボタンでの表示を更新
function updateVisibility() {
	const selectedValue = document.querySelector('input[name="meal"]:checked').value;
	document.querySelectorAll('.meal-item').forEach(item => {
		item.classList.toggle('hidden', selectedValue === 'tea-time');
	});
	document.querySelectorAll('.snack-item').forEach(item => {
		item.classList.toggle('hidden', selectedValue !== 'tea-time');
	});
}

// ラジオボタンの背景色を更新
function updateRadioBackground() {
	radioButtons.forEach(radio => {
		const span = radio.nextElementSibling; // ラジオボタンに対応する<span>
		span.style.backgroundColor = checkbox.checked && radio.checked ? '#f1c40f' : ''; // チェックされている場合は黄色
	});
}

// すべてのアイコンを取得
const icons = document.querySelectorAll('.add-target .material-icons');

// プレースホルダーのマッピング
const placeholders = {
	'staple': '主食',
	'main': '主菜',
	'side': '副菜',
	'soup': '汁物',
	'snack': 'おやつ',
	'drink': '飲み物',
	'dessert': 'デザート',
	'otherMeal': 'その他',
	'otherSnack': 'その他',
};

icons.forEach(icon => {
	// 各アイコンにクリックイベントリスナーを追加
	icon.addEventListener('click', function() {
		const itemDiv = this.nextElementSibling; // 次の兄弟要素（div.item）を取得

		// 仕切りを作成
		const separator = document.createElement('div');
		separator.className = 'separator'; // 仕切りのクラスを追加

		// アイテムコンテナを作成
		const itemContainer = document.createElement('div');
		itemContainer.className = 'item-container'; // アイテムコンテナのクラスを追加

		// 新しいテキストエリアを作成
		const newTextarea = document.createElement('textarea');
		const dataType = icon.getAttribute('data-type');
		newTextarea.className = 'text-node'; // クラスを追加
		itemContainer.setAttribute('data-type', dataType); // データタイプを設定
		newTextarea.rows = '1'; // 行の数

		// アイコンのデータタイプに基づいてプレースホルダーを設定
		newTextarea.placeholder = placeholders[dataType] || '追加のテキスト'; // プレースホルダーを設定

		// 削除ボタンを作成
		const removeButton = document.createElement('span');
		removeButton.className = 'material-icons remove-button'; // クラスを追加
		removeButton.textContent = 'remove_circle_outline'; // ボタンテキスト

		// 削除ボタンのクリックイベント
		removeButton.addEventListener('click', function() {
			itemDiv.removeChild(itemContainer); // アイテムコンテナを削除
			itemDiv.removeChild(separator); // 仕切りを削除
		});

		// アイテムコンテナにテキストエリアと削除ボタンを追加
		itemContainer.appendChild(newTextarea);
		itemContainer.appendChild(removeButton);

		// 新しいアイテムコンテナと仕切りをitemのdivに追加
		itemDiv.appendChild(separator);
		itemDiv.appendChild(itemContainer);

		// 新しいテキストエリアにイベントリスナーを追加
		addTextareaEventListeners(newTextarea);
	});
});

// テキストエリアにイベントリスナーを追加する関数
function addTextareaEventListeners(textarea) {
	// 初期高さを設定する関数
	function setTextareaHeight() {
		textarea.style.height = 'auto'; // 高さをリセット
		textarea.style.height = `${textarea.scrollHeight}px`; // 内容に応じて高さを設定
	}

	textarea.addEventListener('input', () => {
		setTextareaHeight(); // 入力時に高さを調整
		toggleButtons();
		handleChange();
	});

	textarea.addEventListener('keydown', (event) => {
		if (event.key === 'Enter') {
			event.preventDefault(); // デフォルトのエンターキー動作を防ぐ
			document.activeElement.blur(); // フォーカスを外す
		}
	});

	// 初期高さを設定
	setTextareaHeight(); // 初期値がある場合にも高さを調整
}