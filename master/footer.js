class MyFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer>
                <nav class="amazing-tabs">
  <div class="filters-container">
    <div class="filters-wrapper">
      <ul class="filter-tabs">
        <li>
          <button class="filter-button filter-active" data-translate-value="0">
            New
          </button>
        </li>
        <li>
          <button class="filter-button" data-translate-value="100%">
            Popular
          </button>
        </li>
        <li>
          <button class="filter-button" data-translate-value="200%">
            Following
          </button>
        </li>
      </ul>
      <div class="filter-slider" aria-hidden="true">
        <div class="filter-slider-rect">&nbsp;</div>
      </div>
    </div>
  </div>
  <div class="main-tabs-container">
    <div class="main-tabs-wrapper">
      <ul class="main-tabs">
        <li>
          <button id="homeButton" class="round-button material-icons" style="--round-button-active-color: #d50000" data-translate-value="0" data-color="red">
            filter_list_off
          </button>
        </li>
        <li>
          <button id="couponButton" class="round-button material-icons gallery active" style="--round-button-active-color: #2962ff" data-translate-value="100%" data-color="blue">
            filter_list_off
          </button>
        </li>
        <li>
          <button id="memoryButton" class="round-button material-icons" style="--round-button-active-color: #00c853" data-translate-value="200%" data-color="green">
            filter_list_off
          </button>
        </li>
        <li>
          <button id="stampButton" class="round-button material-icons" style="--round-button-active-color: #aa00ff" data-translate-value="300%" data-color="purple">
            update
          </button>
        </li>
        <li>
          <button id="knowledgeButton" class="round-button material-icons" style="--round-button-active-color: #ff6d00" data-translate-value="400%" data-color="orange">
            update
          </button>
        </li>
      </ul>
      <div class="main-slider" aria-hidden="true">
        <div class="main-slider-circle">&nbsp;</div>
      </div>
    </div>
  </div>
</nav>
            </footer>
        `;
    }
}

customElements.define('my-footer', MyFooter);
