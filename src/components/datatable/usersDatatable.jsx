import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns, userRows } from "../../datatablesource";
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
import { deleteUser } from "firebase/auth";



const Datatable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
      const fetchData = async () => {
        let list = [];
        try {
          let i =1
          const querySnapshot = await getDocs(collection(db, "USERDATA"));
          querySnapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() });
          });
          setData(list);
          console.log(list);
        } catch (err) {
        }
      }
     fetchData();

  
  }, []);

  const navigate = useNavigate()

  const handleView =  (id) => {
    navigate(`/users/${id}`)
  };
  const handleEdit =  (id) => {
    navigate(`/users/edit/${id}`)
  };
 

  const handleDelete = async (id) => {
    try {

    // supprimer l'utilisateur de la base de données Firestore
    await deleteDoc(doc(db, "USERDATA", id));

    setData(data.filter((item) => item.id !== id));
    } catch (err) {
    console.log(err);
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
           
              <div className="viewButton"
              onClick={()=> handleView(params.row.id)}>View</div>
              

              <div className="viewButton"
              onClick={()=> handleEdit(params.row.id)}>Edit</div>
           
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
        USERS
        <Link to="/users/new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={userColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
     />
     
   
    </div>
  );
};

export default Datatable;
