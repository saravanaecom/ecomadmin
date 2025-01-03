import React, { useState, useEffect } from "react";
import Slider from "../components/sidebar";
import { fetchSaleOrderview } from "../services/Order";
import { useNavigate } from "react-router-dom";
import { GrEdit } from "react-icons/gr";

const Orders = () => {
  const today = new Date().toISOString().split("T")[0];
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [status, setStatus] = useState("All");
  const [branchId, setBranchId] = useState("");
  const [branches, setBranches] = useState([]); 
  const [orders, setOrders] = useState([]);
  const [Comid, setCompanyId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10; 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  const Status1 = ["All", "Pending", "Cancel", "Accepted", "Delivered"];

  useEffect(() => {
    const adminuserid = localStorage.getItem("adminuserid");
    if (adminuserid) {
      setCompanyId(Number(adminuserid));
    } else {
      console.error("Company ID not found in localStorage");
    }

   
    setBranches([
      { id: 1, name: "Tamil Supermarket" },
     
    ]);
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

    setLoading(true);
    setError(null);

    try {
      const data = await fetchSaleOrderview(objlist);
      if (data && Array.isArray(data)) {
        localStorage.setItem("ordereditdetails",JSON.stringify(data));
        setOrders(data);
        console.log(data)
      } else {
        throw new Error("Unexpected API response");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (id) => {
  
    navigate(`/OrderEdit/${id}`);
  }
  const handleApplyClick = () => {
    if (!Comid) {
      console.error("Company ID is missing. Cannot fetch orders.");
      return;
    }
    fetchOrders();
  };

  const handlePageChange = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    } else if (direction === "next" && currentPage < Math.ceil(orders.length / rowsPerPage)) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const paginatedOrders = orders.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="flex">
      <div className="flex-shrink-0">
        <Slider />
      </div>
      <div className="flex-1 p-6 bg-gray-50">
        <div className="bg-white rounded-lg shadow p-6">
          <h5 className="text-lg font-semibold mb-4">Orders</h5>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium">From Date</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="mt-1 block w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">To Date</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="mt-1 block w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Order Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 block w-full p-2 border rounded"
              >
                {Status1.map((option, idx) => (
                  <option key={idx} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            {/* <div>
              <label className="block text-sm font-medium">Branch</label>
              <select
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                className="mt-1 block w-full p-2 border rounded"
              >
                <option value="">All Branches</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div> */}
          </div>

          <button
            onClick={handleApplyClick}
            className="px-4 py-2 bg-[var(--primary-button-bg)] text-white rounded hover:bg-blue-600"
          >
            Apply Filters
          </button>

         
          <div className="overflow-x-auto px-6 py-4">
  {loading ? (
    <p className="text-center text-gray-500">Loading...</p>
  ) : error ? (
    <p className="text-center text-red-500">{error}</p>
  ) : (
    <table className="min-w-full table-auto border-separate border-spacing-0 neumorphism-table">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order No</th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order Date</th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment Type</th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Delivery Date</th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
        </tr>
      </thead>
      <tbody className="bg-white">
        {paginatedOrders.map((order, idx) => (
          <React.Fragment key={order.Id}>
            <tr className="hover:bg-gray-50 transition duration-300 ease-in-out">
              <td className="px-6 py-4 text-sm font-medium text-gray-700">{order.OrderNo}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-700">
              {new Date(order.OrderDate).toLocaleDateString('en-GB')}</td>
              {console.log(order)}
              <td className="px-6 py-4 text-sm font-medium text-gray-700">{order.CustomerName}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-700">{order.OrderType}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-700">₹{order.NetAmt}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-700">
                  {new Date(order.DeliveryDate).toLocaleDateString('en-GB')}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-700">
                {order.orderstatus}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-700 flex space-x-4">
                {/* Edit Button */}
                <button    onClick={() => handleNavigate(order.Id)}
                  className="flex items-center px-3 py-1 bg-blue-100 text-blue-600 rounded-2xl hover:bg-blue-200 transition duration-300"
                >
              <GrEdit className="mr-1" />
              <span>Edit</span>
                </button>

             

                {/* Delete Button */}
           
              </td>
            </tr>
            {/* Horizontal Line */}
            <tr>
              <td colSpan="8" className="border-b border-gray-300"></td>
            </tr>
          </React.Fragment>
        ))}
      </tbody>
    </table>
  )}
</div>


   
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => handlePageChange("prev")}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            <span>Page {currentPage}</span>
            <button
              onClick={() => handlePageChange("next")}
              disabled={currentPage >= Math.ceil(orders.length / rowsPerPage)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
