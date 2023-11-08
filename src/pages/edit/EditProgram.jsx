import "./edit.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import { sendNotificationsToUser, db } from "../../firebase";


const Edit = ({  title }) => {
 

  const [data, setData] = useState({});



    let { programId } = useParams();
    const navigate = useNavigate()
    
    
    useEffect(() => {

        const fetchProductData = async () => {

            const docRef = doc(db, "programsCollection", programId);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {

              setData({ ...docSnap.data() });
              
            } else {
              alert("data not found for this program's id")
              navigate("/programs")
              
            }

          }
      
          fetchProductData();
    }, [programId]);

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
        await updateDoc(doc(db, "programsCollection", programId),data);
        /*
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
            
            const message = "Your Program  is updated now, "+dateFormatted;
            //console.log("owner: "+data.ownerEmail)
            //sendNotificationsToUser(data.ownerEmail,"Updating House from admin",message)
        */
  
        setStatus("Program Editing Successfully");
    
        setTimeout(() => navigate(`/programs`), 3000);
    } catch (err) {
      console.log(err);
      setStatus(err.message);
      setPer(null);
    }
      setTimeout(() => {
        setStatus(null);
      }, 4000);
  };
    setTimeout(()=>
      setStatus(null)
    ,
      4000
    )
 

   const inputs = [
      {
        id: "debut",
        label: "Start Date",
        type: "date",
        value: data.debut,
        placeholder: "Start Date",
      },
      {
        id: "fin",
        label: "End Date",
        type: "date",
        value: data.fin,
        placeholder: "End Date",
      },
      
      {
        id: "description",
        label: "Description",
        type: "text",
        value: data.description,
        placeholder: "Description",
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

        <div style={{display: (status?"flex":"none") }}  className="status bottom">
          <h5>{status}</h5>
        </div>

      </div>
     
    </div>
  );
};

export default Edit;
