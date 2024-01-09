import { useDrag } from 'react-dnd'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from "react";

import Edit from './edit.png'
import Delete from './delete.png'
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db,auth } from "../../firebase";

function TaskKanban({ task, onTaskDropping }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "text/plain",
    item: task,
    end: (item, monitor) => {
      if (monitor.didDrop()) {
        onTaskDropping(item);
      }
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const navigate = useNavigate();
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch your data here and update the 'data' state
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "tasksCollection"));
        const tasks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setData(tasks);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Call the fetchData function
    fetchData();

    // Set up Firestore listener for real-time updates
    const unsubscribe = onSnapshot(collection(db, "tasksCollection"), (snapshot) => {
      const updatedData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setData((prevData) => {
        const updatedData = prevData.filter((item) => item.id !== task.id);
        console.log(updatedData); // Log the updated data
        return updatedData;
      });    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const handleView = () => {
    navigate(`/programs/${task.programId}/tasks/${task.id}`);
  };

  const handleEdit = () => {
    navigate(`/programs/${task.programId}/tasks/edit/${task.id}`, {
      state: {
        realStartHour: task.heureDebutReelle,
        realEndHour: task.heureFinReelle,
      },
    });
  };
  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this task?');
  
    if (confirmDelete) {
      try {
        // Delete task from Firestore
        await deleteDoc(doc(db, 'tasksCollection', task.id));
  
        // Update local state
        setData((prevData) => {
          const updatedData = prevData.filter((item) => item.id !== task.id);
          console.log(updatedData); // Log the updated data
          return updatedData;

        });
        window.location.reload();

      } catch (err) {
        console.error(err);
      }
    }
  };
  

  return (
    <div
      ref={drag}
      className='task-kanban'
      style={{
        display: isDragging ? "none" : "flex",
      }}
      onDoubleClick={() => handleView()}
    >
      <div className='priority'>{task.priority}</div>
      <div className='name'>{task.name}</div>
      <p className='duration'>Duration: {task.duree}</p>
      <p className='end'>End : {task.heureFinReelle}</p>

      <button onClick={() => handleEdit()} className='edit'>
        <img src={Edit} style={{ width: "17px", height: "18px" }} alt="Edit" />
      </button>

      <button onClick={() => handleDelete()} className='delete'>
        <img src={Delete} style={{ width: "17px", height: "18px" }} alt="Delete" />
      </button>
    </div>
  );
}

export default TaskKanban;
