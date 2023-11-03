import axios from 'axios';
import { useState } from 'react';

function Order() {
  const [selectedItem, setSelectedItem] = useState('');

  const placeOrder = async () => {
    await axios.post('/orders', { item: selectedItem });
  };

  return (
    <div>
      <select onChange={e => setSelectedItem(e.target.value)}>
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
      </select>
      <button onClick={placeOrder}>Place Order</button>
    </div>
  );
}

export default Order;