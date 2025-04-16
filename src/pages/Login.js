import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const response = axios.post('http://localhost:5000/api/login', {
      email,
      password,
    });
   
    response.then((res) => {
      if (res.status === 200) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        window.location.href = '/';
      } else {
        setError(res.data.message);
      }
    }).catch((err) => {
      setError(err.response.data.message);
    });


    setEmail('');
    setPassword('');
    
  };

  return (
    <div className="modal-content" style={{ margin: '50px auto', maxWidth: '400px' }}>
      <h2 style={{ textAlign: 'center', color: '#ff0080' }}>Login</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <label htmlFor="email" style={{ fontSize: '1rem', color: '#333' }}>Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: '10px',
            border: '2px solid #ddd',
            borderRadius: '5px',
            fontSize: '1rem',
          }}
        />

        <label htmlFor="password" style={{ fontSize: '1rem', color: '#333' }}>Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: '10px',
            border: '2px solid #ddd',
            borderRadius: '5px',
            fontSize: '1rem',
          }}
        />
        {
          error && (
            <p style={{ color: 'red', fontSize: '1rem' }}>{error}</p>
          )
        }

        <button
          type="submit"
          className="submit-btn"
          style={{
            padding: '10px',
            backgroundColor: '#ff007f',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
          }}
        >
          Login
        </button>
      </form>

      <p style={{ textAlign: 'center', fontSize: '1rem', color: '#333' }}>
        Don't have an account? <Link to='/signup' style={{ color: '#ff007f' }}>Register</Link>
      </p>
    </div>
  );
};

export default Login;
