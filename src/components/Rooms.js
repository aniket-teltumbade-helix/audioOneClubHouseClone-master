import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import style from "../styles/rooms.module.css";
import firebase from "../firebase";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Rooms() {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [roomList, setRoomList] = useState();
  const { currentUser } = useAuth();

  const history = useHistory();

  const handleChange = (e) => {
    setTitle(e.target.value);
  };
  const createRoom = () => {
    const roomRef = firebase.database().ref("rooms");
    if (title) {
      roomRef.push({ title, host: currentUser.email });
    }
    setShowForm(false);
  };

  const deleteRoom = (id) => {
    const roomRef = firebase.database().ref("rooms").child(id);
    roomRef.remove();
  };

  useEffect(() => {
    const roomRef = firebase.database().ref("rooms");
    roomRef.on("value", (snapshot) => {
      const rooms = snapshot.val();
      const roomsList = [];
      console.log(rooms);
      for (let id in rooms) {
        roomsList.push({ ...rooms[id], id: id });
      }
      setRoomList(roomsList);
    });
  }, []);

  return (
    <div className={style.roomsSection}>
      {roomList ? (
        roomList.map((item) => (
          <div
            className={style.roomCard}
            onClick={() => history.push(`/roomdetail/${item.id}`)}
          >
            {item.title}
          </div>
        ))
      ) : (
        <div className="d-flex align-items-center justify-content-center h-100">
          <Spinner animation="border" />
        </div>
      )}
      <button onClick={() => setShowForm(true)}>+ Start a new room</button>
      <div
        className={style.roomForm}
        style={{ marginBottom: showForm ? "0px" : "" }}
      >
        <label htmlFor="">Room name</label>
        <input type="text" onChange={handleChange} value={title} />
        <button onClick={createRoom}>Let's go</button>
      </div>
    </div>
  );
}
