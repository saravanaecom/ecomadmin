import Slider from "../components/sidebar";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetcDeliveryTime, deleteDeliveryTime } from "../services/DeliveryTime";
import { updatesaleorder } from '../services/Order';

const OrderEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [orderDetails, setOrderDetails] = useState(null);
  const [deliverytime, setDeliverytime] = useState([]);
  const [adminId, setAdminId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState("");
  const [status, setStatus] = useState("0");
  const [deliverydate, setDeliverydate] = useState("");

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  useEffect(() => {
    const adminUserId = JSON.parse(localStorage.getItem("adminuserid"));
    if (!adminUserId) {
      alert("Session Closed. Please Login Again!");
      setTimeout(() => navigate("/"), 2000);
    } else {
      setAdminId(Number(adminUserId));
    }
  }, [navigate]);

  useEffect(() => {
    const orderData = JSON.parse(localStorage.getItem("ordereditdetails"));
    if (orderData) {
      const selectedOrder = orderData.find((order) => order.Id === parseInt(id, 10));
      if (selectedOrder) {
        setOrderDetails(selectedOrder);
      } else {
        navigate("/Admin/OrderPanel");
      }
    } else {
      navigate("/Admin/OrderPanel");
    }
  }, [id, navigate]);

  useEffect(() => {
    if (adminId) {
      fetchDeliveryTimeData();
    }
  }, [adminId]);

  const fetchDeliveryTimeData = async () => {
    try {
      const data = await fetcDeliveryTime(adminId);
      setDeliverytime(data || []);
    } catch (error) {
      setError("Error fetching delivery time data: " + error.message);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const Pid = parseInt(id);
    const DD1 = selectedDeliveryTime;
    const DD = deliverydate;
    const objlist = {
      temp: status,
      deliveryTime: selectedDeliveryTime,
      deliverydate: deliverydate,
    };

    try {
      const success = await updatesaleorder(adminId, Pid, status, DD, DD1);
      if (success) {
        alert("Order updated successfully!");
        navigate(`/Order`);
      } else {
        setErrorMessage("Failed to update the order.");
      }
    } catch (error) {
      console.error("Error during order update:", error);
      setErrorMessage("An error occurred while updating the order.");
    } finally {
      setLoading(false);
    } 
  };

  if (!orderDetails) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <p>Loading...</p>
      </div>
    );
  }

  const {
    OrderNo,
    OrderDate,
    DeliveryType,
    OrderType,
    Grossamt,
    DeliveryFees,
    CouponDiscount,
    WalletAmount,
    CustomerName,
    DeliveryDate: OrderDeliveryDate,
    Address1,
    Address2,
    City,
    Pincode,
    MobileNo,
    OrderDetails,
  } = orderDetails;

  const totalAmount = (
    Number(Grossamt || 0) +
    Number(DeliveryFees || 0) - 
    Number(CouponDiscount || 0) - 
    Number(WalletAmount || 0)
  ).toFixed(2);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-shrink-0">
        <Slider />
      </div>
      <div className="py-6 w-full bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-white shadow-md rounded-lg">
            <div className="px-6 py-4 border-b">
              <h5 className="text-lg font-bold">Invoice</h5>
            </div>

            <div className="px-6 py-4">
            <div className="p-6 bg-white shadow-md rounded-lg">
  <div className="flex flex-wrap items-start justify-between gap-6">
    {/* Invoice Header */}
    <div className="w-full">
      <h2 className="text-3xl font-bold text-gray-800">Invoice</h2>
      <span
        id="OrderId"
        className="bg-green-100 text-green-700 text-sm font-medium px-4 py-2 rounded-full inline-block mt-2"
      >
        Order ID: {OrderNo}
      </span>
    </div>

    {/* Content Section */}
    <div className="w-full lg:flex lg:gap-6">
      {/* Order Details */}
      <div className="lg:w-1/2">
        <p className="text-gray-600">
          <strong className="text-gray-800">Order Date:</strong>{" "}
          <span>{new Date(OrderDate).toLocaleDateString()}</span>
        </p>
        <p className="text-gray-600 mt-2">
          <strong className="text-gray-800">Delivery Type:</strong>{" "}
          <span>{DeliveryType || "--"}</span>
        </p>
        <p className="text-gray-600 mt-2">
          <strong className="text-gray-800">Payment Type:</strong>{" "}
          <span>{OrderType || "--"}</span>
        </p>
      </div>

      {/* Delivery Address */}
      <div className="lg:w-1/2 lg:text-right">
        <p className="text-gray-600">
          <strong className="text-gray-800">Delivery Address:</strong>{" "}
          <span>
            {`${CustomerName || ""}, ${Address1 || ""}, ${Address2 || ""}, ${
              City || ""
            } ${Pincode || ""}`}
          </span>
        </p>
        <p className="text-gray-600 mt-2">
          <strong className="text-gray-800">Mobile Number:</strong>{" "}
          <span>{MobileNo || "--"}</span>
        </p>
      </div>
    </div>
  </div>
