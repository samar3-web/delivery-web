import { useDrag } from 'react-dnd'
import { useNavigate } from 'react-router-dom'
import Edit from './edit.png'
import Delete from './delete.png'

function TaskKanban({ task,onTaskDropping }) {

   const [{isDragging}, drag] = useDrag(() => ({
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

  const navigate =useNavigate()

  const handleView =  () => {
    navigate(`/programs/${task.programId}/tasks/${task.id}`)
  };
  
  const handleEdit =  () => {
    navigate(`/programs/${task.programId}/tasks/edit/${task.id}`)
  };



  return (
    <div  
      ref={drag}
      className='task-kanban'
      style={{
        display: isDragging ? "none":"flex"    
    }}
    onDoubleClick={()=> handleView()}

    >
      
      <div className='priority'>{task.priority} </div>
      <div className='name'>{task.name}</div>
      <p className='duration'>Duration: {task.duree}</p>
      <p className='end'>End : {task.heureFinReelle}</p>
    
      <button onClick={() => handleEdit()
        } className='edit'>
        <img src={Edit} style={{width:"17px",height:"18px" }}/>
      </button>

      <button onClick={() => handleEdit()
        } className='delete'>
        <img src={Delete} style={{width:"17px",height:"18px" }}/>
      </button>

    </div>
  )
}

export default TaskKanban
