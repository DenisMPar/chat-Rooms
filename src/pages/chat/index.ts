// import { enviarMensaje } from "../../database";
import { state } from "../../state";

class ChatPage extends HTMLElement {
  shadow: ShadowRoot = this.attachShadow({ mode: "open" });
  messages = [];
  roomId = "";
  connectedCallback() {
    const currentState = state.getState();
    if (!currentState.email) {
      state.init();
    }
    state.subscribe(() => {
      const currentState = state.getState();
      this.messages = currentState.messages;
      this.roomId = currentState.roomId;
      this.agregarMensajesRoomId();
    });
    this.render();
    const container = this.shadow.querySelector(".container");
    const formEl = container.querySelector("form-el");
    const shadowForm = formEl.shadowRoot.querySelector("form");

    //evento que agrega el mensaje al state
    shadowForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const target = e.target as any;
      const messageText = target.text.value;
      state.pushMessage(messageText);
      target.reset();
    });
  }

  //agrega los mensajes al container del chat
  agregarMensajesRoomId() {
    const containerMessages = this.shadow.querySelector(
      ".chat__container-messages"
    );
    containerMessages.innerHTML = `
      ${this.messages
        .map((m) => {
          return `<message-el text="${m.text}" label="${m.nombre}" class="message-el"></message-el>`;
        })
        .join("")}
     `;
    //coloca el scroll al final del chat
    containerMessages.scrollTop = containerMessages.scrollHeight;
    const containerId = this.shadow.querySelector(".main__id-container");
    containerId.textContent = "room id: " + this.roomId;
  }
  render() {
    const div = document.createElement("div");
    div.className = "container";
    div.innerHTML = `
    <header-el></header-el>
    <main class = "chat-main__container">
     <div class="main__container-title">
       <title-el>Chat</title-el>
       <span class="main__id-container"></span>
     </div>
     <div class="chat__container-messages">
     </div>
       <form-el>Enviar</form-el>
    </main>
        `;
    const style = document.createElement("style");
    style.innerHTML = `
    .chat-main__container{
      margin:0 auto;
     padding:10px;
      max-width:400px;
      display:flex;
      flex-direction:column;
        height: calc(100vh - 60px);
    }
    @media (min-width:960px){
      .chat-main__container{
          max-width:900px;
      }
  }
    .main__container-title{
      margin:20px 0px;
      text-align:center;
    }
        .chat__container-messages{
          background-color:#F8F7F7;
          margin-bottom:25px;
          height: 50vh;
          display:flex;
          flex-direction:column;
          overflow-y: auto;
        }
        @media (min-width:960px){
          .chat__container-messages{
            height: 58vh;
            margin-bottom:18px;
          }
      }
        .message-el{
          display:flex;
          flex-direction:column;
        }
        `;
    this.shadow.appendChild(div);
    this.shadow.appendChild(style);
  }
}
customElements.define("chat-page", ChatPage);
