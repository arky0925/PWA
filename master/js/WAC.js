document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('myModal');
    const closeModal = document.getElementById('closeModal');
    const openModalButton = document.getElementById('openModalButton');

    // モーダルを表示
    openModalButton.addEventListener('click', function() {
        modal.style.display = 'block'; // モーダルを表示
    });

    // モーダルを閉じる
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none'; // モーダルを非表示
    });

    // モーダルの外側をクリックしたときに閉じる
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none'; // モーダルを非表示
        }
    });

    // モーダル内のアクションボタンの機能
    document.getElementById('modalActionButton').addEventListener('click', function() {
        alert('アクションが実行されました！');
        modal.style.display = 'none'; // モーダルを非表示
    });
});
