import Axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminHeader from "./Admin_Header";
function ManageOrdersPage() {
  const [dataListing, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDate()
  }, [])

  const fetchDate = async () => {
    try {
      const response = await Axios.get(`http://localhost:8000/manage-orders`);
      if (response.status == 200) {
        setData(response?.data?.customers)
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const DeleteOrder = async (item) => {
    try {
      const response = await Axios.delete(`http://localhost:8000/delete-order/${item.id}`);
      if (response.status == 200) {
        alert(response.data.message)
        window.location.reload()
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const HandleUpdate = (item) => {
    navigate(`/update-order`, {
      state: {
        UserOrder: item
      }
    })
  }

  return (
    <div className="theme-bg height_full">
      <AdminHeader />

      <div className="container py-4">

        <div className="card" style={{ backgroundColor: "#cfe2ff" }}>
          <div className="card-body">
            <h2 className="mb-3">Manage Orders</h2>
            <div className="table-responsive">
              <table className="table table-bordered bg-white">
                <thead>
                  <tr>
                    <th className="d-none d-sm-table-cell">Item Code</th>
                    <th>Customer Name</th>
                    <th className="d-none d-md-table-cell">Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dataListing?.map((item) =>
                    <tr>
                      <td className="d-none d-sm-table-cell">{item.id}</td>
                      <td className="d-none d-md-table-cell">
                        {item.username}
                      </td>
                      <td className="d-none d-md-table-cell">{item.email}</td>
                      <td>
                        <div className="d-flex flex-column flex-sm-row">
                          <button className="btn btn-secondary btn-sm mb-2 mb-sm-0 me-sm-2" onClick={() => DeleteOrder(item)}>Delete</button>
                          <button className="btn btn-primary btn-sm" onClick={() => HandleUpdate(item)}>Update</button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageOrdersPage
