// resources in description
const mainTabs = document.querySelector(".main-tabs");
const mainSliderCircle = document.querySelector(".main-slider-circle");
const roundButtons = document.querySelectorAll(".round-button");
const root = document.documentElement;

const colors = {
	blue: {
		50: {
			value: "#e3f2fd" // 丸の色
		},
		100: {
			value: "#bbdefb" // 背景の色
		}
	},
	green: {
		50: {
			value: "#e8f5e9"
		},
		100: {
			value: "#c8e6c9"
		}
	},
	purple: {
		50: {
			value: "#f3e5f5"
		},
		100: {
			value: "#e1bee7"
		}
	},
	orange: {
		50: {
			value: "#ffe0b2"
		},
		100: {
			value: "#ffe0b2"
		}
	},
	red: {
		50: {
			value: "#ffebee"
		},
		100: {
			value: "#ffcdd2"
		}
	}
};

const getColor = (color, variant) => {
	return colors[color][variant].value;
};

const handleActiveTab = (tabs, event, className) => {
	tabs.forEach((tab) => {
		tab.classList.remove(className);
	});

	if (!event.target.classList.contains(className)) {
		event.target.classList.add(className);
	}
};

const handleActiveTabA = (tabs, target, className) => {
	tabs.forEach((tab) => {
		tab.classList.remove(className);
	});

	let activeTab;
	if (target instanceof Event) {
		activeTab = target.target; // イベントのターゲットを取得
	} else {
		activeTab = target; // IDから要素を取得
	}

	if (activeTab) {
		activeTab.classList.add(className);
	}
};

// ページが読み込まれたときに状態を復元
document.addEventListener("DOMContentLoaded", () => {
	const previousFileName = sessionStorage.getItem('previousFileName');
	if (previousFileName == "WAB.html") {
		root.style.setProperty("--filters-container-height", "38px");
		root.style.setProperty("--filters-wrapper-opacity", "1");
	} else {
		root.style.setProperty("--filters-container-height", "0");
		root.style.setProperty("--filters-wrapper-opacity", "0");
	}
	// フィルターの高さと不透明度を設定
	setTimeout(() => {
		if (fileName == "WAB.html") {
			root.style.setProperty("--filters-container-height", "38px");
			root.style.setProperty("--filters-wrapper-opacity", "1");
		} else {
			root.style.setProperty("--filters-container-height", "38px");
			root.style.setProperty("--filters-wrapper-opacity", "1");
			root.style.setProperty("--filters-container-height", "0");
			root.style.setProperty("--filters-wrapper-opacity", "0");
		}
	}, 1); // 1ミリ秒遅延
});

const fileName = window.location.pathname.split('/').pop(); // 現在のファイル名を取得
// 遷移前のファイル名を保存
window.addEventListener('beforeunload', () => {
	sessionStorage.setItem('previousFileName', fileName); // localStorageに保存
});

const dataSet = (id) => {
	const width = mainTabs.clientWidth;
	const calc = id.getAttribute('data-translate-value');
	const targetTranslateValueCalc = 48 * calc + ((width - 240) / 4) * calc;
	const targetTranslateValue = targetTranslateValueCalc + "px";
	const targetColor = id.getAttribute('data-color');
	root.style.setProperty("--translate-main-slider", targetTranslateValue);
	root.style.setProperty("--main-slider-color", getColor(targetColor, 50));

//	if (id && id.classList.contains("gallery")) {
//		root.style.setProperty("--filters-container-height", "38px");
//		root.style.setProperty("--filters-wrapper-opacity", "1");
//	} else {
//		setTimeout(() => {
//		root.style.setProperty("--filters-container-height", "0");
//		root.style.setProperty("--filters-wrapper-opacity", "0");
//		}, 1);
//	}
	mainSliderCircle.classList.add("animate-jello");
};

// ページが読み込まれたときに状態を復元
document.addEventListener("DOMContentLoaded", () => {
	if (fileName == "top.html") {
		handleActiveTabA(roundButtons, document.getElementById('homeButton'), "active");
		dataSet(document.getElementById('homeButton'));
	} else if (fileName == "WAB.html") {
		handleActiveTabA(roundButtons, document.getElementById('couponButton'), "active");
		dataSet(document.getElementById('couponButton'));
	} else if (fileName == "WAC.html") {
		handleActiveTabA(roundButtons, document.getElementById('memoryButton'), "active");
		dataSet(document.getElementById('memoryButton'));
	} else if (fileName == "WAD.html") {
		handleActiveTabA(roundButtons, document.getElementById('stampButton'), "active");
		dataSet(document.getElementById('stampButton'));
	} else if (fileName == "WAE.html") {
		handleActiveTabA(roundButtons, document.getElementById('knowledgeButton'), "active");
		dataSet(document.getElementById('knowledgeButton'));
	}
});

const filterTabs = document.querySelector(".filter-tabs");
const filterButtons = document.querySelectorAll(".filter-button");
filterTabs.addEventListener("click", (event) => {
	const targetTranslateValue = event.target.dataset.translateValue;

	if (event.target.classList.contains("filter-button")) {
		root.style.setProperty("--translate-filters-slider", targetTranslateValue);
		handleActiveTab(filterButtons, event, "filter-active");
	}
});