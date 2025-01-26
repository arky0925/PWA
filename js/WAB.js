const card = document.getElementById('card');

let startX;
let currentX = 0;
let isFlicked = false; // フリック状態を追跡するフラグ

card.addEventListener('touchstart', (event) => {
    startX = event.touches[0].clientX;
});

card.addEventListener('touchmove', (event) => {
    const moveX = event.touches[0].clientX - startX;
    currentX = moveX;
    card.style.transform = `translateX(${currentX}px)`;
});

document.addEventListener('touchend', () => {
    if (isFlicked) return; // すでにフリックされている場合は何もしない

    if (currentX > 100) {
        // 右にフリック
        card.style.transform = 'translateX(120%)';
        console.log('右に仕訳けました');
        isFlicked = true; // フリック状態を更新
        setTimeout(() => {
        resetCardState();
    }, 1000);
    } else if (currentX < -100) {
        // 左にフリック
        card.style.transform = 'translateX(-120%)';
        console.log('左に仕訳けました');
        isFlicked = true; // フリック状態を更新
        setTimeout(() => {
        resetCardState();
    }, 1000);
    } else {
        // 元の位置に戻す
        card.style.transform = 'translateX(0)';
    }
    currentX = 0; // リセット
});

// サムアップアイコンのクリックイベント
const thumbUpIcon = document.getElementById('thumb-up-icon');

thumbUpIcon.addEventListener('click', () => {
    if (isFlicked) return; // すでにフリックされている場合は何もしない

    card.style.transform = 'translateX(120%)';
    console.log('右に仕訳けました');
    isFlicked = true; // フリック状態を更新

    setTimeout(() => {
        resetCardState();
    }, 1000);
});

// ハートボタンのクリックイベント
const heartBroken = document.getElementById('heart-broken');

heartBroken.addEventListener('click', () => {
    if (isFlicked) return; // すでにフリックされている場合は何もしない

    card.style.transform = 'translateX(-120%)';
    console.log('左に仕訳けました');
    isFlicked = true; // フリック状態を更新

    setTimeout(() => {
        resetCardState();
    }, 1000);
});

// フリックが完了した後に元の状態に戻す処理を追加
function resetCardState() {
    isFlicked = false; // フリック状態をリセット
    card.style.transform = 'translateX(0)'; // 元の位置に戻す
}