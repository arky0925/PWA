document.addEventListener("DOMContentLoaded", () => {
    const menuIcon = document.getElementById("menu-icon");
    const sideMenu = document.getElementById("side-menu");
    const closeMenu = document.getElementById("close-menu");

    // メニューを開く
    menuIcon.addEventListener("click", () => {
        sideMenu.classList.add("open");
    });

    // メニューを閉じる
    closeMenu.addEventListener("click", () => {
        sideMenu.classList.remove("open");
    });

    // 各ボタンのクリックイベントを設定
    document.getElementById('newsButton').addEventListener('click', () => {
        window.location.href = 'index.html'; // 遷移先のページ
    });

    document.getElementById('couponButton2').addEventListener('click', () => {
        window.location.href = 'WAB.html'; // 遷移先のページ
    });

    document.getElementById('stampButton2').addEventListener('click', () => {
        window.location.href = 'WAD.html'; // 遷移先のページ
    });

    document.getElementById('profileButton').addEventListener('click', () => {
        window.location.href = 'WAF.html'; // 遷移先のページ
    });

    document.getElementById('memoryButton2').addEventListener('click', () => {
        window.location.href = 'WAC.html'; // 遷移先のページ
    });

    document.getElementById('knowledgeButton2').addEventListener('click', () => {
        window.location.href = 'WAE.html'; // 遷移先のページ
    });
});
