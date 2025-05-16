import React from "react";
import { useNavigate } from 'react-router-dom';
import AdminHeader from "./Admin_Header";

function AdminHomePage() {
  const navigate = useNavigate();
  return (
    <div className="theme-bg height_full">
      <AdminHeader />
      <div className="container">
        <div className="card">
          <div className="text-center">
            <h1 className="my-4">Mobile Phones at Best Prices in Oman</h1>
            <div className="text-center my-4">
              <img
                src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSeW1XoHqyqpO3d3EFqK2aC5kOwO3Q3rEVXNz1kv9JqYvS1rOSY"
                alt="JAMO TECH Logo"
                style={{ maxWidth: "200px", height: "auto" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHomePage;