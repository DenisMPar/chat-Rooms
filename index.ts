import { realTime, firestore } from "./data-base";
import * as express from "express";
import { nanoid } from "nanoid";
import * as cors from "cors";

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());

const usersCollection = firestore.collection("users");
const roomsCollection = firestore.collection("rooms");

//crea un usuario con email y nombre y devuelve el id

app.post("/auth", (req, res) => {
  const { email } = req.body;
  const { name } = req.body;
  usersCollection
    .add({
      email,
      name,
    })
    .then((userRef) => {
      res.json({
        id: userRef.id,
      });
    });
});

//Crea un nuevo room verificando primero que el user id exista
app.post("/rooms", (req, res) => {
  const { userId } = req.body;
  usersCollection
    .doc(userId.toString())
    .get()
    .then((docSnap) => {
      if (docSnap.exists) {
        //si verifica que el user existe, crea el room con un nanoid
        const newRoomRef = realTime.ref("rooms/" + nanoid());
        newRoomRef
          .set({
            messages: [],
            owner: userId,
          })
          .then(() => {
            //uso dos id, uno corto para mostrar en el front
            //y uno largo para hacer referencia al room en la realtimeDb
            //el id corto hace ref a un doc en la database que adentro contiene el id largo
            const roomLongId = newRoomRef.key;
            const roomId = Math.floor(1000 + Math.random() * 999);
            roomsCollection
              .doc(roomId.toString())
              .set({
                realTimeId: roomLongId,
              })
              .then(() => {
                res.json({
                  id: roomId,
                });
              });
          });
      } else {
        res.status(401).json({
          message: "user doesnt exist",
        });
      }
    });
});

//endpoint que sirve para subscribirse a los cambios de un room en la realTimeDb
//debe recibir un user id valido a traves de una query
app.get("/rooms/:id", (req, res) => {
  const { userId } = req.query;
  usersCollection
    .doc(userId.toString())
    .get()
    .then((doc) => {
      if (doc.exists) {
        roomsCollection
          .doc(req.params.id.toString())
          .get()
          .then((snap) => {
            res.json(snap.data());
          });
      } else {
        res.send("usuario no valido");
      }
    });
});

//endpoint que agrega mensajes a un room
app.post("/rooms/:roomId", (req, res) => {
  const { roomId } = req.params;
  roomsCollection
    .doc(roomId)
    .get()
    .then((snap) => {
      const rtdbRoomId = snap.data().realTimeId;
      const room = realTime.ref("rooms/" + rtdbRoomId + "/messages");
      room.push(req.body).then(() => {
        res.json(req.body);
      });
    });
});

app.use(express.static("dist"));
app.get("*", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html");
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
