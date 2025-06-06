import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
const AdminHeader = () => {
  const navigate = useNavigate();
  const [loginStatus, setLoginStatus] = useState(false);
  const handleLogout = () => {
    localStorage.clear()
    navigate("/login")
    window.location.reload()
  }
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    setLoginStatus(isLoggedIn)
  }, [])
  return (
    <div className="header header-bg">
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img
              src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSeW1XoHqyqpO3d3EFqK2aC5kOwO3Q3rEVXNz1kv9JqYvS1rOSY"
              alt="Logo"
              width="100"
              height="auto"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link className="mr-4" as={Link} to="/Admin">
                Home
              </Nav.Link>
              <Nav.Link className="mr-4" as={Link} to="/sales">
                Sales
              </Nav.Link>
              {loginStatus &&
                <Nav.Link className="mr-4" as={Link} to="/AddProduct">
                  Add Product
                </Nav.Link>
              }
              {!loginStatus &&
                <Nav.Link className="mr-4" to="/login">
                  Login
                </Nav.Link>
              }
              <Nav.Link className="mr-4" as={Link} to="/manage-orders">
                Manage Orders
              </Nav.Link>
              {loginStatus &&
                <Nav.Link className="mr-4" onClick={handleLogout}>
                  Logout
                </Nav.Link>
              }
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default AdminHeader;
