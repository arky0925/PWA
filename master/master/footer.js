class MyFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer>
                <button id="homeButton">
                    <span class="material-icons">home</span>
                    <span>ホーム</span>
                </button>
                <button id="couponButton">
                    <span class="material-icons">payment</span>
                    <span>クーポン</span>
                </button>
                <button id="memoryButton">
                    <span class="material-icons">menu_book</span>
                    <span>思い出</span>
                </button>
                <button id="stampButton">
                    <span class="material-icons">local_activity</span>
                    <span>スタンプ</span>
                </button>
                <button id="knowledgeButton">
                    <span class="material-icons">auto_awesome</span>
                    <span>ノウハウ</span>
                </button>
            </footer>
        `;
    }
}

customElements.define('my-footer', MyFooter);
