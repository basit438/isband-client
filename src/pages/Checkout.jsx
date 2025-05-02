import React, { useState } from 'react';

const Checkout = () => {
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phoneNumber: '',
    addressLine1: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    postalCode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [coupon, setCoupon] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    // Basic validation
    if (!shippingAddress.fullName || !shippingAddress.phoneNumber || !shippingAddress.addressLine1) {
      return setResponseMessage('Please fill in all required fields.');
    }

    setLoading(true);
    setResponseMessage('');

    const body = {
      shippingAddress,
      payment: { method: paymentMethod },
    };

    if (coupon.trim() !== '') {
      body.coupon = coupon.trim();
    }

    try {
      const res = await fetch('http://localhost:5002/api/v1/order/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add token if needed:
          // 'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        setResponseMessage(`✅ ${data.message}`);
        // Optionally reset form
      } else {
        setResponseMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setResponseMessage('❌ Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Checkout</h2>

      <h4>Shipping Address</h4>
      {[
        { name: 'fullName', label: 'Full Name' },
        { name: 'phoneNumber', label: 'Phone Number' },
        { name: 'addressLine1', label: 'Address Line 1' },
        { name: 'street', label: 'Street' },
        { name: 'city', label: 'City' },
        { name: 'state', label: 'State' },
        { name: 'zip', label: 'ZIP' },
        { name: 'postalCode', label: 'Postal Code' },
        { name: 'country', label: 'Country' },
      ].map((field) => (
        <input
          key={field.name}
          name={field.name}
          value={shippingAddress[field.name]}
          onChange={handleInputChange}
          placeholder={field.label}
          style={styles.input}
        />
      ))}

      <label>Payment Method</label>
      <select
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
        style={styles.input}
      >
        <option value="COD">Cash on Delivery</option>
        <option value="ONLINE">Online Payment</option>
      </select>

      <label>Coupon Code (optional)</label>
      <input
        type="text"
        value={coupon}
        onChange={(e) => setCoupon(e.target.value)}
        placeholder="WELCOME25"
        style={styles.input}
      />

      <button onClick={handlePlaceOrder} style={styles.button} disabled={loading}>
        {loading ? 'Placing Order...' : 'Place Order'}
      </button>

      {responseMessage && <p style={styles.response}>{responseMessage}</p>}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '40px auto',
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: '#f0f2f5',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '12px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  response: {
    marginTop: '15px',
    fontWeight: 'bold',
    color: '#333',
  },
};

export default Checkout;
