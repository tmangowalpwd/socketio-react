import "bootstrap/dist/css/bootstrap.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { io } from "socket.io-client";
import ChatRoom from "./pages/chat-room";
import RoomsPage from "./pages/rooms";

// const socketConnection = io("http://172.16.31.230:2000");

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/chat-room/:roomId" element={<ChatRoom />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

