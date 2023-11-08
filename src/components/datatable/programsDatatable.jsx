import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { programsColumns } from "../../datatablesource";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";



const Datatable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
      const fetchData = async () => {
        let list = [];
        try {
          let i =1
          const querySnapshot = await getDocs(collection(db, "programsCollection"));
          querySnapshot.forEach((doc) => {
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
 



  const handleDelete = async (programId) => {
      try {
          // 1. Récupérez tous les tasks associés à ce programId
          const tasksCollection = collection(db, "tasksCollection");
          const q = query(tasksCollection, where("programId", "==", programId));
  
          const tasksSnapshot = await getDocs(q);
  
          // 2. Supprimez chaque task associé
          const deleteTasksPromises = [];
          tasksSnapshot.forEach((doc) => {
              const deletePromise = deleteDoc(doc.ref);
              deleteTasksPromises.push(deletePromise);
          });
  
          await Promise.all(deleteTasksPromises);
  
          // 3. Supprimez le program lui-même
          await deleteDoc(doc(db, "programsCollection", programId));
          
          setData(data.filter((item) => item.id !== programId));
      } catch (err) {
          console.log(err);
      }
  };
  
  const handleView =  (id) => {
    navigate(`/programs/${id}`)
  };
  const handleEdit =  (id) => {
    navigate(`/programs/edit/${id}`)
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
                  Tasks
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
        PROGRAMS
        <Link to="/programs/new" className="link">
          Add New
        </Link>
      </div>

      <DataGrid
        className="datagrid"
        rows={data}
        columns={programsColumns.concat(actionColumn)}
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
