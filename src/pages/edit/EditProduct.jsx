import "./edit.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { sendNotificationsToUser, db, storage } from "../../firebase";

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

const Edit = ({  title }) => {
 

  const [data, setData] = useState({});

  const [files, setFiles] = useState([]);

    let { productId } = useParams();
    const navigate = useNavigate()
    
    
    useEffect(() => {

        const fetchProductData = async () => {

            const docRef = doc(db, "HouseCollection", productId);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {

              setData({ ...docSnap.data() });
              
            } else {
              alert("data not found for this product's id")
              navigate("/products")
              
            }

          }
      
          fetchProductData();
    }, [productId]);

    console.log(data)


  const [per, setPer] = useState(null);
 
  
  const [status,setStatus] = useState(null)
 
  

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


  const handleInput = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    setData({ ...data, [id]: value });
  };
 
  
  const handleType = (event) => {
    const availability= event.target.value == "true" ? true:false;

    setData({ ...data, availability: availability })
    
  }
  const handleAuthorized = (event) => {
    const authorized= event.target.value == "true" ? true:false;

    setData({ ...data, authorized: authorized })
    
  }



  const handleEdit = async (e) => {
    e.preventDefault();
  
    setStatus("Editing ...");
    setPer(50);
  
    try {
        const promises = files.map((file) => uploadFiles(file));
        if(files.length>0 )
          setStatus("Uploading images ...");
        const urls = await Promise.all(promises);

        const images = urls.reduce((obj, url) => {
          obj[url] = true;
          return obj;
        }, {});

        const imagesUrls = Object.keys(images).map(url => url);

      //Edit 
        await updateDoc(doc(db, "HouseCollection", productId), {
          ...data,
          lastModifiedDate:serverTimestamp(),
          images: [...data.images,...imagesUrls],
         
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
        
      
        const message = "Your house from '"+data.city+"' is updated now, "+dateFormatted;
        console.log("owner: "+data.ownerEmail)
        sendNotificationsToUser(data.ownerEmail,"Updating House from admin",message)

  
        setStatus("House Editing Successfully");
    
        //setTimeout(() => navigate(`/products/${productId}`), 3000);
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
  status &&  setTimeout(()=>
      setStatus(null)
    ,
      4000
    )
 
     const inputs = [
      {
        id: "contactPerson",
        label: "ContactPerson",
        type: "text",
        value: data.contactPerson,
        placeholder: "khaled",
      },
      {
        id: "phone",
        label: "Owner Phone",
        value: data.phone,
        type: "number",
        placeholder: "53 076 588",
      },
      {
        id: "price",
        label: "Price",
        value: data.price,
        type: "number",
        placeholder: "500",
      },
      {
        id: "city",
        label: "City",
        value: data.city,
        type: "text",
        placeholder: "Rades",
      },
      {
        id: "location",
        label: "Location",
        value: data.location,
        type: "text",
        placeholder: "rades center",
      },
      {
        id: "size",
        label: "House Size",
        value: data.size,
        type: "text",
        placeholder: "S+2",
      },
      {
        id: "houseNo",
        label: "House Number",
        value: data.houseNo,
        type: "number",
        placeholder: "86",
      },
      {
        id: "street",
        label: "Street",
        value: data.street,
        type: "text",
        placeholder: "Street",
      },
      
      {
        id: "post",
        label: "Post Number",
        value: data.post,
        type: "number",
        placeholder: "8160",
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
          <div className="grid">
          <button className="btn-add"
              onClick={()=> document.getElementById("file").click()}
            >+</button>
            {Array.from(files).map((file,index) => (
        <div key={index} className="imageCell">
          <img  
            src={URL.createObjectURL(file)}
            alt=""
            
          />
         <button className="delete" onClick={()=>{
                const newFiles = [...files];
                newFiles.splice(index, 1);
                setFiles(newFiles);
                    }}/>
        </div>
       
      ))}
        
            {data.images && data.images.map((url,index) => (

                <div key={index} className="imageCell">
                  <img  
                    src={url}
                    alt="image"
                  />
                <button className="delete" onClick={(index)=>{
                const newFiles = [...data.images];
                
                newFiles.splice(index, 1);
                setData({...data ,images:newFiles})
                console.log(data)
                    }}
                    />
                </div>
       
            ))}

            


      </div>
      
          </div>
          <div className="right">
            <form onSubmit={handleEdit}>
             
                <input
                  type="file"
                  id="file"
                  name="files[]" 
                  multiple
                  onChange={(e) => setFiles(prevFiles => Array.from(e.target.files).concat(prevFiles))}
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

                <div className="GroupRadio">
                  <h5>Availability</h5>
                  <div className="formRadio" > 
                      <input
                        id="true"
                        type="radio"
                        value="true"
                        checked={data.availability === true}
                        onChange={handleType}
                        
                      />
                      <label htmlFor="true">true</label>
                  </div>
                  <div className="formRadio" > 
                      
                      <input
                        id="false"
                        type="radio"
                        value="false"
                        checked={data.availability === false}
                        onChange={handleType}
                        
                      />
                      <label htmlFor="false">false</label>

                  </div>
                </div>

                <div className="GroupRadio">
                  <h5>Authorized</h5>
                  <div className="formRadio" > 
                      <input
                        id="yes"
                        type="radio"
                        value="true"
                        checked={data.authorized === true}
                        onChange={handleAuthorized}
                        
                      />
                      <label htmlFor="true">true</label>
                  </div>
                  <div className="formRadio" > 
                      
                      <input
                        id="no"
                        type="radio"
                        value="false"
                        checked={data.authorized === false}
                        onChange={handleAuthorized}
                        
                      />
                      <label htmlFor="no">false</label>

                  </div>
                </div>

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
