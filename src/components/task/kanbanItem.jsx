import { useDrop } from "react-dnd";
import TaskKanban from "./TaskKanban";
import { useEffect, useState } from "react";
import {
  collection,
  setDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase";

function KanbanItem({ status, data }) {

  const [currentData,setCurrentData] = useState([])

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: "text/plain",
    canDrop: (item) => status!=item.status , // Autorisez le drop uniquement si l'element n'appartient pas a la list
    drop: (item) => {
      
      addToItem(item);
      
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  useEffect(()=>{
    setCurrentData(data)
  },[data])

  const addToItem = async (task) => {
    try {
      // Vérifier si la tâche avec le même ID existe déjà
      const taskExists = currentData.some((existingTask) => existingTask.id === task.id);

      if (!taskExists) {
        // Si la tâche n'existe pas, ajoutez-la avec le statut souhaité
        const newTask = { ...task, status: status };
        setCurrentData((current) => [...current, newTask]);

        //update db
      try{
        const taskDocRef = doc(collection(db, "tasksCollection"), task.id);
        await setDoc(taskDocRef, newTask);
      }catch(err){
        console.error(err)
      }
       
      } else {
        console.log(`La tâche existe déjà.`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onTaskDropping = (droppedTask) => {
     setCurrentData((current) => current.filter(task => task.id !== droppedTask.id)); 
  };

  return (
    <div className={isOver ? "kanban-item kanban-item-is-over" : "kanban-item kanban-item-is-not-over"} 
      ref={drop}>
      <div className="status"> {status}</div>
      {currentData.map((task) => (
        <TaskKanban key={task.id} task={task} onTaskDropping={onTaskDropping}/>
      ))}
    </div>
  );
}

export default KanbanItem;
