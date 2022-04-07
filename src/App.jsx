import "bootstrap/dist/css/bootstrap.css";
import { useEffect } from "react";
import { Button } from "reactstrap";
import { io } from "socket.io-client";

const App = () => {
  const connect = () => {
    io("http://localhost:2000");
  };

  useEffect(() => {
    // io("http://localhost:2000");
  }, []);

  return (
    <div>
      <h1>App</h1>
      <Button onClick={connect}>Connect to socket</Button>
    </div>
  );
};

export default App;

