import "./edit.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { sendNotificationsToUser, db, storage } from "../../firebase";
import { useNavigate } from "react-router-dom";

const Edit = ({  title }) => {
 

  const [data, setData] = useState({});



    let { taskId,programId } = useParams();
    const navigate = useNavigate()
    
    
    useEffect(() => {

        const fetchProductData = async () => {

            const docRef = doc(db, "tasksCollection", taskId);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {

              setData({ ...docSnap.data() });
              
            } else {
              alert("data not found for this task's id")
              navigate(`/programs/${programId}`)
              
            }

          }
      
          fetchProductData();
    }, [taskId]);

    console.log(data)


  const [per, setPer] = useState(null);
 
  
  const [status,setStatus] = useState(null)
 
  

 


  const handleInput = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    setData({ ...data, [id]: value });
  };



  const handleEdit = async (e) => {
    e.preventDefault();
  
    setStatus("Editing ...");
    setPer(50);
  
    try {

      //Edit 
        await updateDoc(doc(db, "tasksCollection", taskId), {
          ...data,
          //lastModifiedDate:serverTimestamp(),
          
         
        });
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
// Create a document in "InAppNotificationCollection"
const notificationData = {
  id: uuidv4(),
  taskId: data.id,
  taskName: data.name,
  assignedUser: data.assignedUser,
  creationDate: new Date(),
  seen: "false",
  type: "edit",
  // Add other fields as needed
};

await setDoc(doc(db, "InAppNotificationCollection", notificationData.id), notificationData);
       // Send notifications to user tokens
        
      
        const message = "Your task '"+data.name+"' is updated now, "+dateFormatted;

        //sendNotificationsToUser(data.ownerEmail,"Updating House from admin",message)

  
        setStatus("Task Editing Successfully");
 console.log("Task Assigned User: ", data.assignedUser);
console.log('data',data);
 sendNotificationsToUser(data.assignedUser,"Edditing Task by admin",message)
    
        //setTimeout(() => navigate(`/products/${productId}`), 3000);
    } catch (err) {
      console.log(err);
      setStatus(err.message);
      setPer(null);
    }
  
      setTimeout(() => {
        setStatus(null);
      }, 4000);
  };
  status &&  setTimeout(()=>
      setStatus(null)
    ,
      4000
    )
 
    const inputs = [
        {
          id: "name",
          label: "Name",
          type: "text",
          value: data.name,
          placeholder: "Name",
        },
        {
          id: "heureDateDebutPrevu",
          label: "Starting Date & Hour",
          value: data.heureDateDebutPrevu,
          type: "datetime-local",
          placeholder: "Real Start Hour",
        },
        {
          id: "heureDateFinPrevu",
          label: "Ending Date & Hour",
          value: data.heureDateFinPrevu,
          type: "datetime-local",
          placeholder: "Real End Hour",
        },
        {
          id: "duree",
          label: "Duration",
          value: data.duree,
          type: "number",
          placeholder: "Duration",
        },
        {
          id: "description",
          label: "Description",
          value: data.description,
          type: "text",
          placeholder: "Description",
        },
        {
          id: "priority",
          label: "Priority",
          value: data.priority,
          type: "select",
          placeholder: "Priority",
          options: ["haute", "moyenne", "basse"], 
        },

      ];
 

  if(!data){
    return <h2>Reading Data ...</h2>
  }

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form onSubmit={handleEdit}>
                {inputs.map((input) => (
                  <div className="formInput" key={input.id}>
                    <label>{input.label}</label>
                    {input.type === "select" ? (
            <select
              id={input.id}
              value={input.value}
              onChange={handleInput}
              required
            >
              <option value="" disabled>Select Priority</option>
              {input.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
                    <input
                      id={input.id}
                      type={input.type}
                      value={input.value}
                      placeholder={input.placeholder}
                      onChange={handleInput}
                      required
                    />
                    )}
                  </div>
                
                ))}

                <button className="btn" disabled={per !== null && per < 100} type="submit">
                  EDIT
                </button>
            </form>
            
          </div>
          
        </div>

        <div style={{display: (status?"flex":"none") }}  className="status-message bottom">
          <h5>{status}</h5>
        </div>

      </div>
     
    </div>
  );
};

export default Edit;
