import "./style/dark.scss";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";

import UsersList from "./pages/list/usersList";
import ProgramstList from "./pages/list/programsList";
import AdminsList from "./pages/list/AdminsList";
import NotificationsList from "./pages/list/NotificationsList";

import SingleUser from "./pages/single/SingleUser"
import SingleProgram from "./pages/single/SingleProgram"
import SingleTask from "./pages/single/SingleTask"


import EditUser from "./pages/edit/EditUser"
import EditProgram from "./pages/edit/EditProgram"
import EditTask from "./pages/edit/EditTask"


import NewUser from "./pages/new/NewUser";
import NewAdmin from "./pages/new/NewAdmin";
import NewProgram from "./pages/new/NewProgram";
import NewTask from "./pages/new/NewTask.jsx";


import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { programInputs, userInputs, taskInputs } from "./formSource";

import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/AuthContext";


function App() {
  const { darkMode } = useContext(DarkModeContext);

  const { currentUser } = useContext(AuthContext)



  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/login" />;
  };

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter>

        <Routes>
          <Route path="/">
            <Route path="login" element={<Login />} />

            <Route
              index
              element={
                <RequireAuth>
                  <Home />
                </RequireAuth>
              }
            />

            <Route path="users">
              <Route
                index
                element={
                  <RequireAuth>
                    <UsersList />
                  </RequireAuth>
                }
              />
              <Route
                path=":userId"
                element={
                  <RequireAuth>
                    <SingleUser />
                  </RequireAuth>
                }
              />

              <Route path="edit">
                <Route
                  index
                  element={
                    <RequireAuth>
                      < h1>Verify your path</h1>
                    </RequireAuth>
                  }
                />

                <Route
                  path=":userId"
                  element={
                    <RequireAuth>
                      <EditUser title="Edit User" />
                    </RequireAuth>
                  }
                />
              </Route>



              <Route
                path="new"
                element={
                  <RequireAuth>
                    <NewUser inputs={userInputs} title="Add New User" />
                  </RequireAuth>
                }
              />

            </Route>


            <Route path="programs">
              <Route
                index
                element={
                  <RequireAuth>
                    <ProgramstList />
                  </RequireAuth>
                }
              />
              <Route path=":programId">
                <Route
                  index
                  element={
                    <RequireAuth>
                      <SingleProgram />
                    </RequireAuth>
                  }
                />
                <Route path="tasks">
                  <Route
                    index
                    element={
                      <RequireAuth>
                        <SingleProgram />
                      </RequireAuth>
                    }
                  />

                  <Route
                    path=":taskId"
                    element={
                      <RequireAuth>
                        <SingleTask />
                      </RequireAuth>
                    }
                  />


                  <Route
                    path="new"
                    element={
                      <RequireAuth>
                        <NewTask inputs={taskInputs} title="Add New Task" />
                      </RequireAuth>
                    }
                  />
                  <Route path="edit">
                    <Route
                      index
                      element={
                        <RequireAuth>
                          < h1>Verify your path</h1>
                        </RequireAuth>
                      }
                    />

                    <Route
                      path=":taskId"
                      element={
                        <RequireAuth>
                          <EditTask title="Edit Task" />
                        </RequireAuth>
                      }
                    />
                  </Route>
                </Route>






              </Route>


              <Route
                path="new"
                element={
                  <RequireAuth>
                    <NewProgram inputs={programInputs} title="Add New Program" />
                  </RequireAuth>
                }
              />
              <Route path="edit">
                <Route
                  index
                  element={
                    <RequireAuth>
                      < h1>Verify your path</h1>
                    </RequireAuth>
                  }
                />

                <Route
                  path=":programId"
                  element={
                    <RequireAuth>
                      <EditProgram title="Edit Program" />
                    </RequireAuth>
                  }
                />
              </Route>
            </Route>



            <Route path="admins">
              <Route
                index
                element={
                  <RequireAuth>
                    <AdminsList />
                  </RequireAuth>
                }
              />
              <Route
                path="new"
                element={
                  <RequireAuth>
                    <NewAdmin title="Add New Admin" />
                  </RequireAuth>
                }
              />
              <Route
                path="notifications"
                element={
                  <RequireAuth>
                    <NotificationsList title="Notifications" />
                  </RequireAuth>
                }
              />



            </Route>

          </Route>
        </Routes>

      </BrowserRouter>
    </div>
  );
}

export default App;
