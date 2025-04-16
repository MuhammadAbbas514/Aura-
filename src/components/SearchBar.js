import React, { useState } from 'react';


const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  

  const handleSearch = () => {
    onSearch(searchTerm);
    if (window.location.pathname !== '/products')
    window.location.href = '/products';
};


  return (
    <div className="search-container">
      <input
        type="text"
        className="search-bar"
        placeholder="Search Product"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button className="search-btn" onClick={handleSearch}>
        Search
      </button>
    </div>
  );
};

export default SearchBar;
