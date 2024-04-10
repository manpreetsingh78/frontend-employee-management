import React from "react";
import { useRef, useState, useEffect, useContext } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Employee from "./components/Employee";


const App = () => {
  return (
    <main className="App">
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="employee" element={<Employee />} />
      </Routes>
    </BrowserRouter>
    </main>
  );
};

export default App;
