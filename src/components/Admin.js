import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Admin.css'; // Assuming Admin.css is in the same directory

const Admin = () => {
  const [dailyItems, setDailyItems] = useState([]);
  const [monthlyItems, setMonthlyItems] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch items from the server when the component mounts
  useEffect(() => {
    setIsLoading(true); // Start loading
    const fetchItems = async () => {
      try {
        const dailyResponse = await axios.get('http://localhost:3000/dailyItems');
        const monthlyResponse = await axios.get('http://localhost:3000/monthlyItems');
        setDailyItems(dailyResponse.data);
        setMonthlyItems(monthlyResponse.data);
      } catch (error) {
        setError('Failed to fetch items');
      } finally {
        setIsLoading(false); // Stop loading regardless of outcome
      }
    };

    fetchItems();

  }, []);

  // Handle checkbox change for daily items
  const handleCheckboxChange = (item, type) => {
    const updatedItem = { ...item, checked: !item.checked };
    
    if (type === 'daily') {
      setDailyItems(dailyItems.map(i => i.id === item.id ? updatedItem : i));
    } else if (type === 'monthly') {
      setMonthlyItems(monthlyItems.map(i => i.id === item.id ? updatedItem : i));
    }
  };

  if (isLoading) {
    return <div className="admin-container">Loading items...</div>;
  }

  return (
    
    <div>
      <header className="header">
      <nav className="nav">
        <Link to="/order" className="nav-link">Order</Link>
        <Link to="/" className="nav-link">Home</Link>
      </nav>
      </header>

      <h1>Admin Panel</h1>

      {/* Daily Items */}
      <div className='daily-items'>
      <h3>Daily</h3>  
      {dailyItems.map((item) => (
        <button
          key={item.id}
          className={`sticky-button ${item.checked ? 'checked' : ''}`}
          onClick={() => handleCheckboxChange(item, 'daily')}
        >
          {item.name}
        </button>
      ))}
      </div>

      {/* Monthly Items */}
      <div className='monthly-items'>
      <h3>Monthly</h3>  
      {monthlyItems.map((item) => (
        <button
          key={item.id}
          className={`sticky-button ${item.checked ? 'checked' : ''}`}
          onClick={() => handleCheckboxChange(item, 'monthly')}
        >
          {item.name}
        </button>
      ))}
      </div>
    </div>
  );
};

export default Admin;
