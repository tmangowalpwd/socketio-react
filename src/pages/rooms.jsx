import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Container, Label, Table } from "reactstrap";
import ReactSelect from "react-select";
import { io } from "socket.io-client";
import { Link } from "react-router-dom";

const socketConnection = io("http://localhost:2000");

const RoomsPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const [rooms, setRooms] = useState([]);

  const [selectedLoggedInUser, setSelectedLoggedInUser] = useState({});

  const fetchUsers = async () => {
    try {
      const resUsers = await axios.get("http://localhost:2000/users");

      setUsers(resUsers.data.result);
    } catch (err) {
      console.log(err);
    }
  };

  const usersReactSelectOptions = () => {
    return users.map((val) => {
      return {
        label: val.username,
        value: val.id,
      };
    });
  };

  const fetchRooms = async () => {
    try {
      const roomRes = await axios.get("http://localhost:2000/chat/rooms");

      setRooms(roomRes.data.result);
    } catch (err) {
      console.log(err);
    }
  };

  const createRoomHandler = async () => {
    try {
      await axios.post("http://localhost:2000/chat/rooms", {
        userIds: selectedUsers.map((val) => val.value),
      });

      fetchRooms();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRooms();

    socketConnection.on("NEW_ROOM_CREATED", (data) => {
      setRooms(data);
    });

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  return (
    <Container className="py-5">
      <div className="row">
        <div className="col-6">
          <h2>Create Chat Room</h2>
          <Label>Users</Label>
          <ReactSelect
            onChange={(values) => setSelectedUsers(values)}
            isMulti
            options={usersReactSelectOptions()}
          />
          <Button className="mt-3" onClick={createRoomHandler}>
            Create Room
          </Button>

          <h2 className="mt-5">Available Rooms</h2>
          <Table>
            <thead>
              <tr>
                <td>Room Name</td>
                <td>Participants</td>
                <td>Action</td>
              </tr>
            </thead>
            <tbody>
              {rooms.map((val) => {
                return (
                  <tr>
                    <td>{val.room_name}</td>
                    <td>
                      {val?.Users?.map((user) => user.username).join(", ")}
                    </td>
                    <td>
                      <Link to={`/chat-room/${val.id}`}>
                        <Button color="light">Join Chat Room</Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
        <div className="col-6">
          <h2>
            Logged in as:{" "}
            {JSON.parse(localStorage.getItem("user"))?.username || "no one"}
          </h2>

          <Label>Users</Label>
          <ReactSelect
            options={usersReactSelectOptions()}
            onChange={({ label, value }) =>
              setSelectedLoggedInUser({ id: value, username: label })
            }
          />

          <Button
            onClick={() =>
              localStorage.setItem("user", JSON.stringify(selectedLoggedInUser))
            }
            className="mt-3"
          >
            Login
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default RoomsPage;

