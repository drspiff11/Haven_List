import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Order from './components/Order';
import Admin from './components/Admin';
import Report from './components/Report';
import Ticket from './components/Ticket';
import './App.css';

function App() {

  const dailyItems = []; // replace with your actual data
  const monthlyItems = []; // replace with your actual data

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/order" element={<Order />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/report" element={<Report />} />
        <Route path="/ticket" element={<Ticket />} />
        <Route path="/report" element={
          <Report dailyItems={dailyItems} monthlyItems={monthlyItems} />
        } />
      </Routes>
    </Router>
  );
}

export default App;