</div>

              <div className="mt-6 overflow-auto">
                {OrderDetails && OrderDetails.length > 0 ? (
                  <table className="w-full border-collapse border border-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border px-4 py-2">S.No</th>
                        <th className="border px-4 py-2">Product Description</th>
                        <th className="border px-4 py-2">MRP</th>
                        <th className="border px-4 py-2">Price</th>
                        <th className="border px-4 py-2">No of items</th>
                        <th className="border px-4 py-2">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {OrderDetails.map((item, index) => (
                        <tr key={index}>
                          <td className="border px-4 py-2">{index + 1}</td>
                          <td className="border px-4 py-2">{item.ProductName}</td>
                          <td className="border px-4 py-2">{Number(item.MRP).toFixed(2)}</td>
                          <td className="border px-4 py-2">{Number(item.SaleRate).toFixed(2)}</td>
                          <td className="border px-4 py-2">{item.ItemQty}</td>
                          <td className="border px-4 py-2">{(Number(item.SaleRate) * Number(item.ItemQty)).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center text-red-500 font-semibold text-lg">
                    No data to display!
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-6 space-y-2">
                <div className="w-full lg:w-1/3">
                  <div className="flex justify-between">
                    <strong>Sub Total:</strong>
                    <span>{Grossamt ? Number(Grossamt).toFixed(2) : "0.00"}</span>
                  </div>
                  <div className="flex justify-between">
                    <strong>Delivery Fees (+):</strong>
                    <span>{DeliveryFees ? Number(DeliveryFees).toFixed(2) : "0.00"}</span>
                  </div>
                  <div className="flex justify-between">
                    <strong>Coupon Discount (-):</strong>
                    <span>{CouponDiscount ? Number(CouponDiscount).toFixed(2) : "0.00"}</span>
                  </div>
                  <div className="flex justify-between">
                    <strong>Total Amount:</strong>
                    <span>{totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between px-6 py-4 bg-gray-100">
              <div className="w-full lg:w-1/4 mb-4 lg:mb-0">
                <label className="block font-semibold mb-1">Delivery Date*</label>
                <input
                  type="date"
                  className="w-full border px-3 py-2 rounded-md"
                  value={deliverydate || (OrderDeliveryDate ? new Date(OrderDeliveryDate).toISOString().split('T')[0] : "")}
                  onChange={(e) => setDeliverydate(e.target.value)}
                />
              </div>

              <div className="w-full lg:w-1/4 mb-4 lg:mb-0">
                <label className="block font-semibold mb-1">Delivery Time*</label>
                <select
                  value={selectedDeliveryTime || ""}
                  onChange={(e) => setSelectedDeliveryTime(e.target.value)}
                  className="w-full border px-3 py-2 rounded-md"
                >
                  <option value="">Select Delivery Time</option>
                  {deliverytime.map((time) => (
                    <option key={time.id} value={time.id}>{time.time}</option>
                  ))}
                </select>
              </div>

              <div className="w-full lg:w-1/4 mb-4 lg:mb-0">
                <label className="block font-semibold mb-1">Status*</label>
                <select
                  value={status || ""}
                  onChange={handleStatusChange}
                  className="w-full border px-3 py-2 rounded-md"
                >
                <option value="0">Pending</option>
                <option value="-1">Cancel</option>
                <option value="1">Accepted</option>
                <option value="2">Delivered</option>
                </select>
              </div>

              <div className="w-full lg:w-1/4">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className={`w-full mt-4 bg-blue-500 text-white py-2 rounded-md ${loading ? 'opacity-50' : ''}`}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>

            {errorMessage && <div className="text-red-500 text-center mt-4">{errorMessage}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderEdit;
