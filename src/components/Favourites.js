import React, { useState, useEffect } from "react";
import axios from "axios";

const Favourites = () => {
  const [favourites, setFavourites] = useState([]);
  
  useEffect(() => {
    const fetchFavourites = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        return;
      }
      console.log(user.UserId);
      const response = await axios.get(
        `http://localhost:5000/api/favourites/${user.UserId}`
      );
      if (response.data) {
        setFavourites(response.data);
      }
    }
    fetchFavourites();




  }, []);

  const onRemoveFromFav = (product) => {

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please login to add products to favourites");
      return;
    }
    const response = axios.post("http://localhost:5000/api/favourites/remove", {
      userId: user.UserId,
      productId: product.ProductId,
    });
    response.then((res) => {
      if (res.status === 200) {
        alert(res.data.message);
        if (res.data.message === "Removed From Favourite") {
          setFavourites(favourites.filter((fav) => fav.ProductId !== product.ProductId));
        }
      } else {
        alert("Failed to remove product from favourites");
      }
    }).catch((err) => {
      alert("Failed to remove product from favourites");
    });

  }


  return (
    <div className="section">
      <h2>Favourites</h2>
      <div className="products-container">
        {favourites.map((product) => (
          <div key={product.ProductId} className="product-card">
            <img src={product.ImageUrl} alt={product.Name} />
            <h3>{product.Name}</h3>
            <p>{product.Description}</p>
            <p>${product.Price}</p>
        <button className="add-to-cart-btn" onClick={() => onRemoveFromFav(product)}>
          Remove from Favourites
        </button>
          </div>
        ))}

      </div>
    </div>
  );

};

export default Favourites;
