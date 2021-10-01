import { API_BASE_URL, enviarMensaje, rtdb } from "./database";
import map from "lodash/map";

const state = {
  data: {
    messages: [],
    name: "",
    email: "",
    userId: "",
    roomId: "",
    realTimeId: "",
  },
  listeners: [],
  //sincroniza el state con el session storage
  //y vuelve a conectarse al roomId del state
  init() {
    const sessionState = sessionStorage.getItem("state");
    const sessionStateParsed = JSON.parse(sessionState);
    state.setState(JSON.parse(sessionState));
    state.setNameAndEmail({
      name: sessionStateParsed.name,
      email: sessionStateParsed.email,
    });
    state.signIn((err) => {
      if (err) {
        console.error("algo salio mal");
      } else {
        state.joinRoom();
      }
    });
  },
  getState() {
    return this.data;
  },
  setState(newState) {
    this.data = newState;
    for (const cb of this.listeners) {
      cb();
    }
    sessionStorage.setItem("state", JSON.stringify(newState));
  },
  subscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },

  //guara el roomId
  setRoomId(roomId) {
    const currentState = this.getState();
    currentState.roomId = roomId;
    state.setState(currentState);
  },
  //guarda el nombre y el email del user
  setNameAndEmail(params: { email: string; name: string }) {
    const currentState = this.getState();
    currentState.name = params.name;
    currentState.email = params.email;
    this.setState(currentState);
  },
  //Usa el email para crear un usuario nuevo en la database
  signIn(callback?) {
    const currentState = this.getState();
    if (currentState.email) {
      fetch(API_BASE_URL + "/auth", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: currentState.email,
          name: currentState.name,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          currentState.userId = res.id;
          this.setState(currentState);
          //este callback sirve para ejecutar una funcion luego de que el usuario fue creado
          if (callback) {
            callback();
          }
        });
    } else {
      console.error("no hay un email");
      callback(true);
    }
  },
  //Crea un nuevo room en la database
  createRoom(callback?) {
    const currentState = this.getState();
    if (currentState.userId) {
      fetch(API_BASE_URL + "/rooms", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          userId: currentState.userId,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          currentState.roomId = data.id;
          this.setState(currentState);
          //este callback sirve para ejecutar una funcion luego de que el room fue creado
          if (callback) {
            callback();
          }
        });
    } else {
      console.error("no hay userId");
    }
  },
  //obtiene el id largo de un room de la database
  joinRoom() {
    const currentState = state.getState();
    fetch(
      API_BASE_URL +
        "/rooms/" +
        currentState.roomId +
        "?userId=" +
        currentState.userId
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        currentState.realTimeId = data.realTimeId;
        state.setState(currentState);

        state.listenMessages();
      });
  },
  //Se subscribe a un room y obtiene los datos cuando hay mensajes nuevos
  listenMessages() {
    const currentState = this.getState();
    if (currentState.realTimeId) {
      const chatRoomRef = rtdb.ref(
        "/rooms/" + currentState.realTimeId + "/messages"
      );
      chatRoomRef.on("value", (snap) => {
        if (snap.val()) {
          const serverMessages = snap.val();
          const messagesList = map(serverMessages);
          const currentState = state.getState();
          state.setState({ ...currentState, messages: messagesList });
        }
      });
    } else {
      console.error("no se encontro el room");
    }
  },
  //guarda un nuevo mensaje en la database
  pushMessage(msj) {
    const currentState = this.getState();
    const objMessage = {
      roomId: currentState.roomId,
      message: {
        nombre: currentState.name,
        text: msj,
      },
    };
    enviarMensaje(objMessage);
  },
};
export { state };
