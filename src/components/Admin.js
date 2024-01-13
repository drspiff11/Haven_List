import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Admin.css';

const Admin = () => {
  const [dailyItems, setDailyItems] = useState([]);
  const [monthlyItems, setMonthlyItems] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    const fetchItems = async () => {
      try {
        const dailyResponse = await axios.get('http://localhost:3000/dailyItems');
        const monthlyResponse = await axios.get('http://localhost:3000/monthlyItems');
        setDailyItems(dailyResponse.data);
        setMonthlyItems(monthlyResponse.data);
      } catch (error) {
        setError('Failed to fetch items: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchItems();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      for (const item of dailyItems) {
        await axios.put(`http://localhost:3000/dailyItems/${item.id}`, { ...item, isVisible: item.isVisible });
      }
  
      for (const item of monthlyItems) {
        await axios.put(`http://localhost:3000/monthlyItems/${item.id}`, { ...item, isVisible: item.isVisible });
      }
  
      navigate('/');
    } catch (error) {
      console.error('Error updating lists:', error);
    }
  };

  const handleCheckboxChange = (item, type) => {
    const updatedItem = { ...item, isVisible: !item.isVisible };
    
    if (type === 'daily') {
      setDailyItems(dailyItems.map(i => i.id === item.id ? updatedItem : i));
    } else if (type === 'monthly') {
      setMonthlyItems(monthlyItems.map(i => i.id === item.id ? updatedItem : i));
    }
  };

  const handleAdd = () => {
    console.log('Add functionality to be implemented');
  };

  const handleRemove = () => {
    console.log('Remove functionality to be implemented');
  };

  const filteredDailyItems = searchTerm ? dailyItems.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())) : dailyItems;
  const filteredMonthlyItems = searchTerm ? monthlyItems.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())) : monthlyItems;

  if (isLoading) {
    return <div className="admin-container">Loading items...</div>;
  }

  if (error) {
    return <div className="admin-container">Error: {error}</div>;
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

      <input type="text" placeholder="Search items..." onChange={handleSearchChange} />
      <button onClick={handleAdd}>Add</button>
      <button onClick={handleRemove}>Remove</button>

      {/* Daily Items */}
      <div className='daily-items'>
        <h3>Daily</h3>  
        {filteredDailyItems.map((item) => (
          <button
            key={item.id}
            className={`sticky-button ${item.isVisible ? 'checked' : ''}`}
            onClick={() => handleCheckboxChange(item, 'daily')}
          >
            {item.name}
          </button>
        ))}
      </div>

      {/* Monthly Items */}
      <div className='monthly-items'>
        <h3>Monthly</h3>  
        {filteredMonthlyItems.map((item) => (
          <button
            key={item.id}
            className={`sticky-button ${item.isVisible ? 'checked' : ''}`}
            onClick={() => handleCheckboxChange(item, 'monthly')}
          >
            {item.name}
          </button>
        ))}
      </div>

      <button onClick={handleSubmit}>Update</button>
    </div>
  );
};

export default Admin;