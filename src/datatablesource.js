export const userColumns = [
  { field: "email", headerName: "Email", width: 160 },
  { field: "name",headerName: "User Name",width: 130,},
  { field: "lastName",headerName: "Last Name",width: 130,},
  {field: "profileUrl",headerName: "Profile",
    width: 130,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img className="cellImg" src={params.row.profileUrl} alt="avatar" />
          {params.row.username}
        </div>
      );
    },
  },
  
  {
    field: "phone",
    headerName: "Phone",
    width: 120,
  },
  {
    field: "password",
    headerName: "Password",
    width: 130,
  },
  {
    field: "address",
    headerName: "Address",
    width: 100,
  }
];


export const programsColumns = [
  
  { field: "id",headerName: "ID",width: 70,},
  { field: "debut",headerName: "START DATE",width: 130,},
  { field: "fin", headerName: "END DATE", width: 130 },
  { field: "status", headerName: "STATUS", width: 100 },
  { field: "description",headerName: "DESCRIPTION",width: 230,},
 
];

export const tasksColumns = [
  
  { field: "id",headerName: "ID",width: 70,},
  { field: "name", headerName: "NAME", width: 100 },
  { field: "heureDateDebutPrevu",headerName: "START HOUR",width: 130,},
  { field: "heureDateFinPrevu", headerName: "END HOUR", width: 130 },
  { field: "commentaire",headerName: "COMMENT",width: 230,},
 
];

export const tacheColumns = [
  
  { field: "taskTitle",headerName: "Task Title",width: 110,},
  { field: "userName",headerName: "UserName",width: 120,},

  { field: "userEmail",headerName: "UserEmail",width: 130,},


 
  {
    field: "Images",
    headerName: "Image",
    width: 100,
    renderCell: (params) => {
      return (
        <div className="cellWithImgProduct">
          <img className="cellImgProduct" src={params.row.images[0]} alt="avatar" />
          
        </div>
      );
    }
  },
];
const formatDate = (timestamp) => {
  const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6);
  const formattedDate = new Intl.DateTimeFormat('fr-FR').format(date);
  return formattedDate;
};
export const notificationColumns = [
  { field: "status", headerName: "Status", width: 150 },
  {field: 'timestamp',headerName: 'Timestamp',width: 130, renderCell: (params) => formatDate(params.value)},
  { field: "taskName", headerName: "Task Name", width: 130 },
  { field: "taskDescription", headerName: "Task Description", width: 230 },
];




export const adminColumns = [
  { field: "email", headerName: "Email", width: 200 },
];
