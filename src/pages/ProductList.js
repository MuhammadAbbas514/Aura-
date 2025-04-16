import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import axios from 'axios';

const ProductList = ({searchTerm}) => {
  const [sortOrder, setSortOrder] = useState("ascending");
  const [products, setProducts] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
        setOriginalProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products: ', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleSort = (order) => {
    setSortOrder(order);
    const sortedProducts = [...products].sort((a, b) => {
      if (order === "ascending") return a.Price - b.Price; // Low to High
      return b.Price - a.Price; // High to Low
    });
    setProducts(sortedProducts);
  };

  useEffect(() => {
    const filterProducts = ()=>{
      if(searchTerm){
        const filteredProducts = originalProducts.filter((product) =>
          product.Name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setProducts(filteredProducts);
      }
      else{
        setProducts(originalProducts);
      }
    }
    filterProducts();
  }, [searchTerm]);

  
  return (
    <div className="section">
      <h2>Our Products</h2>
      <div className="sort-container">
        <label>Sort by Price:</label>
        <select onChange={(e) => handleSort(e.target.value)} value={sortOrder}>
          <option value="ascending">Low to High</option>
          <option value="descending">High to Low</option>
        </select>
      </div>
      <div className="product-row">
        {loading ? (
          <p>Loading...</p>
        ) : products.length ? (
          products.map((product) => (
            <ProductCard key={product.ProductId} product={product} />
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>
    </div>
  );
};

export default ProductList;
