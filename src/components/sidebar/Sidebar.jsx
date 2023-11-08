import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import UpgradeIcon from '@mui/icons-material/Upgrade';
import StoreIcon from "@mui/icons-material/Store";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SettingsSystemDaydreamOutlinedIcon from "@mui/icons-material/SettingsSystemDaydreamOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { Link } from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext } from "react";


import Logout from "../../pages/logout/logout.jsx"


const Sidebar = () => {

  const { dispatch } = useContext(DarkModeContext);

  return (
    <div className="sidebar">
      <div className="top">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">Admin Space </span>
        </Link>
      </div>

      <div className="center">
        <ul>
          {
            /* 
          <p className="title">MAIN</p>
          <Link to="/" style={{ textDecoration: "none" }}>
          <li >
            <DashboardIcon className="icon" />
            <span>Dashboard</span>
          </li>
          
          </Link>
          */
          }


          <p className="title">LISTS</p>

          <Link to="/users" style={{ textDecoration: "none" }}>
            <li >
              <PersonOutlineIcon className="icon" />
              <span>Users</span>
            </li>
          </Link>
          {
            /*
            <Link to="/products" style={{ textDecoration: "none" }}>
              <li>
                <StoreIcon className="icon" />
                <span>Projects</span>
              </li>
            </Link>
            */
          }
          <Link to="/programs" style={{ textDecoration: "none" }}>
            <li>
              <StoreIcon className="icon" />
              <span>Programs</span>
            </li>
          </Link>


          <p className="title">ADMIN</p>
          <Link to="/admins" style={{ textDecoration: "none" }}>
            <li>
              <SettingsApplicationsIcon className="icon" />
              <span>Settings</span>
            </li>
          </Link>


          <Link to="/admins/new" style={{ textDecoration: "none" }}>
            <li>
              <PersonOutlineIcon className="icon" />
              <span>New</span>
            </li>
          </Link>



          {
            /*
            
          <Link to="/admins/notifications" style={{ textDecoration: "none" }}>
          <li>
            <NotificationsNoneIcon className="icon" />
            <span>Notifications</span>
          </li>
          </Link>
          */
          }


          <p className="title">AUTHENTIFICATIONS</p>

          <li>
            <Logout />
          </li>

        </ul>
      </div>
      <div className="bottom">
        <div
          className="colorOption"
          onClick={() => dispatch({ type: "LIGHT" })}
        ></div>
        <div
          className="colorOption"
          onClick={() => dispatch({ type: "DARK" })}
        ></div>
      </div>
    </div>
  );
};

export default Sidebar;
