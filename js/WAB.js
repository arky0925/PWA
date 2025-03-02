const scriptURL = 'https://script.google.com/macros/s/AKfycbz7JzJzNzkAhkidXWHrjjP5k298GJjJJVNN6xrMEOLQNyd-LxnzyA4AUrByTM58EdXu/exec';

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

			// イベントをループして表示
			dayEvents.forEach(({ display, style }) => {
				const eventDiv = document.createElement('div');
				eventDiv.classList.add('event', style); // スタイルを追加
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

		// イベントがある場合、表示
		if (dayEvents.length > 0) {
			dayEvents.forEach(({ id, display, style }) => {
				const eventDiv = document.createElement('div');
				eventDiv.classList.add('event-main', style); // スタイルを追加
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
		const deleteButton = document.getElementById('deleteButton');
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

deleteDo.addEventListener('click',  () => {
	const action = 'deleteCalendar';
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
			action: action, id: id
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

document.querySelectorAll('.text-node').forEach(textarea => {
	textarea.style.height = '18px'; // 初期表示時の高さを16pxに設定
    textarea.addEventListener('input', function () {
        // 1行目が入力中の場合は高さを18pxに固定
        if (this.value.split('\n').length === 1) {
            this.style.height = '18px'; // 1行目が入力中のため16pxに設定
        } else {
            this.style.height = 'auto'; // 初期化
            this.style.height = this.scrollHeight + 'px'; // 内容に応じて高さを設定
        }
    });
});

// テンプレート選択メニュー開閉
const templateSelectMenu = document.getElementById('templateSelectMenu');
const templateSelectButton = document.getElementById('templateSelectButton');
document.addEventListener('DOMContentLoaded', () => {
	// メニューを開く
	templateSelectButton.addEventListener('click', () => {
		templateSelectMenu.classList.add('open');
	});

	// メニューを閉じる
	document.getElementById('closetemplateSelectMenu').addEventListener('click', closetemplateSelectMenu);
});

function closetemplateSelectMenu() {
	templateSelectMenu.classList.remove('open');
}

        // 日付選択イベントのリスナー
        document.getElementById('dateInput').addEventListener('change', function() {
            const dateValue = this.value;

            // 日付が選択されているか確認
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
        });
        
        // formattedDateをクリックしたときにdateInputを表示
        document.getElementById('formattedDate').addEventListener('click', function() {
            const dateInput = document.getElementById('dateInput');
            dateInput.focus(); // フォーカスを当てる
        });