import KanbanItem from './kanbanItem'

function kanban({data,status}) {


    return (
    
     <div className="kanban">


       {
         status.map((statusElement)=>{
          const elementData=data.filter((task)=>task.status==statusElement)
            return (
            <KanbanItem key={statusElement} status={statusElement} data={elementData}/>
            )
         })
       }
     </div>
     
    )
  }
  
  export default kanban
  