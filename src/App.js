import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import ProductList from './pages/ProductList';
import MyOrders from './pages/MyOrders';
import Cart from './pages/Cart';
import SignUp from './pages/SignUp';
// import Favourites from './components/Favourites';
import AddProduct from './pages/AddProduct';
import AboutUs from './components/AboutUs';
import ViewProduct from './pages/ViewProduct';
import Favourites from './components/Favourites';
// import Checkout from './components/Checkout';
const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
 
  return (
    <>
      <Navbar onSearch={setSearchTerm} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/addProduct" element={<AddProduct />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/products" element={<ProductList searchTerm={searchTerm} />}
        />
        <Route path="/products/:productId" element={<ViewProduct />} />
        {/* <Route path="/favourites" element={<Favourites favorites={favorites} />} /> */}
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/favorites" element={<Favourites />} />
        <Route path="*" element={<h1>Not Found</h1>} />
       
      </Routes>
      
      <Footer />
    </>
  );
};

export default App;
