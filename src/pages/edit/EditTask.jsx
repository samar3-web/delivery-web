import "./edit.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
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

       // Send notifications to user tokens
        
      
        const message = "Your task '"+data.name+"' is updated now, "+dateFormatted;

        //sendNotificationsToUser(data.ownerEmail,"Updating House from admin",message)

  
        setStatus("Task Editing Successfully");
    
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
          id: "heureDebutReelle",
          label: "Real Start Hour",
          value: data.heureDebutReelle,
          type: "datetime-local",
          placeholder: "Real Start Hour",
        },
        {
          id: "heureFinReelle",
          label: "Real End Hour",
          value: data.heureFinReelle,
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
          id: "commentaire",
          label: "Comment",
          value: data.commentaire,
          type: "text",
          placeholder: "Comment",
        }
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
                    <input
                      id={input.id}
                      type={input.type}
                      value={input.value}
                      placeholder={input.placeholder}
                      onChange={handleInput}
                      required
                    />
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
