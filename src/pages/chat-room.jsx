import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { Container } from "reactstrap";
import { io } from "socket.io-client";

const socketConnection = io("http://localhost:2000");

const ChatRoom = () => {
  const params = useParams();

  const joinRoom = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem("user")).id;
      const roomId = params.roomId;

      await axios.get(
        `http://localhost:2000/chat/join/${userId}/room/${roomId}`
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("user")) {
      console.log("test");
      joinRoom();
    }
  }, []);

  if (!localStorage.getItem("user")) {
    return <Navigate to="/rooms" />;
  }

  return (
    <Container>
      <h2>Chat Room</h2>
    </Container>
  );
};

export default ChatRoom;

