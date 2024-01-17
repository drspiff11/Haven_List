import React, { useEffect, useState } from 'react';
import './Report.css'; // Ensure you have this CSS file for styling

function Report() {
  const [dailyItems, setDailyItems] = useState([]);
  const [monthlyItems, setMonthlyItems] = useState([]);
  const sortedDailyItems = [...dailyItems].sort((a, b) => a.category.localeCompare(b.category));
  const sortedMonthlyItems = [...monthlyItems].sort((a, b) => a.category.localeCompare(b.category));


  const groupByCategory = (items) => {
    return items.reduce((groupedItems, item) => {
      (groupedItems[item.category] = groupedItems[item.category] || []).push(item);
      return groupedItems;
    }, {});
  };


  const groupedDailyItems = groupByCategory(dailyItems);
  const groupedMonthlyItems = groupByCategory(monthlyItems);


  useEffect(() => {
    fetch('/db.json')
      .then(response => response.json())
      .then(data => {
        setDailyItems(data.dailyItems.filter(item => item.isVisible));
        setMonthlyItems(data.monthlyItems.filter(item => item.isVisible));
      });
  }, []);



  
    return (
      <div className="report">
        <p id='report-timestamp'>Timestamp: {new Date().toLocaleString()}</p>
        <h1>Order Summary</h1>
        <table>
          <tbody>
            <tr>
              <td>Name: </td>
              <td>Pick Up Person:</td>
            </tr>
            <tr>
              <td>Household Size: </td>
              <td>State: </td>
            </tr>
            <tr>
              <td>Vehicle: </td>
              <td>Pager Number: </td>
            </tr>
            <tr>
              <td>Time: </td>
              <td>Dietary Restrictions: </td>
            </tr>
            <tr>
              <td colSpan="2 ">Wishlist: </td>
            </tr>
          </tbody>
        </table>
        <h2>Daily Items</h2>
          <div className="grid-container">
            {Object.entries(groupedDailyItems).map(([category, items]) => (
              <div key={category} className="category-container">
                <h3>{category}</h3>
                <ul>
                  {items.map(item => <li key={item.id}>{item.name}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="monthly-list" style={{ pageBreakBefore: "always" }}>
            <h2>Monthly Items</h2>
            <div className="grid-container">
              {Object.entries(groupedMonthlyItems).map(([category, items]) => (
                <div key={category} className="category-container">
                  <h3>{category}</h3>
                  <ul>
                    {items.map(item => <li key={item.id}>{item.name}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
      </div>
    );
  }
  

export default Report;
