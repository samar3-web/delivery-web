import "./single.scss";
import { useState,useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";
import List from "../../components/table/Table";

import {
    doc,
    getDoc,
  } from "firebase/firestore";
  import { db } from "../../firebase";


const Single = () => {

    const [data, setData] = useState({});

    let { userId } = useParams(); 
    
    useEffect(() => {


        const fetchUserData = async () => {

            const docRef = doc(db, "USERDATA", userId);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {

              setData({ ...docSnap.data() });
            } else {
              // docSnap.data() will be undefined in this case
             
            }

          }
      
        fetchUserData();
    }, [userId]);

    console.log("userId: " +userId)
    console.log(data)
    

    const navigate = useNavigate()
   

    
    
    

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <div className="editButton"
            onClick={()=>navigate(`/users/edit/${userId}`)
            }
            >Edit</div>
            <h1 className="title">User Information</h1>
            <div className="item">
              <img
                src={data.profileUrl}
                alt=""
                className="itemImg"
              />
              <div className="details">
                <h1 className="itemTitle">{data.name}</h1>
               
                <div className="detailItem">
                  <span className="itemKey">Email:</span>
                  <span className="itemValue">{data.email}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">LastName:</span>
                  <span className="itemValue">{data.lastName}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Phone:</span>
                  <span className="itemValue">{data.phone}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Address:</span>
                  <span className="itemValue">
                  {data.address}
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Password:</span>
                  <span className="itemValue">{data.password}</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
        
      </div>
    </div>
  );
};

export default Single;
