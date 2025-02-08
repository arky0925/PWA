//----------------------------------------
//  JSの使用範囲
//
//  ページがリロードされる度に
//  15枚のパネルの配置をランダムで並び替えるためにのみ、下記のJSプログラムを実装しています。
//
//  HTMLファイル内の
//  <label class="panelGraphic" for="panelMove-●●"></label>
//  の要素（全15個）に「panelPosition--◯◯」というclass名を付けることで
//  下記のJSがなくても動作しますが、15枚のパネルの初期配置は常に同じになります。
//
//  ※「panelPosition--◯◯」の「◯◯」には1〜15の数値を入れます。
//----------------------------------------

//  パネル要素をすべて取得
const panel = document.getElementsByClassName("panelGraphic");
//  並び替え用の数値を配列化
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
//  配列の中身をシャッフルする関数
function shuffle(arrays) {
    const array = arrays.slice();
    for (let i = array.length - 1; i >= 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }
    return array;
}
//  シャッフル後の数値配列を変数に格納
const shuffle_num = shuffle(numbers);
//  ループ処理で15枚のパネル要素にランダムで配置用の数値を振り分け
for (let i = 0; i < panel.length; i++) {
    panel[i].classList.add("panelPosition--" + shuffle_num[i]);
}
