customElements.define(
  "header-el",
  class HeaderComp extends HTMLElement {
    shadow: ShadowRoot = this.attachShadow({ mode: "open" });
    constructor() {
      super();
      this.render();
    }
    render() {
      const text = this.textContent;
      const headerEl = document.createElement("header");
      headerEl.textContent = text;
      headerEl.classList.add("header");
      const style = document.createElement("style");
      style.innerHTML = `
      .header{
          width:100%;
          height:60px;
          background-color:#2BAE44;
      }
      `;
      this.shadow.appendChild(headerEl);
      this.shadow.appendChild(style);
    }
  }
);
