import { Router } from "@vaadin/router";
import { state } from "../../state";

class HomePage extends HTMLElement {
  shadow: ShadowRoot = this.attachShadow({ mode: "open" });
  connectedCallback() {
    const currentState = state.getState();
    currentState.messages = [];
    state.setState(currentState);
    this.render();
    const roomInputEl = this.shadow.querySelector(".display__none");
    const selectInputEl = this.shadow.getElementById("input-select") as any;

    selectInputEl.addEventListener("change", (e) => {
      const target = e.target as any;
      if (target.value == "value2") {
        roomInputEl.classList.remove("display__none");
      } else {
        roomInputEl.classList.add("display__none");
      }
    });

    const formEl = this.shadow.querySelector("form");

    //evento que guarda el nombre de usuario
    formEl.addEventListener("submit", (e) => {
      e.preventDefault();
      const target = e.target as any;
      state.setNameAndEmail({
        name: target.nombre.value,
        email: target.email.value,
      });
      state.signIn((err) => {
        if (err) {
          console.error("algo salio mal");
        } else {
          if (selectInputEl.value == "value1") {
            state.createRoom(state.joinRoom);
          } else {
            state.setRoomId(target.room.value);
            state.joinRoom();
          }
        }
      });

      Router.go("/chat");
    });
  }
  render() {
    const div = document.createElement("div");
    div.classList.add("container");

    div.innerHTML = `
  <header-el></header-el>
  <main class = "home-main__container">
  <div class="main__container-title">
  <title-el class="main__title">Bienvenido</title-el>
  </div>
 <form>
 <label class = "label" for="email">
 e-mail
 <input type = "email" class = "input" name="email">
 </label>
 <label class = "label">
 tu nombre
 <input type = "text" class = "input" name="nombre">
 </label>
 <label class = "label">
 room
 <select id = "input-select" name="select" class = "input">
  <option value="value1">Crear</option>
  <option value="value2">Unirse</option>
</select>
 </label>
 <label class = "label display__none"  >
 room id
 <input type = "text" class = "input" name="room">
 </label>
 <button class="button">Comenzar</button>
 </form-el>
  </main>
  `;
    const style = document.createElement("style");
    style.innerHTML = `
    *{
        box-sizing: border-box;
    }
    .display__none{
        display:none;
    }
    .home-main__container {
      margin:0 auto;
      max-width: 400px;
    }
    @media (min-width:960px){
      .home-main__container{
        max-width:900px;
        margin-top:40px;
        display: grid;
        grid-template-columns: 1fr 2fr;
          gap:25px;
      }
  }
    .main__container-title{
     margin: 20px 0px;
    }
    @media (min-width:960px){
      .main__container-title{
        margin: 0;
      }
  }
    .home-main__container,
.chat-main__container {
  padding: 16px 30px;
}

.form{
  margin:0
  max-width:400px;
}
@media (min-width:960px){
  .form{
      display:grid;
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
    font-weight: 500;
    font-size: 24px;
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
    this.shadow.appendChild(div);
  }
}
customElements.define("home-page", HomePage);
