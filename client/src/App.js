import './App.css';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './components/Login';
import Register from './components/Register';
import {UserContextProvider} from './userContext';
import Profile from './components/Profile';

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Login />}/>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/profile' element={<Profile />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
