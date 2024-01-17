import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Collapse } from 'react-bootstrap';
import Header from './Header';
import Select from 'react-select';
import './Admin.css';

const Admin = () => {
  const [dailyItems, setDailyItems] = useState([]);
  const [monthlyItems, setMonthlyItems] = useState([]);
  const [selectedDailyItems, setSelectedDailyItems] = useState(new Set());
  const [selectedMonthlyItems, setSelectedMonthlyItems] = useState(new Set());
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
  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState('');
  const [listType, setListType] = useState('');
  const [categoryOptions, setCategoryOptions] = useState(<option value="" disabled selected>Select List Type First</option>);
  const [category, setCategory] = useState(''); // Add this line
  const [categories, setCategories] = useState([]);
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

  useEffect(() => {
    if (listType === 'daily') {
      setCategoryOptions(
        <>
          <option value="dailyCategory1">Daily Category 1</option>
          <option value="dailyCategory2">Daily Category 2</option>
        </>
      );
    } else if (listType === 'monthly') {
      setCategoryOptions(
        <>
          <option value="monthlyCategory1">Dry</option>
          <option value="monthlyCategory2">Monthly Category 2</option>
        </>
      );
    } else {
      setCategoryOptions(<option value="" disabled>Select List Type First</option>);
    }
  }, [listType]);
  

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSelectionChange = (itemId, isSelected, isDailyItem) => {
    if (isDailyItem) {
      setSelectedDailyItems(prevSelectedItems => {
        const newSelectedItems = new Set(prevSelectedItems);
        if (isSelected) {
          newSelectedItems.add(itemId);
        } else {
          newSelectedItems.delete(itemId);
        }
        return newSelectedItems;
      });
    } else {
      setSelectedMonthlyItems(prevSelectedItems => {
        const newSelectedItems = new Set(prevSelectedItems);
        if (isSelected) {
          newSelectedItems.add(itemId);
        } else {
          newSelectedItems.delete(itemId);
        }
        return newSelectedItems;
      });
    }
  };

  const handleItemSelection = (itemId, isDailyItem) => {
    if (isDailyItem) {
      if (selectedDailyItems.has(itemId)) {
        selectedDailyItems.delete(itemId);
      } else {
        selectedDailyItems.add(itemId);
      }
      setSelectedDailyItems(new Set(selectedDailyItems));
      console.log('selectedDailyItems:', Array.from(selectedDailyItems));
    } else {
      if (selectedMonthlyItems.has(itemId)) {
        selectedMonthlyItems.delete(itemId);
      } else {
        selectedMonthlyItems.add(itemId);
      }
      setSelectedMonthlyItems(new Set(selectedMonthlyItems));
      console.log('selectedMonthlyItems:', Array.from(selectedMonthlyItems));
    }
  };

  const handleAddSubmit = (event) => {
    console.log('handleAddSubmit called');
    event.preventDefault();
    console.log('Creating new item');
    const newItem = {
      name: itemName,
      category: itemCategory,
      isVisible: false,
    };
    console.log('Sending POST request');
    axios.post(`http://localhost:3000/${listType}Items`, newItem)
      .then(response => {
        if (listType === 'daily') {
          setDailyItems([...dailyItems, response.data]);
        } else if (listType === 'monthly') {
          setMonthlyItems([...monthlyItems, response.data]);
        }
  
        setItemName('');
        setItemCategory('');
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
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

  const updateItemVisibility = async (item, isVisible, url) => {
    const updatedItem = { ...item, isVisible };
    try {
      const response = await axios.put(`${url}/${item.id}`, updatedItem);
      console.log('Server response:', response);
    } catch (error) {
      console.error(`Error updating item ${item.id}:`, error);
    }
  };

  const handleSubmit = async () => {
    try {
      // Update visibility for selected daily items
      for (const itemId of selectedDailyItems) {
        const item = dailyItems.find(i => i.id === itemId);
        if (item) {
          await updateItemVisibility(item, true, 'http://localhost:3000/dailyItems');
        }
      }
  
      // Update visibility for selected monthly items
      for (const itemId of selectedMonthlyItems) {
        const item = monthlyItems.find(i => i.id === itemId);
        if (item) {
          await updateItemVisibility(item, true, 'http://localhost:3000/monthlyItems');
        }
      }
  
      // Optionally, you can clear selected items after update
      setSelectedDailyItems(new Set());
      setSelectedMonthlyItems(new Set());
  
    } catch (error) {
      console.error('Error updating lists:', error);
    }
  };
  

  

// Refactored handleCheckboxChange
const handleCheckboxChange = (item, type) => {
  const updatedItem = { ...item, isVisible: !item.isVisible };

  if (type === 'daily') {
    setDailyItems(dailyItems.map(i => i.id === item.id ? updatedItem : i));
    updateSelectionState(item.id, updatedItem.isVisible, setSelectedDailyItems);
  } else if (type === 'monthly') {
    setMonthlyItems(monthlyItems.map(i => i.id === item.id ? updatedItem : i));
    updateSelectionState(item.id, updatedItem.isVisible, setSelectedMonthlyItems);
  }
};

// Utility function to update the selection state
const updateSelectionState = (itemId, isSelected, setSelectionState) => {
  setSelectionState(prevSelectedItems => {
    const newSelectedItems = new Set(prevSelectedItems);
    if (isSelected) {
      newSelectedItems.add(itemId);
    } else {
      newSelectedItems.delete(itemId);
    }
    return newSelectedItems;
  });
};


  const fetchCategories = (listType) => {
    axios.get(`http://localhost:3000/${listType}Items`)
      .then(response => {
        const fetchedCategories = response.data.map(item => item.category);
        const uniqueCategories = [...new Set(fetchedCategories)];
        setCategories(uniqueCategories);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
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

  const handleListTypeChange = (event) => {
    setListType(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };
  

  const handleAdd = () => {
    console.log('Add functionality to be implemented');
  };

  const handleRemove = () => {
    console.log('Remove functionality to be implemented');
  };

  const getCategoryOptions = () => {
    if (listType === 'daily') {
      return (
        <>
          <option value="Produce">Produce</option>
          <option value="Bakery">Bakery</option>
          <option value="Daily Extras">Daily Extras</option>
          <option value="USDA">USDA</option>
        </>
      );
    } else if (listType === 'monthly') {
      return (
        <>
          <option value="canned-meat">Canned Meat</option>
          <option value="canned-goods">Canned Goods</option>
          <option value="dry">Dry Goods</option>
          <option value="beans">Canned Beans</option>
          <option value="veg">Vegetables</option>
          <option value="fruit">Canned Fruit</option>
          <option value="soup">Canned Soup</option>
          <option value="monthly-extras">Monthly Extras</option>
          <option value="personal">Personal Care</option>
          <option value="child">Childcare</option>
          <option value="pet">Pet Products</option>
          <option value="dairy">Dairy</option>
          <option value="meat">Meat</option>
        </>
      );
    } else {
      return <option value="">Select List Type First</option>;
    }
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
      <Header /> 
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
                      <form onSubmit={handleAddSubmit}>
                        <input
                          type="text"
                          placeholder="Name"
                          value={itemName}
                          onChange={event => setItemName(event.target.value)}
                        />
                        <select value={listType} onChange={handleListTypeChange}>
                          <option value="" disabled selected>List Type</option>
                          <option value="daily">Daily</option>
                          <option value="monthly">Monthly</option>
                          {/* Add more options as needed */}
                        </select>
                        <select value={itemCategory} onChange={(e) => setItemCategory(e.target.value)}>
                          {getCategoryOptions()}
                        </select>
                        <button type="submit">Submit</button>
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