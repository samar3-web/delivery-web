import "./new.scss";
import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { v4 as uuidv4 } from 'uuid';
import { useParams } from "react-router-dom";
import {
    doc,
    setDoc,
    collection, getDocs
} from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";

const New = ({ inputs, title }) => {

    const { programId } = useParams();
    const [assignedUser, setAssignedUser] = useState(null);
    const [priority, setType] = useState(null); 
    const [per, setPer] = useState(null);
    const [data, setData] = useState({
        id: uuidv4(),
        programId: programId,
        name: '',
        heureDebutReelle: '',
        heureFinReelle: '',
        duree: 1,
        commentaire: '',
        description:'',
        heureDateDebutPrevu:'',
        heureDateFinPrevu:'',
        priority:'haute',
        status:'à faire',
        assignedUser: ''
    });
    const [users, setUsers] = useState([]);
    const [status, setStatus] = useState(null); 

    useEffect(() => {
        const fetchUsers = async () => {
          const usersCollection = collection(db, "USERDATA");
          const usersSnapshot = await getDocs(usersCollection);
          const userList = usersSnapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
          }));
          setUsers(userList);
        };
    
        fetchUsers();
      }, []);
    

    const navigate = useNavigate()

    const handleInput = (e) => {
        const name = e.target.name;
        let value = e.target.value;
        // Si la durée est inférieure à 1, la définir à 1
        if (name === "duree" && Number(value) < 1) {
            value = "1";
        }

        setData({ ...data, [name]: value });
    };

    const handleAdd = async (e) => {
        e.preventDefault();

        console.log(data)
        
        setStatus("Uploading Data ...");

        setPer(50);

        try {
            await setDoc(doc(db, "tasksCollection", data.id), data);
            setStatus("Task Added Successfully");
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
                                        onChange={(e)=>
                                        setData({...data, priority:e.target.value})}
                                        required
                                    >
                                        <option selected value="haute">Haute</option>
                                        <option value="moyenne">Moyenne</option>
                                        <option value="bas">Bas</option>
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
                                    setData({...data,assignedUser:e.target.value})
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
                            <button className="btn" disabled={per !== null && per < 100} type="submit">
                                ADD
                            </button>
                        </form>
                        <div style={{display: (status?"flex":"none") }}  className="status-message bottom"><h5>{status}</h5></div>   
                    </div>
                </div>
            </div>
        </div>
    );
};

export default New;