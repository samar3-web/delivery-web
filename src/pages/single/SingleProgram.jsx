import "./singleProgram.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import TasksDatatable from "../../components/datatable/tasksDatatable"
import { useParams } from "react-router-dom"

const List = () => {
  const {programId}=useParams()
  return (
    <div className="list">
      <Sidebar/>
      <div className="listContainer">
        <Navbar/>
        <TasksDatatable programId={programId} />
      </div>
    </div>
  )
}

export default List