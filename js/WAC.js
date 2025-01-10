document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('myModal');
    const closeModal = document.getElementById('closeModal');
    const addicon = document.getElementById('add-icon');
    const overlay = document.querySelector('.overlay'); // オーバーレイを取得

    // モーダルを表示
    addicon.addEventListener('click', function() {
        modal.style.display = 'block'; // モーダルを表示
        overlay.style.display = 'block'; // オーバーレイを表示
    });

    // モーダルを閉じる
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none'; // モーダルを非表示
        overlay.style.display = 'none'; // オーバーレイを非表示
    });

    // モーダルの外側（オーバーレイ）をクリックしたときに閉じる
    overlay.addEventListener('click', function() {
        modal.style.display = 'none'; // モーダルを非表示
        overlay.style.display = 'none'; // オーバーレイを非表示
    });

    // モーダル内のアクションボタンの機能
    document.getElementById('submit').addEventListener('click', function(event) {
        event.preventDefault(); // フォームのデフォルト送信を防ぐ
        alert('アクションが実行されました！');
        modal.style.display = 'none'; // モーダルを非表示
        overlay.style.display = 'none'; // オーバーレイを非表示
    });
});
