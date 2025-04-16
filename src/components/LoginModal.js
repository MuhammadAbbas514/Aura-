import React, { useState } from 'react';

const LoginModal = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Welcome, ${username}`);
    onClose();
  };

  return isOpen ? (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button type="submit" className="submit-btn">Login</button>
        </form>
      </div>
    </div>
  ) : null;
};

export default LoginModal;
