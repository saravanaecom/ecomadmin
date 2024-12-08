import React, { useState, useEffect } from "react";
import { fetcDeliveryTime, deleteDeliveryTime } from "../services/DeliveryTime";
import Slider from "../components/sidebar";
import { useNavigate } from "react-router-dom";
import ErrorModal from "../components/error";
import SuccessModal from "../components/sucessmodel";
import { MdDelete } from "react-icons/md";
import { GrEdit } from "react-icons/gr";

const DeliveryTime = () => {
  const [rows, setRows] = useState(5); 
  const [deliveryData, setDeliveryData] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);
  const [adminId, setAdminId] = useState(null);
  const [areaData, setAreaData] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);  
  const [error, setError] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();

  const handleRowChange = (e) => {
    setRows(parseInt(e.target.value));
  };

  const showError = (message) => {
    setModalMessage(message);
    setIsErrorModalOpen(true);
  };

  const showSuccess = (message) => {
    setModalMessage(message);
    setIsSuccessModalOpen(true);
  };

  const closeModal = () => {
    setIsErrorModalOpen(false);
    setIsSuccessModalOpen(false);
    setModalMessage("");
  };

  const handlePageChange = (direction) => {
    if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    const adminUserId = JSON.parse(localStorage.getItem("adminuserid"));
    if (!adminUserId) {
      alert("Session Closed. Please Login Again!");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } else {
      setAdminId(Number(adminUserId));
    }
  }, [navigate]);

  const handleNavigate = (id) => {
    navigate(`/AddDeliveryTime/${id}`);
  };

  useEffect(() => {
    if (adminId) {
      fetchAreaData();
    }
  }, [adminId]);

  const fetchAreaData = async () => {
    setLoading(true);
    try {
      const data = await fetcDeliveryTime(adminId);
      if (data) {
        setAreaData(data);
        localStorage.setItem("AdminDeliveryTime", JSON.stringify(data));
      }
    } catch (error) {
      setError("Error fetching area data: " + error.message);
      showError("Failed to fetch delivery times. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      const isDeleted = await deleteDeliveryTime(id);
      if (isDeleted) {
        setAreaData((prevAreaData) => prevAreaData.filter((area) => area.Id !== id));
        showSuccess("Delivery time deleted successfully.");
      } else {
        showError("Failed to delete the area. Please try again.");
      }
    } catch (error) {
      showError("Error deleting the area: " + error.message);
    }
  };

  const startIndex = (currentPage - 1) * rows;
  const currentRows = areaData.slice(startIndex, startIndex + rows);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-shrink-0">
        <Slider />
      </div>
      <div className="w-full p-6">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h5 className="text-2xl font-bold">Delivery Time Panel</h5>
            <button
              className="bg-blue-800 hover:bg-blue-400 text-white px-4 py-2 rounded transition-all"
              onClick={() => navigate("/AddDeliveryTime/:id")}
            >
              <i className="bi bi-plus-square-dotted pe-2"></i> Add Delivery Time
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <label className="text-gray-700 font-medium">Select Number Of Rows</label>
            <select
              className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={rows}
              onChange={handleRowChange}
            >
              <option value="1000">Show ALL Rows</option>
              <option value="5">5</option>
              <option value="10">10</option>
            </select>
          </div>

          <div className="overflow-x-auto px-6 py-4">
  <table className="min-w-full table-auto border-separate border-spacing-0 neumorphism-table">
    <thead className="bg-gray-100">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">S.No</th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden">Id</th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Delivery Time</th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
      </tr>
    </thead>
    <tbody className="bg-white">
      {currentRows.length > 0 ? (
        currentRows.map((item, index) => (
          <React.Fragment key={item.Id || `row-${index}`}>
            <tr className="hover:bg-gray-50 transition duration-300 ease-in-out">
              <td className="px-6 py-4 text-sm font-medium text-gray-700">{index + 1}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-700 hidden">{item.Id}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-700">{item.Deliverytime}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-700">
                {item.Active ? (
                  <span className="inline-block bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium">
                    Active
                  </span>
                ) : (
                  <span className="inline-block bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-medium">
                    Inactive
                  </span>
                )}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-700 flex space-x-4">
                {/* Edit Button */}
                <button
                  className="flex items-center px-3 py-1 bg-blue-100 text-blue-600 rounded-2xl hover:bg-blue-200 transition duration-300"
                  onClick={() => navigate(`/AddDeliveryTime/${item.Id}`)}
                >
                  <GrEdit className="mr-1" />
                  <span>Edit</span>
                </button>

                {/* Delete Button */}
                <button
                  className="flex items-center px-3 py-1 bg-red-100 text-red-600 rounded-2xl hover:bg-red-200 transition duration-300"
                  onClick={() => handleDeleteClick(item.Id)}
                >
                  <MdDelete className="mr-1" />
                  <span>Delete</span>
                </button>
              </td>
            </tr>

            {/* Horizontal Line */}
            <tr>
              <td colSpan="5" className="border-b border-gray-300"></td>
            </tr>
          </React.Fragment>
        ))
      ) : (
        <tr>
          <td colSpan="5" className="text-gray-500 text-center py-4">No data available</td>
        </tr>
      )}
    </tbody>
  </table>
</div>


          <div className="flex justify-between items-center mt-4">
            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded transition-all"
              onClick={() => handlePageChange("prev")}
            >
              &lt; Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded transition-all"
              onClick={() => handlePageChange("next")}
            >
              Next &gt;
            </button>
          </div>
        </div>
      </div>
      {isErrorModalOpen && <ErrorModal message={modalMessage} onClose={closeModal} />}
      {isSuccessModalOpen && <SuccessModal message={modalMessage} onClose={closeModal} />}
    </div>
  );
};

export default DeliveryTime;
