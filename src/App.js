import React from "react";
import { useRef, useState, useEffect, useContext } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Employee from "./components/Employee";
import Navbar from "./components/NavBar";


const App = () => {
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken){
        setSuccess(true);
    }

}, [])

  return (
    <main className="App">
      <BrowserRouter>
      
      {success ? (
        <Navbar />
      ) : ( <></>)}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="employee" element={<Employee />} />
      </Routes>
    </BrowserRouter>
    </main>
  );
};

export default App;
