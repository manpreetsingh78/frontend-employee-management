import React from 'react';
import './style.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const handleLogout = () => {
      localStorage.removeItem('accessToken');
      window.location.href = '/';
    }
    return (
        <>
      <div className='navbar'>
        <div className="nav-logo">
      </div>
        <div className='nav-items'>
            <ul>
          <li><a><Link to="/employee">Employee Management</Link></a></li>
          </ul>
        </div>
        <div className="nav-button">
        <a onClick={handleLogout}>Logout</a>
      </div>
      </div>
     </>
    );
  };
  export default Navbar