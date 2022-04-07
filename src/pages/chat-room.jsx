import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { Button, Container, Input } from "reactstrap";
import { io } from "socket.io-client";

const socketConnection = io("http://localhost:2000");

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);

  const [inputMessage, setInputMessage] = useState("");

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

  const fetchMessages = async () => {
    try {
      const roomId = params.roomId;
      const messageRes = await axios.get(
        `http://localhost:2000/chat/room/${roomId}/messages`
      );

      setMessages(messageRes.data.result);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("user")) {
      joinRoom();
      fetchMessages();

      socketConnection.on("NEW_MESSAGE", (newMessage) => {
        setMessages((oldState) => [...oldState, newMessage]);
      });
    }

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  const sendMessageHandler = async () => {
    try {
      const roomId = params.roomId;
      const userId = JSON.parse(localStorage.getItem("user")).id;

      await axios.post(`http://localhost:2000/chat/message/room/${roomId}`, {
        user_id: userId,
        message: inputMessage,
      });
    } catch (err) {
      console.log(err);
    }
  };

  if (!localStorage.getItem("user")) {
    return <Navigate to="/rooms" />;
  }

  return (
    <Container className="py-5">
      <h2>Chat Room</h2>
      <div className="d-flex">
        <Input
          onChange={(e) => setInputMessage(e.target.value)}
          className="me-5"
        />
        <Button onClick={sendMessageHandler}>Send</Button>
      </div>
      {messages.map((val) => {
        return (
          <div
            className={`d-flex flex-column ${
              val.user_id == JSON.parse(localStorage.getItem("user")).id
                ? "align-items-end"
                : "align-items-start"
            }`}
          >
            <span className="text-muted">{val?.User?.username}</span>
            <span className="fw-bold">{val.message}</span>
          </div>
        );
      })}
    </Container>
  );
};

export default ChatRoom;

