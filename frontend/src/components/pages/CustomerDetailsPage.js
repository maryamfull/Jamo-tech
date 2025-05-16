import React, { useState } from "react";
import Header from "./Header";
import Axios from "axios";
import { Form, Button, Container, Col, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "./Footer";
function CustomerDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { ProductListing } = location.state || {};

  // State for form inputs
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNo: '',
    address: ''
  });

  // State for form errors
  const [errors, setErrors] = useState({
    customerName: '',
    phoneNo: '',
    address: ''
  });

  // Input change handler
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: '' })); // clear error on change
  };


  // Form validation
  const validate = () => {
    const newErrors = {};
    if (!formData.customerName.trim()) newErrors.customerName = "Customer name is required";
    if (!formData.phoneNo.trim()) newErrors.phoneNo = "Phone number is required";
    else if (!/^\d{10,15}$/.test(formData.phoneNo)) newErrors.phoneNo = "Invalid phone number";
    if (!formData.address.trim()) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitHandler = async (e) => {
    e.preventDefault()
    if (!validate()) return;
    const userId = localStorage.getItem("userId");
    const flowerList = ProductListing.map(item => item._id);
    const flowerListquantity = ProductListing.map(item => item.quantity);

    // Create an array of products with quantity
    const products = flowerList.map((productId, index) => ({
      productId,
      quantity: flowerListquantity[index]
    }));
    try {
      const response = await Axios.post(`http://localhost:8000/buy`, {
        userId,
        products: products,
      });
      if (response.status == 201) {
        localStorage.removeItem("cartItems")
        alert("Products Bought Successfully, Routing to Products Page")
        navigate("/products")
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message || "something went wrong")
    }
  }


  return (
    <div className="theme-bg height_full">
      <Header />

      <Container className="mt-5">
        <h2 className="text-center mb-4">Customer Details:</h2>
        <Form onSubmit={submitHandler}>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group controlId="customerName">
                <Form.Label>Customer Name</Form.Label>
                <Form.Control
                  type="text"
                  className={`form-control ${errors.customerName ? "is-invalid" : ""}`}
                  id="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                />
                {errors.customerName && <div className="invalid-feedback">{errors.customerName}</div>}

              </Form.Group>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Group controlId="phoneNo">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  className={`form-control ${errors.phoneNo ? "is-invalid" : ""}`}
                  id="phoneNo"
                  value={formData.phoneNo}
                  onChange={handleChange}
                />
                {errors.phoneNo && <div className="invalid-feedback">{errors.phoneNo}</div>}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12} className="mb-3">
              <Form.Group controlId="address">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  type="text"
                  className={`form-control ${errors.address ? "is-invalid" : ""}`}
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                />
                {errors.address && <div className="invalid-feedback">{errors.address}</div>}
              </Form.Group>
            </Col>
          </Row>

          <Button onClick={submitHandler} variant="primary" type="submit" className="w-100">
            Submit
          </Button>
        </Form>
      </Container>
      <Footer />
    </div>
  );
}

export default CustomerDetailsPage;