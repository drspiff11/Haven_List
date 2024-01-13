import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MenuOutlined } from '@ant-design/icons';
import './Home.css'; // Ensure you have this CSS file in your project

function Home() {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMonthly, setShowMonthly] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint = showMonthly ? '/monthlyItems' : '/dailyItems';
        const res = await axios.get(`http://localhost:3000${endpoint}`);
        // Filter items to only include those with isVisible = true
        const visibleItems = res.data.filter(item => item.isVisible);
        setFoodItems(visibleItems);
        setLoading(false);
      } catch (err) {
        setError('An error occurred while fetching data.');
        setLoading(false);
      }
    };
    fetchData();
  }, [showMonthly]);

  // Organize food items by category
  const categorizedItems = foodItems.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  if (loading) {
    return <div class="header" className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const toggleListType = () => {
    setShowMonthly(!showMonthly);
  };

  return (
    
    <div className="container">
      <header className="header">
      <nav className="nav">
        <Link to="/admin" className="nav-link">Admin</Link>
        <Link to="/order" className="nav-link">Place Order</Link>
      </nav>
      </header>

      <div className="item-list">
      <h1>Today's Food Shelf List</h1>
      <button className="button toggle-button" onClick={toggleListType}>
        {showMonthly ? 'Show Daily List' : 'Show Monthly List'}
      </button>

      <section className="content">
        <h2>{showMonthly ? 'Monthly List:' : 'Daily List:'}</h2>
        <div className="food-items-container">
          {Object.keys(categorizedItems).map((category) => (
            <div className='category' key={category}>
              <h3>{category}</h3>
              {categorizedItems[category].map((item) => (
                <div key={item.id} className="food-item">
                  <div>{item.name}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
      </div>
      <footer></footer>
    </div>
  );
}

export default Home;
