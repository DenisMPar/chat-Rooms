import { state } from "../../state";

customElements.define(
  "message-el",
  class MessageComp extends HTMLElement {
    shadow: ShadowRoot = this.attachShadow({ mode: "open" });
    text: string;
    label: string;
    nombre: string;
    constructor() {
      super();
      const currentState = state.getState();
      this.nombre = currentState.name;
      this.text = this.getAttribute("text");
      this.label = this.getAttribute("label");
      this.render();
    }
    render() {
      const classMyMessage = "my-message";
      const messageEl = document.createElement("div");
      messageEl.innerHTML = `
      <label class="label">${this.label}</label>
       <div class="container__text">
       <p class ="text">${this.text}</p>
       </div>
      `;
      const containerTextEl = messageEl.querySelector(".container__text");
      if (this.label == this.nombre) {
        containerTextEl.classList.add("my-message");
        messageEl.classList.add("my-message-position");
      }
      messageEl.classList.add("message");
      const style = document.createElement("style");
      style.innerHTML = `
      .text{
        margin:0;
        width: auto;
        height: auto;
        font-family:inherit;
        font-size: 18px;
       
      }
      .container__text{
        max-width:450px;
        padding:10px;
        background-color:#DBDBDB;
        border-radius:4px;
      }
      .label{
        font-size: 12px;
      }
        .message{
          align-self: flex-start;
            padding:10px;
        }
        .my-message-position{
         align-self: flex-end;
        }
        .my-message{
          background-color:#BBE8B5;
        }
        `;
      this.shadow.appendChild(messageEl);
      this.shadow.appendChild(style);
    }
  }
);
