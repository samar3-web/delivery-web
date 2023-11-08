import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { adminColumns, userRows } from "../../datatablesource";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

import { db,auth } from "../../firebase";

const Datatable = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
      const fetchData = async () => {
        let list = [];
        try {
          let i =1
          const querySnapshot = await getDocs(collection(db, "ADMIN"));
          querySnapshot.forEach((doc) => {
            list.push({ id: doc.id,email:doc.id });
          });
          setData(list);
         
        } catch (err) {
        }
      }
     fetchData();

  
  }, []);


 

  const handleDelete = async (id) => {
  
    try {

     if(data.length==1)
       
        throw new Error("You can not delete all admins")
       
       
    
      // supprimer l'utilisateur de la base de données Firestore
      await deleteDoc(doc(db, "ADMIN", id));
      
      setData(data.filter((item) => item.id !== id));
      
    } catch (err) {
      console.log(err);
      setError(err.message)
      setTimeout(()=>{
        setError(null)
      },5000)
    }
    

  }

 

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
           
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row.id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];
  return (
    <div className="datatable">
      <div className="datatableTitle">
        Admins list: {error &&
        <span className="error">{error}</span>}

       
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={adminColumns.concat(actionColumn)}
        pageSize={9}

        rowsPerPageOptions={[9]}
        checkboxSelection
        
     />
     
   
    </div>
  );
};

export default Datatable;
