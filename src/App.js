import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup'
import Profile from './pages/Profile/Profile'
import UserPage from './pages/UserPage/UserPage'

import { auth, storage } from './firebase';

function App() {
    return (
        <div className="App">
            <Routes>
                <Route exact path="/" element={<Home/>}/>
                <Route exact path="/home" element={<Home/>}/>
                <Route exact path="/login" element={<Login/>}/>
                <Route exact path="/signup" element={<Signup/>}/>
                <Route exact path="/profile" element={<Profile/>}/>
                <Route exact path="/profile/:userid" element={<UserPage/>}/>
            </Routes>
        </div>
    );
}

export default App;
