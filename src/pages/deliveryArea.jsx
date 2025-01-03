import React, { useState, useEffect } from "react";
import Slider from "../components/sidebar";
import { useNavigate } from 'react-router-dom';
import { fetchSelectDeliveryarea ,DeleteArea} from "../services/addDeliveryArea";

const DeliveryArea = () => {
  const [adminId, setAdminId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState(10);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const adminUserId = JSON.parse(localStorage.getItem("adminuserid"));
    if (!adminUserId) {
      alert("Session Closed. Please Login Again!");
      navigate("/");
    } else {
      setAdminId(Number(adminUserId));
    }
  }, [navigate]);

  useEffect(() => {
    if (adminId) {
      setLoading(true);
      const fetchDelivery = async () => {
        try {
          const DeliveryAreaData = await fetchSelectDeliveryarea(adminId);
          localStorage.setItem("Deliveryarea", JSON.stringify(DeliveryAreaData));
          setFilteredProducts(DeliveryAreaData);
          setTotalPages(Math.ceil(DeliveryAreaData.length / rows));
        } catch (error) {
          console.error("Failed to fetch DeliveryArea", error);
        } finally {
          setLoading(false);
        }
      };
      fetchDelivery();
    }
  }, [adminId, rows]);

  const handleAddDelivery = () => {
    navigate('/AddDeliveryArea/:id');
  };


  const handleEdit = (id) => {
    navigate(`/AddDeliveryArea/${id}`);
  };

  const handleDeleteClick = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this coupon?");
    if (!confirmDelete) return;

    try {
      const isDeleted = await DeleteArea(id);

      if (isDeleted) {
        setFilteredProducts((prevCoupons) =>
          prevCoupons.filter((coupon) => coupon.Id !== id)
        );
        alert("Aera deleted successfully.");
      } else {
        alert("Failed to delete the coupon. Please try again.");
      }
    } catch (error) {
      alert("Error deleting the coupon: " + error.message);
    }
  };






  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="flex-shrink-0">
        <Slider />
      </div>

      {/* Main Content */}
      <div className="flex-grow p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">Delivery Area</h1>
          <button
            onClick={handleAddDelivery}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition duration-300"
          >
            + Add Pincode
          </button>
        </div>

        {/* Table Container */}
        <div className="bg-white shadow-md rounded-md overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <span className="text-lg">Loading...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto text-sm">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-4 py-2 text-left">S. No.</th>
                    <th className="px-4 py-2 text-left">Pincode</th>
                    <th className="px-4 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, index) => (
                    <tr
                      key={index}
                      className={`border-b ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-gray-100 transition`}
                    >
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{product.pincode}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleEdit(product.Id)}
                          className="px-2 py-1 text-white bg-green-500 rounded-md hover:bg-green-400 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(product.Id)}
                          className="px-2 py-1 text-white bg-red-500 rounded-md hover:bg-red-400 ml-2 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination (Optional) */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <button className="px-3 py-1 bg-gray-200 rounded-md mx-1 hover:bg-gray-300">Prev</button>
            <button className="px-3 py-1 bg-gray-200 rounded-md mx-1 hover:bg-gray-300">Next</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryArea;
