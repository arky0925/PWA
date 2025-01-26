const card = document.getElementById('card');

let startX;
let currentX = 0;

card.addEventListener('touchstart', (event) => {
    startX = event.touches[0].clientX;
});

card.addEventListener('touchmove', (event) => {
    const moveX = event.touches[0].clientX - startX;
    currentX = moveX;
    card.style.transform = `translateX(${currentX}px)`;
});

document.addEventListener('touchend', () => {
    if (currentX > 100) {
        // 右にフリック
        card.style.transform = 'translateX(120%)';
        console.log('右に仕訳けました');
    } else if (currentX < -100) {
        // 左にフリック
        card.style.transform = 'translateX(-120%)';
        console.log('左に仕訳けました');
    } else {
        // 元の位置に戻す
        card.style.transform = 'translateX(0)';
    }
    currentX = 0; // リセット
});

const thumbUpIcon = document.getElementById('thumb-up-icon');

thumbUpIcon.addEventListener('click', () => {
    card.style.transform = 'translateX(120%)';
        console.log('右に仕訳けました');
});

const heartBroken = document.getElementById('heart-broken');

heartBroken.addEventListener('click', () => {
    card.style.transform = 'translateX(-120%)';
        console.log('左に仕訳けました');
});