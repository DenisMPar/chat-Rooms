customElements.define(
  "form-el",
  class Form extends HTMLElement {
    shadow: ShadowRoot;
    label: String = "";
    text: string = "";
    constructor() {
      super();
      this.shadow = this.attachShadow({ mode: "open" });
      this.label = this.getAttribute("label") || "";
      this.text = this.textContent;
      this.render();
    }
    render() {
      const formEl = document.createElement("form");
      formEl.className = "form";
      formEl.innerHTML = `
            <div class = "container-input" >
            <label class = "label">
            ${this.label}
            </label>
            <input type = "text" class = "input" name= "text" autocomplete="off">
            </div>
            <button class="button">${this.text}</button>
            `;
      const style = document.createElement("style");
      style.innerHTML = `
            *{
                box-sizing: border-box
            }
            .form{
              margin:0
              max-width:400px;
            }
            @media (min-width:960px){
              .form{
                  display:grid;
                  grid-template-columns: 3fr 1fr;
                  align-items: end;
                  gap:25px;
              }
          }
            .container-input{
                flex-grow: 1;
            }
            .label{
                margin: 0;
                font-family: inherit;
                font-size: 18px;
            }
            .input{
                font-family: inherit;
                font-size: 20px;
                width:100%;
                height: 55px;
                border: 2px solid #000000;
                border-radius: 4px;
                padding:10px;
            }
            .button{
                color:white;
                margin-top:12px;
                flex-grow: 5;
                font-family: inherit;
                font-weight: 500;
                width:100%;
                height: 55px;
                font-size: 22px;
                background: #2BAE85 ;
                border-radius: 4px;
                border: none;
            }
            `;
      this.shadow.appendChild(style);
      this.shadow.appendChild(formEl);
    }
  }
);
