import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <header className="header">
      <nav className="nav">
        {currentPath !== "/admin" && <Link to="/admin" className="nav-link">Admin</Link>}
        {currentPath !== "/order" && <Link to="/order" className="nav-link">Place Order</Link>}
        {currentPath !== "/report" && <Link to="/report" className="nav-link">Print</Link>}
        {currentPath !== "/" && <Link to="/" className="nav-link">Home</Link>}
      </nav>
    </header>
  );
};

export default Header;