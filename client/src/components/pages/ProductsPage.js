import React, { useEffect, useState, } from "react";
import Axios from "axios";
import Header from "./Header";
import { Link, useNavigate } from "react-router-dom";
import Footer from "./Footer";

function ProductsPage() {
  const [ProductListing, setProduct] = useState([]);
  const [isLogin, setIsLogin] = useState(localStorage.getItem("isLoggedIn"));

  const navigate = useNavigate();
  useEffect(() => {
    fetchDate()
  }, [])

  const fetchDate = async () => {
    try {
      const response = await Axios.get(`http://localhost:8000/get-all-products`);
      if (response.status == 200) {
        setProduct(response?.data?.data)

      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const reactToProduct = async (productId, type) => {
    const userId = localStorage.getItem("userId")

    try {
      const response = await fetch(`http://localhost:8000/product/${productId}/react`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, type }), // type: "like" or "dislike"
      });
      const data = await response.json();

      if (data.status == "success") {
        window.location.reload()
      }
      else {
        alert("Error while like and dislike")
      }

    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  };

  let cartArr = [];

  const handleAddtocart = (id) => {
    const newArr = ProductListing.filter((item) => item._id == id)
    cartArr.push(newArr[0]._id)
    localStorage.setItem("cartItems", JSON.stringify(cartArr))
    alert("Product Added to cart")
  }

  const handleRoute = () => {
    navigate('/cart');
  };

  const handleRouteAddFeedback = (pid) => {
    navigate(`/products/feedback/${pid}`);
  };

  const handleRouteFeedback = (pid) => {
    navigate(`/feedback/${pid}`);
  };

  return (
    <div className="theme-bg height_full">
      <Header></Header>
      <div style={{ backgroundColor: "#f0f4f8" }} className="p-2 p-sm-3 rounded shadow-sm">
        <div style={{ backgroundColor: "#ebf4ff" }} className="p-2 p-sm-3 mt-3 mt-md-4 rounded shadow-sm">
          <h3 className="mb-3" style={{ fontSize: "calc(1.1rem + 0.6vw)", color: "#3c366b" }}>
            Item Page:
          </h3>

          <div className="row g-2 g-md-3">
            {ProductListing.map((product) => (
              <div key={product.id} className="col-12 mb-2 mb-md-3">
                <div className="d-flex flex-column flex-sm-row align-items-center bg-white p-2 p-sm-3 rounded shadow-sm">
                  <div style={{ width: "80px", height: "80px" }} className="mb-2 mb-sm-0 me-sm-3">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "4px" }}
                    />
                  </div>

                  <div className="d-flex flex-column flex-sm-row align-items-center w-100">
                    <div className="text-center text-sm-start mb-2 mb-sm-0 me-sm-3 flex-grow-1">
                      <div style={{ color: "#4a5568", fontWeight: "500" }}>{product.title}</div>
                      <small style={{ color: "#718096" }}>Item Code: {product._id}</small>
                      {isLogin &&
                        <div className="d-flex justify-content-center gap-4 align-items-center my-4">
                          <button
                            className={`btn btn-outline-success like-btn`}
                            onClick={() => reactToProduct(product._id, "like")}
                          >
                            <img src="./images/like.png" className="likesImg" />
                            <i className="fas fa-thumbs-up me-2"></i> Like
                            <span className="badge bg-success ms-2">{product.likes.length}</span>
                          </button>

                          <button
                            className={`btn btn-outline-danger dislike-btn`}
                            onClick={() => reactToProduct(product._id, "dislike")}
                          >
                            <img src="./images/dislike.png" className="likesImg" />
                            <i className="fas fa-thumbs-down me-2"></i> Dislike
                            <span className="badge bg-danger ms-2">{product.dislikes.length}</span>
                          </button>

                          <button
                            className={`btn btn-outline-success like-btn`}
                            onClick={() => handleRouteAddFeedback(product._id)}>
                            <img src="./images/feedback.png" className="likesImg" />
                            <i className="fas fa-thumbs-down me-2"></i>
                            Add Feedback</button>

                          <button
                            className={`btn btn-outline-success like-btn`}
                            onClick={() => handleRouteFeedback(product._id)}>
                            <img src="./images/feedback.png" className="likesImg" />
                            <i className="fas fa-thumbs-down me-2"></i>
                            Show Feedback</button>
                        </div>
                      }
                    </div>

                    <div className="d-flex align-items-center">
                      <div
                        className="px-2 py-1 rounded me-2 me-sm-3"
                        style={{ backgroundColor: "#c6f6d5", color: "#276749" }}
                      >
                        {product.price} OMR.
                      </div>
                      <button
                        className="btn btn-sm btn-md-lg"
                        style={{ backgroundColor: "#667eea", color: "white" }}
                        onClick={() => handleAddtocart(product._id)}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="d-flex justify-content-end mt-3">
            <button className="btn" onClick={handleRoute} style={{ backgroundColor: "#fed7e2", color: "#702459", fontSize: "0.9rem" }}>
              Your Cart
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default ProductsPage
