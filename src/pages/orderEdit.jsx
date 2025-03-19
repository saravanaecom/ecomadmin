import Slider from "../components/sidebar";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetcDeliveryTime, deleteDeliveryTime } from "../services/DeliveryTime";
import { updatesaleorder,API_FetchSelectSettingsNew } from '../services/Order';

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
  const [whatsapdata, setwhatsapdata] = useState([]);   
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

        console.log(selectedOrder);
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


  const FetchSelectSettingsNew = async () => {
    try {
        const list = await API_FetchSelectSettingsNew(adminId);
  

        if (Array.isArray(list) && list.length > 0) {
            setwhatsapdata(list); 
    
        } else {
            console.error("Fetched data is not a valid array or is empty.");
            setwhatsapdata([]); 
        }
    } catch (error) {
        setwhatsapdata([]);
        console.error("Error fetching categories:", error);
    }
};


useEffect(() => {
  // Call FetchSelectSettingsNew() just once when the component mounts
  FetchSelectSettingsNew();
}, []);





  const fetchDeliveryTimeData = async () => {
    try {
      const data = await fetcDeliveryTime(adminId);
      console.log(data)
      setDeliverytime(data || []);
    } catch (error) {
      setError("Error fetching delivery time data: " + error.message);
    }
  };



   





  const handleSave = async () => {

    await FetchSelectSettingsNew();
    
    setLoading(true);
    const Pid = parseInt(id);
    const DD1 = selectedDeliveryTime;
    const DD = deliverydate;
    const userMobileNo = orderDetails?.MobileNo || "";
     const objlist = {
      temp: status,
      deliveryTime: selectedDeliveryTime,
      deliverydate: deliverydate,
    };

    try {
      if (whatsapdata.length > 0){
        const { WhatsAppUrl, OwnerMobileNo } = whatsapdata[0]; 

      const success = await updatesaleorder(adminId, Pid, status, DD, DD1, WhatsAppUrl, OwnerMobileNo,userMobileNo);
      if (success) {
        alert("Order updated successfully!");
        navigate(`/Order`);
      } else {
        setErrorMessage("Failed to update the order.");
      }


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
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-900 text-white">
              <h5 className="text-xl font-semibold">Invoice Details</h5>
            </div>

            <div className="p-6 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Invoice Header */}
                <div>
                  <h2 className="text-3xl font-semibold text-gray-800">Invoice #{OrderNo}</h2>
                  <p className="text-gray-600 mt-2">
                    <strong>Order Date:</strong>{" "}
                    {new Date(OrderDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600 mt-2">
                    <strong>Delivery Type:</strong>{" "} 
                    {DeliveryType || "--"}
                  </p>
                  <p className="text-gray-600 mt-2">
                    <strong>Payment Type:</strong>{" "} 
                    {OrderType || "--"}
                  </p>
                </div>

                {/* Delivery Address */}
                <div className="text-right">
                  <p className="text-gray-600">
                    <strong>Customer:</strong> {CustomerName || "--"}
                  </p>
                  <p className="text-gray-600 mt-2">
                    <strong>Address:</strong>{" "}
                    {`${Address1 || ""}, ${Address2 || ""}, ${City || ""}, ${Pincode || ""}`}
                  </p>
                  <p className="text-gray-600 mt-2">
                    <strong>Mobile:</strong> {MobileNo || "--"}
                  </p>
                </div>
              </div>

              {/* Order Details */}
              <div className="mt-6 overflow-x-auto">
                {OrderDetails && OrderDetails.length > 0 ? (
                  <table className="w-full table-auto border-collapse text-sm">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="px-4 py-2 text-left">S.No</th>
                        <th className="px-4 py-2 text-left">Product</th>
                        <th className="px-4 py-2 text-left">MRP</th>
                        <th className="px-4 py-2 text-left">Price</th>
                        <th className="px-4 py-2 text-left">Qty</th>
                        <th className="px-4 py-2 text-left">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {OrderDetails.map((item, index) => (
                        <tr key={index} className="border-t border-gray-200">
                          <td className="px-4 py-2">{index + 1}</td>
                          <td className="px-4 py-2">{item.ProductName}</td>
                          <td className="px-4 py-2">{Number(item.MRP).toFixed(2)}</td>
                          <td className="px-4 py-2">{Number(item.SaleRate).toFixed(2)}</td>
                          <td className="px-4 py-2">{item.ItemQty}</td>
                          <td className="px-4 py-2">{(Number(item.SaleRate) * Number(item.ItemQty)).toFixed(2)}</td>
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

              {/* Summary Section */}
              <div className="mt-6 border-t border-gray-200 pt-4 flex justify-between">
                <div>
                  <div className="flex justify-between">
                    <strong>Sub Total:</strong>
                    <span>{Grossamt ? Number(Grossamt).toFixed(2) : "0.00"}</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <strong>Delivery Fees:</strong>
                    <span>{DeliveryFees ? Number(DeliveryFees).toFixed(2) : "0.00"}</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <strong>Coupon Discount:</strong>
                    <span>{CouponDiscount ? Number(CouponDiscount).toFixed(2) : "0.00"}</span>
                  </div>
                </div>
                <div className="font-semibold">
                  <div className="flex justify-between">
                    <strong>Total Amount:</strong>
                    <span>{totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Update Section */}
            <div className="px-6 py-4 bg-gray-50">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium mb-2">Delivery Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border rounded-md"
                    value={deliverydate || (OrderDeliveryDate ? new Date(OrderDeliveryDate).toISOString().split('T')[0] : "")}
                    onChange={(e) => setDeliverydate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2">Delivery Time</label>
                  <select
                    value={selectedDeliveryTime || ""}
                    onChange={(e) => setSelectedDeliveryTime(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md"
                  >
                    <option value="">Select Delivery Time</option>
                    {deliverytime.map((time) => (
                      <option key={time.id} value={time.id}>{time.time}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-2">Status</label>
                  <select
                    value={status || ""}
                    onChange={handleStatusChange}
                    className="w-full px-4 py-2 border rounded-md"
                  >
                    <option value="0">Pending</option>
                    <option value="-1">Cancelled</option>
                    <option value="1">Accepted</option>
                    <option value="2">Delivered</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className={`px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg ${loading ? 'opacity-50' : ''}`}
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
