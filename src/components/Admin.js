import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Collapse } from 'react-bootstrap';
import Select from 'react-select';
import './Admin.css';

const Admin = () => {
  const [dailyItems, setDailyItems] = useState([]);
  const [monthlyItems, setMonthlyItems] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [openUpdate, setOpenUpdate] = React.useState(true);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [visibleAdd, setVisibleAdd] = useState(false);
  const [visibleRemove, setVisibleRemove] = useState(false);
  const [removeSearchTerm, setRemoveSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [filteredItems, setFilteredItems] = useState([]);
  const navigate = useNavigate();

  const options = [
    ...dailyItems.map(item => ({ value: item.id, label: item.name })),
    ...monthlyItems.map(item => ({ value: item.id, label: item.name })),
  ];

  useEffect(() => {
    setIsLoading(true);
    const fetchItems = async () => {
      try {
        const dailyResponse = await axios.get('http://localhost:3000/dailyItems');
        const monthlyResponse = await axios.get('http://localhost:3000/monthlyItems');
        setDailyItems(dailyResponse.data);
        setMonthlyItems(monthlyResponse.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, []); // Empty dependency array means this hook runs only once when the component mounts
  
  useEffect(() => {
    // After fetching the items, filter and slice them
    const items = [...dailyItems, ...monthlyItems];
    const newFilteredItems = items
      .filter(item => item.name.toLowerCase().includes(removeSearchTerm.toLowerCase()))
      .slice(0, 5);
    setFilteredItems(newFilteredItems);
  }, [removeSearchTerm, dailyItems, monthlyItems]); // This hook runs every time removeSearchTerm, dailyItems, or monthlyItems changes

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // This function handles the submit button click
  const handleRemoveSubmit = () => {
    if (selectedItem) {
      const deleteFromDaily = axios.delete(`http://localhost:3000/dailyItems/${selectedItem.value}`);
      const deleteFromMonthly = axios.delete(`http://localhost:3000/monthlyItems/${selectedItem.value}`);
  
      axios.all([deleteFromDaily, deleteFromMonthly])
        .then(axios.spread((...responses) => {
          const dailyResponse = responses[0];
          const monthlyResponse = responses[1];
  
          if (dailyResponse.status === 200) {
            setDailyItems(dailyItems.filter(item => item.id !== selectedItem.value));
          }
  
          if (monthlyResponse.status === 200) {
            setMonthlyItems(monthlyItems.filter(item => item.id !== selectedItem.value));
          }
  
          setSelectedItem(null);
        }))
        .catch(errors => {
          // react on errors.
          console.error('There was an error!', errors);
        });
    }
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


  const handleRemoveChange = (selectedOption) => {
    setSelectedItem(selectedOption);
  };

    // This function handles the remove search bar change
  const handleRemoveSearchChange = (event) => {
    setRemoveSearchTerm(event.target.value);
  };

  // This function handles the dropdown item click
  const handleItemClick = (item) => {
    setRemoveSearchTerm(item.name);
    setSelectedItem(item);
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
      <h1 id="admin-header">Admin Panel</h1>

      <Button
        onClick={() => setOpenUpdate(!openUpdate)}
        aria-controls="update-collapse-text"
        aria-expanded={openUpdate}
      >
        Update
      </Button>
      <Collapse in={openUpdate}>
        <div id="update-collapse-text">
          {openUpdate && (
            <>

              <input type="text" placeholder="Search items..." onChange={handleSearchChange} />
                <button onClick={handleSubmit}>Submit</button>

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
            </>
          )}
        </div>
      </Collapse>

      <Button
        onClick={() => setOpenEdit(!openEdit)}
        aria-controls="edit-collapse-text"
        aria-expanded={openEdit}
      >
        Edit
      </Button>
      <Collapse in={openEdit}>
        <div id="edit-collapse-text">
          {openEdit && (
            <>
              <Button
                onClick={() => setVisibleAdd(!visibleAdd)}
                aria-controls="add-collapse-text"
                aria-expanded={visibleAdd}
                type="button"
              >
                Add
              </Button>
              <Collapse in={visibleAdd}>
                <div id="add-collapse-text">
                  {visibleAdd && (
                    <>
                      <form>
                        <input type="text" placeholder="Name" />
                        <select>
                          <option value="" disabled selected>List Type</option>
                          <option value="type1">Type 1</option>
                          <option value="type2">Type 2</option>
                          {/* Add more options as needed */}
                        </select>
                        <select>
                          <option value="" disabled selected>Category</option>
                          <option value="category1">Category 1</option>
                          <option value="category2">Category 2</option>
                          {/* Add more options as needed */}
                        </select>
                        <button type="submit" onClick={handleAdd}>Submit</button>
                      </form>
                    </>
                  )}
                </div>
              </Collapse>

              <Button
                onClick={() => setVisibleRemove(!visibleRemove)}
                aria-controls="remove-collapse-text"
                aria-expanded={visibleRemove}
                type="button"
              >
                Remove
              </Button>
              <Collapse in={visibleRemove}>
                <div id="remove-collapse-text">
                  {visibleRemove && (
                    <>
                      <Select
                        options={options}
                        isSearchable
                        onChange={handleRemoveChange}
                      />
                      <button onClick={handleRemoveSubmit}>Submit</button>
                    </>
                  )}
                </div>
              </Collapse>
            </>
          )}
        </div>
      </Collapse>
    </div>
  );
};

export default Admin;