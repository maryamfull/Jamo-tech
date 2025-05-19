"use client";

import { useState, useEffect } from "react";
import Axios from "axios";
import Header from "./Header";
import { Link, useNavigate } from "react-router-dom";
import Footer from "./Footer";

function CartPage() {
  const navigate = useNavigate();
  const [ProductListing, setProduct] = useState([]);
  const [totalPrice, setTotalPrice] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const cartItems = localStorage.getItem("cartItems") || [];
    try {
      const response = await Axios.get(`http://localhost:8000/get-all-products`);
      if (response.status === 200) {
        const matchedObjects = response?.data?.data.filter((item) =>
          cartItems.includes(item._id)
        );
        const totalPrice = matchedObjects.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        setTotalPrice(totalPrice);
        setProduct(matchedObjects);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const onDeleteClick = (id) => {
    const newArr = ProductListing.filter((item) => item._id !== id);
    const idsArray = newArr.map((item) => item._id);
    setProduct(newArr);
    localStorage.setItem("cartItems", idsArray);
  };

  const updateQuantity = (id, change) => {
    // Find the item in the ProductListing array
    const updatedProducts = ProductListing.map((item) => {
      if (item._id === id) {
        const updatedQuantity = item.quantity + change;
        if (updatedQuantity >= 1) {
          item.quantity = updatedQuantity; // Update the quantity only if it is greater than or equal to 1
        }
      }
      return item;
    });

    // Update the state with the new product list
    setProduct(updatedProducts);

    // Update total price
    const totalPrice = updatedProducts.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotalPrice(totalPrice);

    // Update the cart in localStorage with new quantities
    const idsArray = updatedProducts.map((item) => item._id);
    localStorage.setItem("cartItems", idsArray);
  };

  const handleRoute = () => {
    navigate('/CustomerDetails', {
      state: {
        ProductListing: ProductListing,
      },
    });
  };

  return (
    <div className="theme-bg height_full">
      <Header />
      <div style={{ backgroundColor: "#cfe2ff" }} className="p-3 rounded container">
        <h2 className="mb-4">Cart:</h2>

        {ProductListing.length > 0 ? (
          <>
            {ProductListing.map((item) => (
              <div
                key={item._id}
                className="d-flex align-items-center bg-white p-3 rounded mb-3"
              >
                <div style={{ width: "100px", height: "100px" }} className="me-3 p-1">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <p className="cart-title">{item.title}</p>

                <div className="d-flex align-items-center me-3">
                  <button
                    className="btn"
                    style={{ backgroundColor: "#f8d7da" }}
                    onClick={() => updateQuantity(item._id, -1)}
                  >
                    -
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button
                    className="btn"
                    style={{ backgroundColor: "#f8d7da" }}
                    onClick={() => updateQuantity(item._id, 1)}
                  >
                    +
                  </button>
                </div>

                <div
                  className="px-2 me-3 rounded"
                  style={{ backgroundColor: "#d1e7dd", color: "#0f5132" }}
                >
                  {item.price} OMR.
                </div>

                <button
                  className="btn py-1"
                  style={{ backgroundColor: "#cfe2ff" }}
                  onClick={() => onDeleteClick(item._id)}
                >
                  Delete
                </button>
              </div>
            ))}

            <div className="d-flex justify-content-between align-items-center mt-4">
              <div>
                <strong>Total Price: {totalPrice} OMR.</strong>
              </div>

              <button
                onClick={handleRoute}
                className="btn"
                style={{ backgroundColor: "#e2d9f3" }}
              >
                Delivery
              </button>
            </div>
          </>
        ) : (
          <div className="alert alert-info">
            Your cart is empty.{" "}
            <Link to={"/products"} className="btn btn-link p-0">
              Continue shopping
            </Link>
          </div>
        )}
      </div>
      <Footer />

    </div>
  );
}

export default CartPage;
