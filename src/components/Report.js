import React from 'react';
import { useLocation } from 'react-router-dom';
import './Report.css'; // Ensure you have this CSS file for styling

function Report() {
    const location = useLocation();
    const { firstName, lastName, isAnonymous, householdSize, selectedState, notes, selectedItems, dailyItems, monthlyItems } = location.state.orderData;
  
    return (
      <div>
        <h1>Order Summary</h1>
        <p>Name: {isAnonymous ? 'Anonymous' : `${firstName} ${lastName}`}</p>
        <p>Household Size: {householdSize}</p>
        <p>State: {selectedState}</p>
        <p>Notes: {notes}</p>
        <h2>Selected Items</h2>
        <ul>
          {selectedItems && selectedItems.map(item => <li key={item}>{item}</li>)}
        </ul>
        <h2>Daily Items</h2>
        <ul>
          {dailyItems && dailyItems.map(item => <li key={item.id}>{item.name}</li>)}
        </ul>
        <h2>Monthly Items</h2>
        <ul>
          {monthlyItems && monthlyItems.map(item => <li key={item.id}>{item.name}</li>)}
        </ul>
      </div>
    );
  }
  

export default Report;
