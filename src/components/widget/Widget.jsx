import "./widget.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";

const Widget = ({ type }) => {
  const [amount, setAmount] = useState(null);
  const [diff, setDiff] = useState(null);
  let data;

  switch (type) {
    case "user":
      data = {
        title: "USERS",
        isMoney: false,
        link: "See Users",
        query:"USERDATA",
        icon: (
          <PersonOutlinedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "order":
      data = {
        title: "ORDERS",
        isMoney: false,
        link: "View all orders",
        icon: (
          <ShoppingCartOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(218, 165, 32, 0.2)",
              color: "goldenrod",
            }}
          />
        ),
      };
      break;
    case "earning":
      data = {
        title: "EARNINGS",
        isMoney: true,
        link: "View net earnings",
        icon: (
          <MonetizationOnOutlinedIcon
            className="icon"
            style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
          />
        ),
      };
      break;
    case "product":
      data = {
        title: "PRODUCTS",
        query:"HouseCollection",
        link: "See details",
        icon: (
          <AccountBalanceWalletOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(128, 0, 128, 0.2)",
              color: "purple",
            }}
          />
        ),
      };
      break;
    default:
      break;
  }

  useEffect(() => {
    const fetchData = async () => {
      
      const today = new Date();
      
      const lastMonth = new Date(new Date().setMonth(today.getMonth() - 1));
   
      const prevMonth = new Date(new Date().setMonth(today.getMonth() - 2));

    
      
      const lastMonthQuery= query(
        collection(db, data.query),
        where("addedDate", "<=", today),
        where("addedDate", ">", lastMonth),
      );
      const prevMonthQuery= query(
        collection(db, data.query),
        where("addedDate", "<=", lastMonth),
        where("addedDate", ">", prevMonth),
      );

      const lastMonthData = await getDocs(lastMonthQuery)
      const prevMonthData = await getDocs(prevMonthQuery)


      const all= query(
        collection(db, data.query),
      );

      const allData = await getDocs(all);

      setAmount(allData.docs.length);

      if (prevMonthData.docs.length === 0) {
        if (lastMonthData.docs.length === 0) {
          setDiff(0)
        } else{
          setDiff(100)
        }

      } else {

        setDiff( (((lastMonthData.docs.length - prevMonthData.docs.length) / prevMonthData.docs.length) * 100).toFixed(2)) ;
         
      }
      
      
    };
    fetchData();
  }, []);
  


  const navigate=useNavigate();

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">
          {data.isMoney && "$"} {amount}
        </span>
        
        <span onClick={()=>navigate("/"+ data.title.toLowerCase())} className="link">{data.link}</span>
      </div>
      <div className="right">
        <div className={`percentage ${diff < 0 ? "negative" : "positive"}`}>
          {diff < 0 ? <KeyboardArrowDownIcon/> : <KeyboardArrowUpIcon/> }
          {Math.abs(diff)} %
        </div>
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;
