import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns, userRows } from "../../datatablesource";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase";

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
          console.log(err);
        }
      }
     fetchData();

    // LISTEN (REALTIME)
    /*
    const unsub = onSnapshot(
      collection(db, "USERDATA"),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          console.log(doc)
          list.push({ id: doc.id, ...doc });
        });
        setData(list);
      },
      (error) => {
        console.log(error);
      }
    );

    console.log(data)

    return () => {
      unsub();
    };
     */
  }, []);
 

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "USERDATA", id));
      setData(data.filter((item) => item.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to="/users/test" style={{ textDecoration: "none" }}>
              <div className="viewButton">View</div>
            </Link>
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
        Add New User
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
