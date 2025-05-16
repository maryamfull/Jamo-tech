"use client"
import Axios from "axios";
import { useEffect, useState } from "react"
import { Table } from 'react-bootstrap';
import AdminHeader from "./Admin_Header";

function SalesPage() {
  const [data, setData] = useState([])

  useEffect(() => {
    fetchDate()
  }, [])

  const [totalPrice, setTotalPrice] = useState(0); // Store the total price

  const fetchDate = async () => {
    try {
      const response = await Axios.get(`http://localhost:8000/orders`);
      if (response.status === 200) {
        const allOrders = response?.data?.products;
        setData(allOrders);
        setTotalPrice(response.data.totalAmount); // Store the calculated total price
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="theme-bg height_full">
      <AdminHeader />
      <div className="container mt-5">
        <h2 className="text-center mb-4">Sales Data</h2>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Item Code</th>
              <th>Quantity</th>
              <th>Price (per unit)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((sale, index) =>
              <tr key={index}>
                <td>{sale._id}</td>
                <td>{sale.quantity}</td>
                <td>OMR: {sale.priceAtPurchase}</td>
              </tr>
            )}
            <tr>
              <td colSpan="2" className="text-right"><strong>Total Amount</strong></td>
              <td>OMR {totalPrice}</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  )
}

export default SalesPage
