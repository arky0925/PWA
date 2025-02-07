$(document).ready(function() {
    // 初期コンテンツを読み込む
    loadPage('WAD.html');

    // メニューリンクをクリックしたとき
    $('nav a').click(function(e) {
        e.preventDefault(); // デフォルトのリンク動作を防ぐ
        var page = $(this).attr('href'); // リンク先のページを取得
        loadPage(page); // ページを読み込む
    });

    // フッターボタンをクリックしたとき
    $('#footer-button').click(function(e) {
        e.preventDefault(); // デフォルトのボタン動作を防ぐ
        loadPage('WAE.html'); // ページ2に遷移する例
    });

    // ページを読み込む関数
    function loadPage(page) {
        $('#content').fadeOut(200, function() {
            $('#content').load(page + ' #content > *', function() {
                $('#content').fadeIn(200);
            });
        });
    }
});
