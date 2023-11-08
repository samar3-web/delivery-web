import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { tasksColumns } from "../../datatablesource";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase";

const Datatable = ({programId}) => {
  const [data, setData] = useState([]);

  useEffect(() => {
      const fetchData = async () => {
        let list = [];
        try {
          const querySnapshot = await getDocs(collection(db, "tasksCollection"));
          querySnapshot.forEach((doc) => {
          
            if(doc.data().programId==programId)
                list.push({ id: doc.id, ...doc.data() });
          });
          setData(list);
        } catch (err) {
          console.log(err);
        }
      }
     fetchData();
    
  }, []);

  const navigate = useNavigate()
 

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "tasksCollection", id));
      setData(data.filter((item) => item.id !== id));
    } catch (err) {
      console.log(err);
    }
  };
  const handleView =  (id) => {
    navigate(`/programs/${programId}/tasks/${id}`)
  };
  const handleEdit =  (id) => {
    navigate(`/programs/${programId}/tasks/${id}/edit`)
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            
              <div className="viewButton"
                onClick={() => handleView(params.row.id)} >
                  View
              </div>

              <div className="viewButton"
                 onClick={() => handleEdit(params.row.id)} >
                Edit
              </div>
            
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row.id)}
            >
              Delete
            </div>
          </div>
        );
      },
    }
  ];
  return (
    <div className="datatable">
      <div className="datatableTitle">
        Tasks
        <Link to={`/programs/${programId}/tasks/new`} className="link">
          Add New
        </Link>
      </div>

      <DataGrid
        className="datagrid"
        rows={data}
        columns={tasksColumns.concat(actionColumn)}
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
