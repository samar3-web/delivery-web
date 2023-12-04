import "./datatable.scss";
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

import {DndProvider} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'

import Kanban from '../task/Kanban'

import '../task/tasks.css'

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


  const status = ["à faire","en cours","faite" ] ;


  return (
    <div>
    <div className="datatable">
      <div className="datatableTitle">
        Tasks
        <Link to={`/programs/${programId}/tasks/new`} className="link">
          Add New
        </Link>
      </div>
    </div>

    <DndProvider backend={HTML5Backend}>
        <section className='content'>
          <div > 
            <Kanban data={data} status={status}  />
          </div>
        </section>
        </DndProvider>

    </div>
  );
};

export default Datatable;
