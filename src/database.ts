import firebase from "firebase";
const API_BASE_URL = "https://chat-rooms-m6.herokuapp.com";
type Message = {
  roomId: string;
  message: {
    nombre: string;
    text: string;
  };
};
const app = firebase.initializeApp({
  apiKey: process.env.API_KEY_RTDB,
  authDomain: "apx-m6-ba08c.firebaseapp.com",
  databaseURL: "https://apx-m6-ba08c-default-rtdb.firebaseio.com/",
  projectId: "apx-m6-ba08c",
});
const rtdb = firebase.database();

//Hace un post a la api para agregar un nuevo mensaje en la database
function enviarMensaje(message: Message) {
  fetch(API_BASE_URL + "/rooms" + message.roomId, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message.message),
  });
}
export { rtdb, enviarMensaje, API_BASE_URL };
