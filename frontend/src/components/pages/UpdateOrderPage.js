import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import AdminHeader from "./Admin_Header";

function UpdateOrderPage() {
  const location = useLocation();
  const [user, setUser] = useState({ username: "", email: "", id: "" });
  const { UserOrder } = location.state || {};
  const navigate = useNavigate();

  useEffect(() => {

    setUser({
      id: UserOrder.id,
      username: UserOrder.username,
      email: UserOrder.email,
    });
  }, [UserOrder]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.put(`http://localhost:8000/update-order-details/${user.id}`, {
        username: user.username,
        email: user.email,
      });
      if (response.status == 200) {
        alert(response.data.message);
        navigate(`/manage-orders`)
      }
    } catch (err) {
      alert("Error updating order");
    }
  };
  return (
    <div className="theme-bg height_full">
      <AdminHeader />
      <div className="container py-4">
        <div className="card" style={{ backgroundColor: "#cfe2ff" }}>
          <div className="card-body">
            <h3 className="text-center mb-4">Update Order Details</h3>

            <form>
              <div className="mb-3 row">
                <label htmlFor="itemCode" className="col-sm-3 col-form-label">
                  Item code:
                </label>
                <div className="col-sm-9">
                  <input disabled type="text" value={user.id} className="form-control" id="itemCode" />
                </div>
              </div>

              <div className="mb-3 row">
                <label htmlFor="customerName" className="col-sm-3 col-form-label">
                  Customer name:
                </label>
                <div className="col-sm-9">
                  <input type="text" value={user.username} name="username" onChange={handleChange} className="form-control" id="customerName" />
                </div>
              </div>

              <div className="mb-3 row">
                <label className="col-sm-3 col-form-label">
                  Email:
                </label>
                <div className="col-sm-9">
                  <input type="text" value={user.email} onChange={handleChange} name="email" className="form-control" />
                </div>
              </div>

              <div className="text-center mt-4">
                <button onClick={handleUpdate} type="submit" className="btn btn-primary px-4">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}

export default UpdateOrderPage;