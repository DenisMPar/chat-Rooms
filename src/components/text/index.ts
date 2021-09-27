customElements.define(
  "title-el",
  class TitleComp extends HTMLElement {
    shadow: ShadowRoot = this.attachShadow({ mode: "open" });
    constructor() {
      super();
      this.render();
    }
    render() {
      const text = this.textContent;
      const titleEl = document.createElement("h1");
      titleEl.textContent = text;
      titleEl.classList.add("title");
      const style = document.createElement("style");
      style.innerHTML = `
        .title{
          width:100%;
            font-family:inherit;
            font-weight: bold;
            font-size: 65px;
            margin:0;
        }
        `;
      this.shadow.appendChild(titleEl);
      this.shadow.appendChild(style);
    }
  }
);
