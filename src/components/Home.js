import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMonthly, setShowMonthly] = useState(false);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const categories = showMonthly
    ? ['Rice', 'Canned Meat', 'Pasta', 'Beans']
    : ['Produce', 'Bakery', 'Daily Extras', 'For Vermonters'];

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
      {categories.map((category) => (
        <div className="column" key={category}>
          <h3>{category}</h3>
          {foodItems
            .filter((item) => item.category === category)
            .map((item) => (
              <div key={item.id} className="food-item">
                {item.name}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}

export default Home;
