import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSignup = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const response = axios.post('http://localhost:5000/api/register', {
      email,
      password,
      username,
    });

    response
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem('user', JSON.stringify(res.data.user));
          window.location.href = '/';
        } else {
          setError(res.data.message);
        }
      })
      .catch((err) => {
        setError(err.response.data.message);
      });

    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setUsername('');
  };

  return (
    <div className="modal-content" style={{ margin: '50px auto', maxWidth: '400px' }}>
      <h2 style={{ textAlign: 'center', color: '#ff0080' }}>Signup</h2>
      <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <label htmlFor="username" style={{ fontSize: '1rem', color: '#333' }}>Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{
            padding: '10px',
            border: '2px solid #ddd',
            borderRadius: '5px',
            fontSize: '1rem',
          }}
        />

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

        <label htmlFor="confirmPassword" style={{ fontSize: '1rem', color: '#333' }}>Confirm Password:</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          style={{
            padding: '10px',
            border: '2px solid #ddd',
            borderRadius: '5px',
            fontSize: '1rem',
          }}
        />

        {error && <p style={{ color: 'red', fontSize: '1rem' }}>{error}</p>}

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
          Signup
        </button>
      </form>

      <p style={{ textAlign: 'center', fontSize: '1rem', color: '#333' }}>
        Already have an account? <Link to='/login' style={{ color: '#ff007f' }}>Login</Link>
      </p>

    </div>
  );
};

export default Signup;
