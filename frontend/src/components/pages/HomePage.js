import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="container py-4">
      <div className="text-center my-4">
        <img 
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-04-16%20at%2018.47.09_f776ae5a.jpg-CUF8oNCKRLdaTd1ob51vIOVpbRiOhN.jpeg" 
          alt="JAMO TECH Logo" 
          style={{ maxWidth: "200px", height: "auto" }} 
        />
      </div>

      <h1 className="text-center mb-4">Mobile Phones at Best Prices in Oman</h1>

      <div className="row justify-content-center mb-4">
        <div className="col-md-6">
          <div className="d-grid gap-3">
            <Link to="/products" className="btn btn-primary">Products Page</Link>
            <Link to="/cart" className="btn btn-info">Your Cart</Link>
            <Link to="/admin" className="btn btn-secondary">Admin Area</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;