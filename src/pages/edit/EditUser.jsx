import "./edit.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db, storage } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { Upload } from "@mui/icons-material";


const Edit = ({  title }) => {
 

  const [data, setData] = useState({});

    let { userId } = useParams();
    const [type, setType]=useState(null) 
    
    useEffect(() => {


        const fetchUserData = async () => {

            const docRef = doc(db, "USERDATA", userId);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {

              setData({ ...docSnap.data() });
              
            } else {
              alert("data not found for this email")
              navigate("/users")
              
             
            }

          }
      
        fetchUserData();
    }, [userId]);




  const [file, setFile] = useState(null);
  const [per, setPer] = useState(null);
 
  
  const [status,setStatus] = useState(null)
  const navigate = useNavigate()
  

  const uploadFile = async(file) => {
    return new Promise((resolve, reject) => {
    const name = new Date().getTime() + file.name;
    const storageRef = ref(storage, "USERS_IMAGES/"+name);
    const uploadTask = uploadBytesResumable(storageRef, file);
     
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        
        setStatus("Upload image is " + progress + "% done")
        setPer(progress);
        switch (snapshot.state) {
          case "paused":
            
            break;
          case "running":
            
            break;
          default:
            break;
        }
      },
      (error) => {
        setStatus("Upload Image is  Failed")
        console.log(error);
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
          
        });
       
      }
    );
    })
  };


  const handleInput = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    setData({ ...data, [id]: value });
  };
 
  

  const handleEdit = async (e) => {
    e.preventDefault();
    setStatus("Editing Data ...")
    setPer(50);
    try {
      
 
    let url = data.profileUrl
      if(file){
        const promise = uploadFile(file);
        url =  await new Promise((resolve) => {
          resolve(promise)
      });
}

   
      await updateDoc(doc(db, "USERDATA", data.email), {
        ...data,
        profileUrl: url
      });
      
      

      setStatus("User Editing Successfully")
      setPer(null)
      
    } catch (err) {
      console.log(err);
      setStatus(err.message)
      setPer(null)
    }
    
    
  }
  status &&  setTimeout(()=>
      setStatus(null)
    ,
      4000
    )
 

  const  inputs = [
    {
      id: "name",
      label: "name",
      type: "text",
      value:data.name,
      placeholder: "Khaled",
    },
    {
      id: "lastName",
      label: "lastName",
      type: "text",
      value:data.lastName,
      placeholder: "Jouablia",
    },
    {
      id: "phone",
      label: "Phone Number",
      type: "number",
      value:data.phone,
      placeholder: "53 076 588",
    },
    {
      id: "password",
      label: "Password",
      type: "text",
      value : data.password
    },
    {
      id: "address",
      label: "Address",
      type: "text",
      value: data.address,
      placeholder: "Elton St. 216 NewYork",
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
          <div className="left">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : data.profileUrl
              }
              alt=""
              onClick={()=> document.getElementById("file").click()}
            />
          </div>
          <div className="right">
            <form onSubmit={handleEdit}>

             
                
                <input
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
             
              
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
        <div style={{display: (status?"flex":"none") }}  className="status bottom"><h5>{status}</h5></div>
      </div>
     
    </div>
  );
};

export default Edit;
