import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { auth, db, storage } from "../../firebase";

import { useNavigate } from "react-router-dom";



const New = ({  title }) => {

  const [email, setEmail] = useState("");
  const [status,setStatus] = useState(null)
  const [per,setPer] = useState(null)
  const navigate = useNavigate()
 

  const handleAdd = async (e) => {
    e.preventDefault();
  
    setStatus("Adding ...");
    setPer(50);
  
    try {
      const docRef = doc(db, "USERDATA", email);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        await setDoc(doc(db, "ADMIN", email), {});
  
        setStatus("Admin Added Successfully");
        setTimeout(() => navigate('/admins'), 2000);
      } else {
        setStatus("Email not found in USERDATA");
        
        setPer(null);
      }
    } catch (err) {
      console.log(err);
      setStatus(err.message);
      setPer(null);
    }
    
    status && setTimeout(() => setStatus(null), 4000);
  }
  

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
              

             
                <div className="formInput" >
                  <label>Email</label>
                  <input
                    type="email"
                    value={email}
                    placeholder="flen@domaine.com"
                    onChange={(e)=>setEmail(e.target.value) }
                    required
                  />
                </div>
              
                
              <button className="btn" disabled={per !== null && per < 100} type="submit">
                ADD
              </button>
            </form>
            
          </div>
          
        </div>
        <div style={{display: (status?"flex":"none") }}  className="status bottom"><h5>{status}</h5></div>
      </div>
     
    </div>
  );
};

export default New;
