import "./navbar.scss";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext,useEffect,useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase";




const Navbar = () => {
  const { dispatch } = useContext(DarkModeContext);
  const navigate = useNavigate()
  const { currentUser } = useContext(AuthContext);
  const [data, setData] = useState({});
  const [notifications,setNotifications] = useState(0)

 
  
  useEffect(() => {


      const fetchUserData = async () => {

          const docRef = doc(db, "USERDATA", currentUser.email);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {

            setData({ ...docSnap.data() });
          }

        }
    
      

      const fetchData = async () => {
        let list = [];
        try {
         
          const querySnapshot = await getDocs(collection(db, "HouseCollection"));
          querySnapshot.forEach((doc) => {
            let authorized= doc.data().authorized;
            !authorized && list.push({ id: doc.id });
          });
          setNotifications(list.length);
        } catch (err) {
          console.log(err);
        }
      }
      
    fetchUserData();
     fetchData();

    
  }, [currentUser]);

  


  return (
    <div className="navbar">
      <div className="wrapper">
        <div >
         
        </div>
        <div className="items">
          <div className="item">
            
          </div>
          <div className="item">
            <DarkModeOutlinedIcon
              className="icon"
              onClick={() => dispatch({ type: "TOGGLE" })}
            />
          </div>
          <div className="item">
            
          </div>
          {
            /*
          <div className="item">
          <NotificationsNoneOutlinedIcon className="icon" />
            {
            
              notifications > 0 ? (
              <div className="counter" 
                  onClick={()=>navigate("/admins/notifications")}>{notifications}
            </div>
              ):null

            }
            
          </div>
          <div className="item">
            
          </div>

          */
          }
          <div className="item">
         
          </div>
          <div className="item">
            <img
              src={data.profileUrl}
              alt=""
              className="avatar"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
