import "./list.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import NotificationsDatatable from "../../components/datatable/notificationsDatatable"

const List = () => {
  return (
    <div className="list">
      <Sidebar/>
      <div className="listContainer">
        <Navbar/>
        <NotificationsDatatable/>
      </div>
    </div>
  )
}

export default List