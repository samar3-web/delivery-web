import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { tacheColumns } from "../../datatablesource";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  getDoc,
  deleteDoc,
  updateDoc,
  doc,
  
} from "firebase/firestore";
import { db,sendNotificationsToUser } from "../../firebase";




const Datatable = () => {
  
  const [data, setData] = useState([]);

  useEffect(() => {
      const fetchData = async () => {
        let list = [];
        try {
         
          const querySnapshot = await getDocs(collection(db, "HouseCollection"));
          querySnapshot.forEach((doc) => {
            let authorized= doc.data().authorized;
            !authorized && list.push({ id: doc.id, ...doc.data() });
          });
          setData(list);
        } catch (err) {
          console.log(err);
        }
      }
     fetchData();

    
  }, []);

  const navigate = useNavigate()
 
  const handleAuthorise =  async (email,city,productId) => {
    
  //authorization 
  await updateDoc(doc(db, "HouseCollection", productId), {
    authorized: true
  });


  const message = "Your house from '"+city+"' is now authorized and ready for rent"
  sendNotificationsToUser(email, "House Authorization",message)
    
    navigate(`/products`)
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            
              <div className="viewButton"
                    onClick={() => handleAuthorise(params.row.ownerEmail,params.row.city, params.row.id)} >
                    Done
              </div>
              <div className="viewButton"
                    onClick={() => handleAuthorise(params.row.ownerEmail,params.row.city, params.row.id)} >
                    Modify
              </div>
          </div>
        );
      },
    },
  ];
  return (
    <div className="datatable">
      <div className="datatableTitle">
        Notifications
      
      </div>

      <DataGrid
        className="datagrid"
        rows={data}
        columns={tacheColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
    
        getRowClassName={(params) =>
          params.row.authorized == false ? 'row' : null
        }
       

     />
     
   
    </div>
  );
};

export default Datatable;
