import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc
} from "firebase/firestore";
import { auth, db, storage } from "../../firebase";


import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail, getUserByEmail } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { Upload } from "@mui/icons-material";


const New = ({ inputs, title }) => {

  const initTask={
    id: uuidv4(),
    name: '',
    heureDebutReelle: '',
    heureFinReelle: '',
    duree: 1,
    commentaire: ''
}

  const [per, setPer] = useState(null);

  const [data, setData] = useState({});
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState(initTask);

  const [status, setStatus] = useState(null)
  const navigate = useNavigate()
  
  const handleAddToNewTask = (e) => {
    const name = e.target.name;
    let value = e.target.value;

    // Si la durée est inférieure à 1, la définir à 1
    if (name === "duree" && Number(value) < 1) {
        value = "1";
    }

    setNewTask({ ...newTask, [name]: value });
};



  const handleAddTask = (e) => {
    e.preventDefault();
    setTasks([...tasks, newTask]);
  
    setNewTask(initTask)
   
  };

  const deleteTask = (taskId) => {
    console.log(tasks)
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
  };
  



  const handleAdd = async (e) => {
    e.preventDefault();
    if(tasks.length==0){
     
      setPer(null);
    }

    setStatus("Uploading Data ...");

    setPer(50);

    try {
      if(tasks.length==0) throw new Error("Error: no tasks for this Program")
      let documentUid = uuidv4();

      await setDoc(doc(db, "programsCollection", documentUid), {
        ...data,
        id: documentUid,
        status: "To Do",
      });

      const tasksPromises = tasks.map(task => {
        return setDoc(doc(db, "tasksCollection", task.id), {
          ...task,
          programId: documentUid
        });
      });
      
      await Promise.all(tasksPromises);
      
      setStatus("Program and Tasks Added Successfully");
      setTimeout(() => navigate("/programs"), 3000);

      setTimeout(() => navigate("/programs"), 3000);
    } catch (err) {
      console.log(err);
      setStatus(err.message);
      setPer(null);
    }
      setTimeout(() => {
        setStatus(null);
      }, 4000);
  };





  const handleInput = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    setData({ ...data, [id]: value });
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
                    type={input.type}
                    placeholder={input.placeholder}
                    onChange={handleInput}
                    required
                  />
                </div>
              ))}







              <button className="btn" disabled={per !== null && per < 100} type="submit">
                ADD
              </button>
            </form>

          </div>

        </div>

        <div className="tasks">
          {tasks.map((task) => (
            <div className="task" key={task.id}>
              <div className="task-element">
                <div className="label">Name</div>
                <div > {task.name}</div>
              </div>
              <div className="task-element">
                <div className="label">HeureDebutReelle</div>
                <div > {task.heureDebutReelle}</div>

              </div>
              <div className="task-element">
                <div className="label">HeureFinReelle</div>
                <div > {task.heureFinReelle}</div>
              </div>

              <div className="task-element">
                <div className="label">Durée</div>
                <div > {task.duree}</div>
              </div>
              <div className="task-element">
                <div className="label">Commentaire</div>
                <div>{task.commentaire}</div>
              </div>
              <div><button 
              onClick={()=>deleteTask(task.id)}>-</button></div>
            </div>
          ))}

          <form className="task" onSubmit={handleAddTask}>
            <div className="task-element">
              <div className="label">Name</div>
              <input type="text" 
              name="name" 
              value={newTask.name}
              onChange={(e)=>handleAddToNewTask(e)}
               required/>
            </div>
            <div className="task-element">
              <div className="label">HeureDebutReelle</div>
              <input 
                type="datetime-local" 
                name="heureDebutReelle" 
                value={newTask.heureDebutReelle}
                onChange={(e)=>handleAddToNewTask(e)}
                 required
              />
            </div>
            <div className="task-element">
              <div className="label">HeureFinReelle</div>
              <input type="datetime-local"
              name="heureFinReelle"
              value={newTask.heureFinReelle}
              onChange={(e)=>handleAddToNewTask(e)}
               required />
            </div>

            <div className="task-element">
              <div className="label">Durée</div>
              <input type="number"
                value={newTask.duree} 
                name="duree"
                onChange={(e)=>handleAddToNewTask(e)}
                required
                />
            </div>
            <div className="task-element">
              <div className="label">Commentaire</div>
              <input 
              type="text"
                value={newTask.commentaire} 
                name="commentaire"
                onChange={(e)=>handleAddToNewTask(e)}
                />

            </div>
            <div><button type="submit">+</button></div>

          </form>
          <div style={{ display: (status ? "flex" : "none") }} className="status bottom"><h5>{status}</h5></div>
        </div>

      </div>
    </div>
  );
};

export default New;
