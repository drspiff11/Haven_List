import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import './Order.css';

function Order() {
  const [selectedItems, setSelectedItems] = useState(new Set()); // New state for tracking selected items
  const [availableItems, setAvailableItems] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [pickUpPerson, setPickUp] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [householdSize, setHouseholdSize] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [pager, setPager] = useState('');
  const [dietary, setDietary] = useState('');
  const [wishlist, setWishlist] = useState('');
  const [showMonthly, setShowMonthly] = useState(false); // New state to toggle between daily 
  const [includeDaily, setIncludeDaily] = useState(false);
  const [includeMonthly, setIncludeMonthly] = useState(false);
  const [selectedDailyItems, setSelectedDailyItems] = useState(new Set());
  const [selectedMonthlyItems, setSelectedMonthlyItems] = useState(new Set());
  const [data, setData] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint = showMonthly ? '/monthlyItems' : '/dailyItems';
        const res = await axios.get(`http://localhost:3000${endpoint}`);
        setFoodItems(res.data);
        setLoading(false);
      } catch (err) {
        setError('An error occurred while fetching data.');
        setLoading(false);
      }
    };
    fetchData();
  }, [showMonthly]);

  const toggleListType = () => {
    setShowMonthly(!showMonthly);
  };

  // Organize food items by category
  const categorizedItems = foodItems.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const handleItemClick = (itemId, isMonthly) => {
    // Determine which set to update based on whether the item is monthly
    const updateSet = isMonthly ? selectedMonthlyItems : selectedDailyItems;
    const setUpdateFunction = isMonthly ? setSelectedMonthlyItems : setSelectedDailyItems;
  
    setUpdateFunction(prevSelectedItems => {
      const newSelectedItems = new Set(prevSelectedItems);
      if (newSelectedItems.has(itemId)) {
        newSelectedItems.delete(itemId);
      } else {
        newSelectedItems.add(itemId);
      }
      return newSelectedItems;
    });
  };


  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const placeOrder = async () => {
    console.log("Place Order function called");
    try {
      // Fetch both daily and monthly items again to ensure we have the complete lists
      const dailyResponse = await axios.get('http://localhost:3000/dailyItems');
      const monthlyResponse = await axios.get('http://localhost:3000/monthlyItems');
  
      // Filter the fetched items based on the selected IDs
      const filteredDailyItems = dailyResponse.data.filter(item => selectedDailyItems.has(item.id));
      const filteredMonthlyItems = monthlyResponse.data.filter(item => selectedMonthlyItems.has(item.id));
  
      const orderData = {
        firstName,
        lastName,
        isAnonymous,
        pickUpPerson,
        householdSize,
        selectedState,
        vehicle,
        pager, 
        dietary,
        wishlist,
        includeDaily, // Add this line
        includeMonthly, // Add this line
        selectedDailyItems: Array.from(selectedDailyItems),
        selectedMonthlyItems: Array.from(selectedMonthlyItems),
        dailyItems: filteredDailyItems,
        monthlyItems: filteredMonthlyItems
      };
  
      await axios.post('http://localhost:3000/orders', orderData);
      console.log("Order Data:", orderData);
      navigate('/ticket', { state: { orderData } });
      console.log("Navigate called");
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };  
  

  return (
    <div>
      <Header />  

        <form>
              <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
              <label style={{marginRight: '20px'}}>
                <input
                  type="checkbox"
                  id="daily"
                  checked={includeDaily}
                  onChange={(e) => setIncludeDaily(e.target.checked)}
                />
                Daily
              </label>

              <label>
                <input
                  type="checkbox"
                  id="monthly"
                  checked={includeMonthly}
                  onChange={(e) => setIncludeMonthly(e.target.checked)}
                />
                Monthly
              </label>
            </div>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={isAnonymous}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={isAnonymous}
            />
            <input
              type="text"
              placeholder="Pick-Up Person"
              value={pickUpPerson}
              onChange={(e) => setPickUp(e.target.value)}
            />
            <div className="anonymous-checkbox">
            <label>
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                id='.anonymous-checkbox'
              />
              Anonymous
            </label>
            </div>
            <input
              type="number"
              placeholder="Size of Household"
              value={householdSize}
              onChange={(e) => setHouseholdSize(e.target.value)}
              min="0"
              max="25"
            />
            <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
              <option value="" disabled selected>State</option>
              <option value="Vermont">Vermont</option>
              <option value="New Hampshire">New Hampshire</option>
            </select>
            <input
              type="text"
              placeholder="Vehicle"
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
            />
            <input
              type="number"
              placeholder="Pager Number"
              value={pager}
              onChange={(e) => setPager(e.target.value)}
              min="0"
            />
            <textarea
              placeholder="Dietary Restrictions"
              value={dietary}
              onChange={(e) => setDietary(e.target.value)}
            />
            <textarea
              placeholder="Wishlist"
              value={wishlist}
              onChange={(e) => setWishlist(e.target.value)}
            />
      </form>

      <button className="button toggle-button" onClick={toggleListType}>
        {showMonthly ? 'Show Daily List' : 'Show Monthly List'}
      </button>

      <h2>{showMonthly ? 'Monthly List:' : 'Daily List:'}</h2>
      <div className="list-container">
      {Object.keys(categorizedItems).map((category) => (
        <div key={category}>
          <h3>{category}</h3>
          {categorizedItems[category].filter(item => item.isVisible).map((item) => (
            <div 
              key={item.id} 
              className={`food-item-order ${selectedDailyItems.has(item.id) && !showMonthly || selectedMonthlyItems.has(item.id) && showMonthly ? 'selected' : ''}`}
              onClick={() => handleItemClick(item.id, showMonthly)}
            >
              <div>{item.name}</div>
            </div>
          ))}
        </div>
      ))}
      </div>

      <button type="button" onClick={placeOrder}>Place Order</button>
    </div>
  );
}

export default Order;
