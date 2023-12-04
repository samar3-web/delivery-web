import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db, storage } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { Upload } from "@mui/icons-material";


const New = ({ inputs, title }) => {
  const [file, setFile] = useState(null);
  const [per, setPer] = useState(null);
  const [type, setType]=useState("consumer")
  const [data, setData] = useState({accountType: type,
    profileUrl:"https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
  });
  const [status,setStatus] = useState(null)
  const navigate = useNavigate()
  
  useEffect(()=>{
    
    //file &&uploadFile();
    
  },[file]);

  const uploadFile = async() => {
    const name = new Date().getTime() + file.name;
    const storageRef = ref(storage, "USERS_IMAGES/"+name);
    const uploadTask = uploadBytesResumable(storageRef, file);
     
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload image is " + progress + "% done");
        setStatus("Upload image is " + progress + "% done")
        setPer(progress);
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            break;
        }
      },
      (error) => {
        setStatus("Upload is Image Failed")
        setStatus(error.message)
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setData((prev)=>({prev, profileUrl: downloadURL }))
          
        });
       
      }
    );
  };


  const handleInput = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    setData({ ...data, [id]: value });
  };
 
  
  const handleType = (event) => {
    setType(event.target.value)
    setData({ ...data, accountType: type })
    
  }

  const handleAdd = async (e) => {
    e.preventDefault();

    
    
    setStatus("Uploading Data ...")
    setPer(50);
    try {

      const res = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
    
      await setDoc(doc(db, "USERDATA", res.user.email), {
        ...data,
      });
      file && uploadFile();

      setStatus("User Added Successfully")

      setTimeout(()=>
      
        navigate('/users')
      ,
        2000
      )
      //navigate()
    } catch (err) {
      console.log(err);
      setStatus(err.message)
      setPer(null)
    }
    
    status &&  setTimeout(()=>
      setStatus(null)
    ,
      4000
    )
    
   

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
          <div className="left">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
              onClick={()=> document.getElementById("file").click()}
            />
          </div>
          <div className="right">
            <form onSubmit={handleAdd}>
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div>

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

              
          
              <div className="GroupRadio">
                <h5>Account Type</h5>
                <div className="formRadio" > 
                    <input
                      id="consumer"
                      type="radio"
                      value="consumer"
                      checked={type === 'consumer'}
                      onChange={handleType}
                      
                    />
                    <label htmlFor="consumer">Consumer</label>
                </div>
                <div className="formRadio" > 
                    
                    <input
                      id="owner"
                      type="radio"
                      value="owner"
                      checked={type === 'owner'}
                      onChange={handleType}
                      
                    />
                    <label htmlFor="owner">Owner</label>

                </div>
              </div>

              
                
              <button disabled={per !== null && per < 100} type="submit">
                ADD
              </button>
            </form>
            
          </div>
          
        </div>

        <div style={{display: (status?"flex":"none") }}  className="status-message bottom"><h5>{status}</h5></div>      </div>
     
    </div>
  );
};

export default New;
