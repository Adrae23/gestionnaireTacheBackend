import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import { AdminHome } from './pages/adminHome'; // Importation d'une exportation nommée
import CreateUser from './pages/createUser';
import UserHome from './pages/userHome';
import CreateTask from './pages/createTask';
import Calendrier from './pages/calendrier';
import AvancementEmployee from './pages/avcEmpl';
import OverdueTasks from './pages/overdueTasks';
import UpdateInfo from './pages/updateInfoAdmin';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/createUser" element={<CreateUser />} />
        <Route path="/updateUser" element={<UpdateInfo />} />
        <Route path="/overdueTasks" element={<OverdueTasks />} />
        <Route path="/createTAsk" element={<CreateTask />} />
        <Route path="/calendrier" element={<Calendrier />} />
        <Route path="/admin-home" element={<AdminHome />} />
        <Route path="/avancementEmpl" element={<AvancementEmployee />} />
        <Route path="/user-home" element={<UserHome />} />
      </Routes>
    </Router>
  );
};

export default App;
