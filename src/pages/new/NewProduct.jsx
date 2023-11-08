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
import { auth, db, storage} from "../../firebase";


import { createUserWithEmailAndPassword,fetchSignInMethodsForEmail,getUserByEmail } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { Upload } from "@mui/icons-material";


const New = ({ inputs, title }) => {
 
  const [files, setFiles] = useState([]);
  const [per, setPer] = useState(null);
  const [type, setType]=useState(true)
  const [data, setData] = useState(
        {
          authorized: true,
          views:0,
          availability: type,
          images:{}
        }   );
  const [status,setStatus] = useState(null)
  const navigate = useNavigate()

  const uploadFiles = (fileImage) => {
    return new Promise((resolve, reject) => {
      const name = new Date().getTime() + fileImage.name;
      const storageRef = ref(storage, "ImageFolder/" + name);
      const uploadTask = uploadBytesResumable(storageRef, fileImage);
  
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          
          setPer(progress);
          switch (snapshot.state) {
            case "paused":
              //console.log("Upload is paused");
              break;
            case "running":
              //console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          setStatus(error.message);
          console.log(error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };
  
  const handleAdd = async (e) => {
    e.preventDefault();
  
    setStatus("Uploading ...");

    setPer(50);
  
    try {
      const ownerEmail = data.ownerEmail;
      // Vérifier si l'email existe dans Firebase Authentication
      const signInMethods = await fetchSignInMethodsForEmail(auth, ownerEmail);
      if (signInMethods.length === 0) {
        throw new Error("ownerEmail not found");
      }
  
      let documentUid = uuidv4();
      setStatus("Uploading images ...");
      
        const promises = files.map((file) => uploadFiles(file));
        const urls = await Promise.all(promises);

        const images = urls.reduce((obj, url) => {
          obj[url] = true;
          return obj;
        }, {});

const imagesUrls = Object.keys(images).map(url => url);

console.log(images)

setData({
  ...data,
  images: images
});
console.log(data)

await setDoc(doc(db, "HouseCollection", documentUid), {
  ...data,
  images: imagesUrls
});
  
      setStatus("House Added Successfully");
  
      setTimeout(() => navigate("/products"), 3000);
    } catch (err) {
      console.log(err);
      setStatus(err.message);
      setPer(null);
    }
  
    status &&
      setTimeout(() => {
        setStatus(null);
      }, 8000);
  };
  
  
  


  const handleInput = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    setData({ ...data, [id]: value });
  };
 
  
  const handleType = (event) => {
    setType(event.target.value)
    setData({ ...data, availability: type })
    
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
          <div className="left ">
            <img 
              src= "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
      
              alt=""
              onClick={()=> document.getElementById("file").click()}
            />
            <div className="grid">
            
            {Array.from(files).map((file,index) => (
        <div key={index} className="imageCell">
          <img  
            src={file ? URL.createObjectURL(file) : ""}
            alt=""
            
          />
         <button className="delete" onClick={()=>{
                const newFiles = [...files];
                newFiles.splice(index, 1);
                setFiles(newFiles);
                    }}/>
        </div>
       
      ))}
       </div>
          


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
                  name="files[]" 
                  multiple
               
                  onChange={(e) => setFiles(prevFiles => Array.from(e.target.files).concat(prevFiles))}

            
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
                <h5>Availability</h5>
                <div className="formRadio" > 
                    <input
                      id="true"
                      type="radio"
                      value="true"
                      checked={type === true}
                      onChange={handleType}
                      
                    />
                    <label htmlFor="true">true</label>
                </div>
                <div className="formRadio" > 
                    
                    <input
                      id="false"
                      type="radio"
                      value="false"
                      checked={type === false}
                      onChange={handleType}
                      
                    />
                    <label htmlFor="owner">false</label>

                </div>
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
