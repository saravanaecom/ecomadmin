import React, { useState, useEffect } from "react";
import { fetchSaleOrderview } from "../services/DashBordServices";
import '../index.css'

const RecentOrders = () => {
  const today = new Date().toISOString().split("T")[0];
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [status, setStatus] = useState("All");
  const [orders, setOrders] = useState([]);
  const [Comid, setCompanyId] = useState(null);
  const Status1 = ["All", "Pending", "Cancel", "Accepted", "Delivered"];

  useEffect(() => {
    const adminuserid = localStorage.getItem("adminuserid");
    if (adminuserid) {
      setCompanyId(Number(adminuserid)); 
    } else {
      console.error("ComID  not found in localStorage");
    }
  }, []);

  const fetchOrders = async () => {
    const objlist = [
      {
        Id: 0,
        Comid: Comid,
        fromdate: fromDate,
        todate: toDate,
        Type: status,
      },
    ];

    try {
      const data = await fetchSaleOrderview(objlist);
      if (data && Array.isArray(data)) {
        setOrders(data); 
      } else {
        console.error("Unexpected API response:", data);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  const handleApplyClick = () => {
    if (!Comid) {
      console.error("Company ID is missing. Cannot fetch orders.");
      return;
    }
    fetchOrders();
  };

  return (
    <div className="container mx-auto  px-4 py-8" style={{ position: "relative", right: "5px", top:"45px", width: "1200px", zIndex: "-10" }}>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gray-200 p-6">
          <h5 className="text-2xl font-semibold text-gray-800">Recent Orders</h5>
        </div>
        <div className="p-6">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex flex-col w-full sm:w-1/4">
              <label className="text-sm font-medium text-gray-600 mb-2">From Date:</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col w-full sm:w-1/4">
              <label className="text-sm font-medium text-gray-600 mb-2">To Date:</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col w-full sm:w-1/4">
              <label className="text-sm font-medium text-gray-600 mb-2">Status:</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Status1.map((statusOption, index) => (
                  <option key={index} value={statusOption}>
                    {statusOption}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-center items-center w-full sm:w-auto">
              <button
                className="py-3 px-6 bg-[var(--primary-button-bg)] text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={handleApplyClick}
              >
                Apply!
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto p-6">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left">OrderNo</th>
                <th className="p-3 text-left">OrderDate</th>
                <th className="p-3 text-left">CustomerName</th>
            
                <th className="p-3 text-left">PaymentType</th>
                <th className="p-3 text-left">NetAmount</th>
                <th className="p-3 text-left">DeliverDate</th>
                
                <th className="p-3 text-left">OrderStatus</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index}>
                  <td>{order.OrderNo}</td>
                
                  <td> {new Date(order.OrderDate).toISOString().split('T')[0]}</td>
                  <td>{order.CustomerName}</td>
               
                  <td>{order.OrderType}</td>
                  <td>₹{order.NetAmt}</td>
                  <td> {new Date(order.DeliveryDate).toISOString().split('T')[0]}</td>
               
                  <td>{order.orderstatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecentOrders;
