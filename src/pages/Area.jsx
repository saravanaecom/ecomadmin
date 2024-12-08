import React, { useEffect, useState } from "react";
import { fetcArea, deleteArea } from "../services/Area";
import Slider from "../components/sidebar";
import { useNavigate } from "react-router-dom";
import ErrorModal from "../components/error";

import SuccessModal from "../components/sucessmodel";
import { MdDelete } from "react-icons/md";
import { GrEdit } from "react-icons/gr";
import '../index.css'

const Area = () => {
  const [adminId, setAdminId] = useState(null);
  const [areaData, setAreaData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleAddAreaClick = (id) => {
    navigate(`/AddArea/${id}`);
  };

  // Handle admin session and ID fetch
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

  // Fetch data when adminId changes
  useEffect(() => {
    if (adminId) {
      fetchAreaData();
    }
  }, [adminId]);

  // Fetch Area Data
  const fetchAreaData = async () => {
    setLoading(true);
    try {
      const data = await fetcArea(adminId);
      if (data) {
        setAreaData(data);
        localStorage.setItem("AdminArea", JSON.stringify(data));
      }
    } catch (error) {
      setErrorMessage("Error fetching area data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete area
  const handleDeleteClick = async (id) => {
    try {
      const isDeleted = await deleteArea(id);
      if (isDeleted) {
        setAreaData((prevAreaData) => prevAreaData.filter((area) => area.Id !== id));
        setSuccessMessage("Area deleted successfully!");
        setIsSuccessModalOpen(true);
      } else {
        setError("Failed to delete the area. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Error deleting the area: " + error.message);
      setIsErrorModalOpen(true);
    }
  };

  const closeErrorModal = () => {
    setIsErrorModalOpen(false);
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-shrink-0">
        <Slider />
      </div>
      <div className="flex-1 p-6">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden backdrop-blur-xl bg-opacity-30 neumorphism-container">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center neumorphism-card">
            <h5 className="text-lg font-bold text-gray-700">Area Panel</h5>
            <button
              onClick={handleAddAreaClick}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[var(--primary-button-bg)] rounded-lg hover:bg-blue-600 transition duration-300 transform hover:scale-105 neumorphism-button"
            >
              <i className="bi bi-plus-square-dotted mr-2"></i>
              Add Area
            </button>
          </div>

          {/* Row Selection */}
          <div className="flex flex-wrap items-center justify-start px-6 py-4 gap-4">
            <div className="neumorphism-input">
              <label className="text-gray-600 text-sm font-medium block mb-1">Select Number of Rows</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 neumorphism-input-select"
                id="maxRows"
              >
                <option value="1000">Show ALL Rows</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>

          {/* Error Message */}
          {error && <div className="text-red-500 text-sm mb-4 px-6">{error}</div>}

          {/* Table */}
          <div className="overflow-x-auto px-6 py-4">
            <table className="min-w-full table-auto border-separate border-spacing-0 neumorphism-table">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">S.No</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Area Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Pincode</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white">
  {loading ? (
    <tr>
      <td colSpan="6" className="text-gray-500 text-center py-4">Loading...</td>
    </tr>
  ) : areaData.length > 0 ? (
    areaData.map((area, index) => (
      <React.Fragment key={area.Id}>
        <tr
          className="hover:bg-gray-50 transition duration-300 ease-in-out"
        >
          <td className="px-6 py-4 text-sm font-medium text-gray-700">{index + 1}</td>
          <td className="px-6 py-4 text-sm font-medium text-gray-700">{area.AreaName}</td>

          <td className="px-6 py-4 text-sm font-medium text-gray-700">{area.Pincode}</td>
          <td className="px-6 py-4 text-sm font-medium text-gray-700">
            {area.Active === 1 ? (
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
              onClick={() => handleAddAreaClick(area.Id)}
              className="flex items-center px-3 py-1 bg-blue-100 text-blue-600 rounded-2xl hover:bg-blue-200 transition duration-300"
            >
              <GrEdit className="mr-1" />
              <span>Edit</span>
            </button>

            {/* Delete Button */}
            <button
              onClick={() => handleDeleteClick(area.Id)}
              className="flex items-center px-3 py-1 bg-red-100 text-red-600 rounded-2xl hover:bg-red-200 transition duration-300"
            >
              <MdDelete className="mr-1" />
              <span>Delete</span>
            </button>
          </td>
        </tr>

        {/* Horizontal Line */}
        <tr>
          <td colSpan="6" className="border-b border-gray-300"></td>
        </tr>
      </React.Fragment>
    ))
  ) : (
    <tr>
      <td colSpan="6" className="text-gray-500 text-center py-4">No data available</td>
    </tr>
  )}
</tbody>

            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isErrorModalOpen && <ErrorModal message={errorMessage} onClose={closeErrorModal} />}
      {isSuccessModalOpen && <SuccessModal message={successMessage} onClose={closeSuccessModal} />}
    </div>
  );
};

export default Area;
