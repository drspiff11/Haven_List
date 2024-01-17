import React from 'react';
import { useLocation } from 'react-router-dom';
import './Ticket.css'; // Ensure you have this CSS file for styling

function Ticket() {
    const location = useLocation();
    const {         
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
      selectedItems, 
      dailyItems,
      monthlyItems } = location.state.orderData;
  
    return (
      <div className='ticket'>
        <p id='ticket-timestamp'>Timestamp: {new Date().toLocaleString()}</p>
        <h1>Order Summary</h1>
        <table>
          <tbody>
            <tr>
              <td>Name: <p>{isAnonymous ? 'Anonymous' : `${firstName} ${lastName}`}</p></td>
              <td>Pick Up Person: <p>{pickUpPerson}</p></td>
            </tr>
            <tr>
              <td>Household Size: <p>{householdSize}</p></td>
              <td>State: <p>{selectedState}</p></td>
            </tr>
            <tr>
              <td>Vehicle: <p>{vehicle}</p></td>
              <td>Pager Number: <p>{pager}</p></td>
            </tr>
            <tr>
              <td>Time: <p>{new Date().toLocaleTimeString()}</p> </td>
              <td>Dietary Restrictions: <p>{dietary}</p></td>
            </tr>
            <tr>
              <td colSpan="2 ">Wishlist: <p>{wishlist}</p></td>
            </tr>
          </tbody>
        </table>
        <ul>
          {selectedItems && selectedItems.map(item => <li key={item}>{item}</li>)}
        </ul>
        {includeDaily && ( // Add this line
          <>
            <h2>Daily Items</h2>
            <ul>
              {dailyItems && dailyItems.map(item => <li key={item.id}>{item.name}</li>)}
            </ul>
          </>
        )}
        {includeMonthly && ( // Add this line
          <>
            <h2>Monthly Items</h2>
            <ul>
              {monthlyItems && monthlyItems.map(item => <li key={item.id}>{item.name}</li>)}
            </ul>
          </>
        )}
      </div>
    );
  }
  

export default Ticket;