import "./new.scss";
import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "react-router-dom";
import {
  doc,
  setDoc,
  collection,
  getDocs
} from "firebase/firestore";
import { db ,sendNotificationsToUser} from "../../firebase";
import { useNavigate } from "react-router-dom";
import { MapContainer,  TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import LeafletGeocoder from "./LeafletGeocoder";
import LeafletRoutingMachine from "./LeafletRoutingMachine";

import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";


const New = ({ inputs, title }) => {
  const { programId } = useParams();
  const [assignedUser, setAssignedUser] = useState(null);
  const [priority, setType] = useState(null);
  const [per, setPer] = useState(null);
  const [data, setData] = useState({
    id: uuidv4(),
    programId: programId,
    name: "",
    heureDebutReelle: "",
    heureFinReelle: "",
    duree: 1,
    commentaire: "",
    description: "",
    heureDateDebutPrevu: "",
    heureDateFinPrevu: "",
    priority: "haute",
    status: "à faire",
    assignedUser: "",
    latitude: 0,
    longitude: 0
  });
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState(null);
  const [pushPins, setPushPins] = useState([]);
  const position = [36.8065, 10.1815];

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, "USERDATA");
      const usersSnapshot = await getDocs(usersCollection);
      const userList = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name
      }));
      setUsers(userList);
    };

    fetchUsers();
  }, []);

  const navigate = useNavigate();

  const handleInput = (e) => {
    const name = e.target.name;
    let value = e.target.value;
    // Si la durée est inférieure à 1, la définir à 1
    if (name === "duree" && Number(value) < 1) {
      value = "1";
    }
    // Handle latitude and longitude input
    if (name === "latitude" || name === "longitude") {
      value = parseFloat(value); // Convert input to a floating-point number
    }

    setData({ ...data, [name]: value });
  };

  const handleMapClick = (latitude, longitude) => {
    setData({ ...data, latitude, longitude });
  };



  // Function to get FCM tokens for a user
 
  

  const handleAdd = async (e) => {
    e.preventDefault();

    console.log(data);
      

    setStatus("Uploading Data ...");

    setPer(50);

    try {
      await setDoc(doc(db, "tasksCollection", data.id), data);
       // Create a document in "InAppNotificationCollection"
       const notificationData = {
        id: uuidv4(),
        taskId: data.id,
        taskName: data.name,
        assignedUser: data.assignedUser,
        creationDate: new Date(),
        seen: "false",
        type: "add",
        // Add other fields as needed
      };

      await setDoc(doc(db, "InAppNotificationCollection", notificationData.id), notificationData);

      setStatus("Task Added Successfully");
 // Send notifications to user tokens
 const serverTimeStamp = new Date();

 const dateFormatted = serverTimeStamp.toLocaleString('en-US', {
                                                       weekday: 'short',
                                                       day: 'numeric',
                                                       month: 'numeric',
                                                       year: 'numeric',
                                                       hour: 'numeric',
                                                       minute: 'numeric',
                                                     }
);
     
 const message = "Your Task  '"+data.name+"' is added now, "+dateFormatted;
 console.log("Task Assigned User: ", data.assignedUser);
console.log('data',data);
 sendNotificationsToUser(data.assignedUser,"Adding Task from admin",message)
      setTimeout(() => navigate(`/programs/${programId}`), 3000);


    } catch (err) {
      console.log(err);
      setStatus(err.message);
      setPer(null);
    }
    setTimeout(() => {
      setStatus(null);
    }, 4000);
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h3>{title}</h3>
        </div>
        <div className="bottom">
          <div className="right">
            <form onSubmit={handleAdd}>
              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    name={input.id}
                    type={input.type}
                    value={data[input.id]}
                    placeholder={input.placeholder}
                    onChange={handleInput}
                    required
                  />
                </div>
              ))}
              <div className="GroupRadio">
                <h5>Priority</h5>
                <div className="formSelect">
                  <select
                    id="priority"
                    name="priority"
                    value={data.priority}
                    onChange={(e) =>
                      setData({ ...data, priority: e.target.value })
                    }
                    required
                  >
                    <option selected value="haute">
                      Haute
                    </option>
                    <option value="moyenne">Moyenne</option>
                    <option value="basse">Basse</option>
                  </select>
                </div>
              </div>

              <div className="GroupRadio">
                <h5>Assigned User</h5>
                <div className="formSelect">
                  <select
                    id="assignedUser"
                    name="assignedUser"
                    value={data.assignedUser}
                    onChange={(e) =>
                      setData({ ...data, assignedUser: e.target.value })
                    }
                    required
                  >
                    <option value="" disabled>
                      Select User
                    </option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
         <MapContainer center={position} zoom={13} >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
           <LeafletRoutingMachine  onMapClick={handleMapClick} />

      </MapContainer>

              <button
                className="btn"
                disabled={per !== null && per < 100}
                type="submit"
              >
                ADD
              </button>
            </form>
            <div
              style={{ display: status ? "flex" : "none" }}
              className="status-message bottom"
            >
              <h5>{status}</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
let DefaultIcon = L.icon({
  iconUrl: "/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
});
L.Marker.prototype.options.icon = DefaultIcon;
export default New;
