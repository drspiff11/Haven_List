import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMonthly, setShowMonthly] = useState(false); // State for toggling between daily and monthly lists

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint = showMonthly ? '/monthlyItems' : '/dailyItems'; // Adjust the endpoint based on the toggle state
        const res = await axios.get(`http://localhost:3000${endpoint}`); // Use the appropriate endpoint
        setFoodItems(res.data);
        setLoading(false);
      } catch (err) {
        setError('An error occurred while fetching data.');
        setLoading(false);
      }
    };
    fetchData();
  }, [showMonthly]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Welcome to the Upper Valley Haven!</h1>
      <li><Link to="/order">Place Order</Link></li>
      <li><Link to="/login">Login</Link></li>
      <li><Link to="/register">Register</Link></li>
      <div className="toggle-switch">
        <label>
          <input
            type="checkbox"
            checked={showMonthly}
            onChange={() => setShowMonthly(!showMonthly)}
          />
          Show Monthly List
        </label>
      </div>
      <h2>{showMonthly ? 'Monthly List:' : 'Daily List:'}</h2>
      <div className="food-list">
      {foodItems.map((item) => (
        <div key={item.id} className="food-item">
          {item.name}
        </div>
      ))}
     </div>
    </div>
  );
}

export default Home;
