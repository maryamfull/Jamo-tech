import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UpdateOrderPage from './components/pages/UpdateOrderPage';
import SalesPage from './components/pages/SalesPage';
import ManageOrdersPage from './components/pages/ManageOrdersPage';
import AdminHomePage from './components/pages/AdminHomePage';
import CustomerDetailsPage from './components/pages/CustomerDetailsPage';
import CartPage from './components/pages/CartPage';
import ProductsPage from './components/pages/ProductsPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/pages/Login';
import SignUp from './components/pages/SignUp';
import AddProduct from './components/pages/AddProduct';
import HomePage from './components/pages/Home';
import FeedbackForm from './components/pages/FeedbackForm';
import ProductFeedbackCard from './components/pages/ShowFeedback';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/feedback/:productID" element={<FeedbackForm />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/CustomerDetails" element={<CustomerDetailsPage />} />
          <Route path="/feedback/:productID" element={<ProductFeedbackCard />} />


          {/* Admin Routes */}
          <Route path="/Admin" element={<AdminHomePage />} />
          <Route path="/AddProduct" element={<AddProduct />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/manage-orders" element={<ManageOrdersPage />} />
          <Route path="/update-order" element={<UpdateOrderPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;