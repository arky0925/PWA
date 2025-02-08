// resources in description
const mainTabs = document.querySelector(".main-tabs");
const mainSliderCircle = document.querySelector(".main-slider-circle");
const roundButtons = document.querySelectorAll(".round-button");

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

// ページが読み込まれたときに状態を復元
document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;

  // Local Storageからタブの状態を取得
  const savedColor = localStorage.getItem("activeColor");
  const savedTranslateValue = localStorage.getItem("activeTranslateValue");
  const savedAnimation = localStorage.getItem("animateJello");
  const calc = localStorage.getItem("calc");

  if (savedColor && savedTranslateValue) {
    const savedButton = document.querySelector(`.round-button[data-color="${savedColor}"][data-translate-value="${calc}"]`);
    
    if (savedButton) {
      // ボタンをアクティブにする
      handleActiveTab(roundButtons, { target: savedButton }, "active");
      
      root.style.setProperty("--translate-main-slider", localStorage.getItem("beforePosition"));
      root.style.setProperty("--main-slider-color", localStorage.getItem("beforeColor"));

      setTimeout(() => {
        root.style.setProperty("--translate-main-slider", savedTranslateValue);
        root.style.setProperty("--main-slider-color", getColor(savedColor, 50));
      }, 1); // 1ミリ秒遅延

      root.style.setProperty("--filters-container-height", localStorage.getItem("beforeHeight"));
      root.style.setProperty("--filters-wrapper-opacity", localStorage.getItem("beforeOpasity"));

      // フィルターの高さと不透明度を設定
      setTimeout(() => {
	      if (!savedButton.classList.contains("gallery")) {
	        root.style.setProperty("--filters-container-height", "0");
	        root.style.setProperty("--filters-wrapper-opacity", "0");
	      } else {
	        root.style.setProperty("--filters-container-height", "38px");
	        root.style.setProperty("--filters-wrapper-opacity", "1");
	      }
      }, 1); // 1ミリ秒遅延

      // アニメーションを復元
      if (savedAnimation === "true") {
        mainSliderCircle.classList.add("animate-jello");
      }
    }
  }
});

// メインタブのイベントリスナーを修正
mainTabs.addEventListener("click", (event) => {
	const width = mainTabs.clientWidth;
	const calc = Number(event.target.dataset.translateValue); // 数値に変換
	const targetTranslateValueCalc = 48 * calc + ((width - 240) / 4) * calc;
	const targetTranslateValue = targetTranslateValueCalc + "px";
  const root = document.documentElement;
  const targetColor = event.target.dataset.color;
  //const targetTranslateValue = event.target.dataset.translateValue;
  const currentTranslateValue = getComputedStyle(root).getPropertyValue('--translate-main-slider').trim();
  const currentColor = getComputedStyle(root).getPropertyValue('--main-slider-color').trim();
    localStorage.setItem("beforePosition", currentTranslateValue);
    localStorage.setItem("beforeColor", currentColor);
    localStorage.setItem("calc", calc);

  if (event.target.classList.contains("round-button")) {
    // 状態をLocal Storageに保存
    localStorage.setItem("activeColor", targetColor);
    localStorage.setItem("activeTranslateValue", targetTranslateValue);
    localStorage.setItem("animateJello", "true"); // アニメーションを保存

    // アニメーションのリセット処理
    mainSliderCircle.classList.remove("animate-jello");
    void mainSliderCircle.offsetWidth; // 再描画を強制
    mainSliderCircle.classList.add("animate-jello");

    root.style.setProperty("--translate-main-slider", targetTranslateValue);
    root.style.setProperty("--main-slider-color", getColor(targetColor, 50));

    handleActiveTab(roundButtons, event, "active");

  const currentHeight = getComputedStyle(root).getPropertyValue('--filters-container-height').trim();
  const currentOpacity = getComputedStyle(root).getPropertyValue('--filters-wrapper-opacity').trim();
    localStorage.setItem("beforeHeight", currentHeight);
    localStorage.setItem("beforeOpacity", currentOpacity);

    if (!event.target.classList.contains("gallery")) {
      root.style.setProperty("--filters-container-height", "0");
      root.style.setProperty("--filters-wrapper-opacity", "0");
    } else {
      root.style.setProperty("--filters-container-height", "38px");
      root.style.setProperty("--filters-wrapper-opacity", "1");
    }
  }
});

const filterTabs = document.querySelector(".filter-tabs");
const filterButtons = document.querySelectorAll(".filter-button");

filterTabs.addEventListener("click", (event) => {
  const root = document.documentElement;
  const targetTranslateValue = event.target.dataset.translateValue;

  if (event.target.classList.contains("filter-button")) {
    root.style.setProperty("--translate-filters-slider", targetTranslateValue);
    handleActiveTab(filterButtons, event, "filter-active");
  }
});