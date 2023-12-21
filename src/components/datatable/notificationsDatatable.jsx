import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { notificationColumns } from "../../datatablesource";
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

  const fetchData = async () => {
    let list = [];
    try {
     
      const querySnapshot = await getDocs(collection(db, "NotificationCollection"));
      querySnapshot.forEach((doc) => {
        let vued= doc.data().vued;
        !vued && list.push({ id: doc.id, ...doc.data() });
      });
      setData(list);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
      
     fetchData();

    
  }, []);

 
  const handleVued =  async (notificationId) => {
    
  //authorization 
  await updateDoc(doc(db, "NotificationCollection", notificationId), {
    vued: true
  });

    fetchData();
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
                    onClick={() => handleVued(params.row.id)} >
                    Confirmation
              </div>
          </div>
        );
      },
    },
  ];
  return (
    <div className="datatable" style={{ height: 400, width: '100%' }}>
      <div className="datatableTitle">
        Notifications 
      
      </div>
      

      <DataGrid
        className="datagrid"
        rows={data}
        columns={notificationColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
    
        getRowClassName={(params) =>
          params.row.vued == false ? 'row' : null
        }
       

     />
     
   
    </div>
  );
};

export default Datatable;