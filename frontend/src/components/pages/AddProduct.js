import React, { useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { Form, Button, Container, Col, Row } from 'react-bootstrap';
import Footer from "./Footer";

const AddProduct = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    title: "",
    description: "",
    price: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageToDisplay, setImagetoDisplay] = useState(null);

  const [errMsg, setErrMsg] = useState({
    title: "",
    description: "",
    price: "",
    image: ""
  });

  const submitHandler = async (e) => {
    e.preventDefault()
    errMsg["title"] = false
    errMsg["description"] = false
    errMsg["price"] = false
    errMsg["image"] = false

    if (data.title == "") {
      setErrMsg({ ...errMsg, title: true })
      return;
    }
    if (data.description == "") {
      setErrMsg({ ...errMsg, description: true })
      return;
    }
    if (data.price == "") {
      setErrMsg({ ...errMsg, price: true })
      return;
    }
    if (!selectedImage) {
      setErrMsg({ ...errMsg, image: true })
      return;
    }

    let formData = new FormData();

    formData.append('title', data.title);
    formData.append('image', selectedImage);
    formData.append('description', data.description);
    formData.append('price', Number(data.price));


    try {
      const response = await Axios.post('http://localhost:8000/add-Product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status == 200) {
        //success
        setData({
          title: "",
          description: "",
          price: "",
        });
        setSelectedImage(null);
        setImagetoDisplay(null)
        alert("Product created successfully");
        navigate("/Admin")
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message || "something went wrong")
    }
  }

  const handleOnChnage = (e) => {
    const value = e.target.value
    const name = e.target.name
    setData({ ...data, [name]: value })
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagetoDisplay(imageUrl)
      setSelectedImage(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagetoDisplay(null)
  };

  return (
    <div className="theme-bg height_full">
      <Header></Header>
      <Container className="mt-5">
        <h2 className="text-center mb-4">Product Form</h2>
        <Form onSubmit={submitHandler}>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group controlId="title">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text" value={data.title} onChange={handleOnChnage} name="title"
                  required
                />
                {errMsg.title && <span className="err-msg">Title  is required</span>}
              </Form.Group>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Group controlId="price">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="text" value={data.price} onChange={handleOnChnage} name="price"

                  required
                />
                {errMsg.price && <span className="err-msg">Price  is required</span>}

              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12} className="mb-3">
              <Form.Group controlId="description">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  type="text" value={data.description} onChange={handleOnChnage} name="description"
                  required
                />
                {errMsg.description && <span className="err-msg">Description  is required</span>}

              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12} className="mb-3">
              {imageToDisplay ? (
                <div className="image-preview">
                  <img src={imageToDisplay} alt="Selected" className="selected_img" />
                  <button className="remove-button" onClick={removeImage}>Remove</button>
                </div>
              ) : (
                <Form.Group controlId="image">
                  <Form.Label>Upload Image</Form.Label>
                  <Form.Control
                    type="file"
                    name="image"
                    onChange={handleImageChange}
                    accept="image/*"
                    required
                  />
                </Form.Group>
              )}
              {errMsg.image && <span className="err-msg">Image  is required</span>}
            </Col>
          </Row>

          <Button onClick={submitHandler} variant="primary" type="submit" className="w-100 mb-100">
            Submit
          </Button>
        </Form>
      </Container>

      <Footer />
    </div >
  );
};
export default AddProduct;
