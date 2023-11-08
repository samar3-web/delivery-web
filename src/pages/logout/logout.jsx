import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";





const Logout=()=>{

  const { dispatch } = useContext(AuthContext);

    const handleLogout=()=>{
      dispatch({type:"LOGOUT"})
    }

  return(
    <div onClick={handleLogout} >
      <ExitToAppIcon className="icon" />
      <span>Logout</span>
    </div>

  )

}
export default Logout;