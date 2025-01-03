import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { insertdeliveryTime } from "../services/DeliveryTime";
import Slider from "../components/sidebar";
import ErrorModal from "../components/error";
import SuccessModal from "../components/sucessmodel"; 
import { MdDelete } from "react-icons/md";
import { GrEdit } from "react-icons/gr";

const AddDeliveryTime = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [adminId, setAdminId] = useState(null);
  const [formData, setFormData] = useState({
    deliverytime: "",
    activeStatus: false,
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isSuccessVisible, setIsSuccessVisible] = useState(false); 
  const [successMessage, setSuccessMessage] = useState("");

  const closeErrorModal = () => {
    setIsErrorModalOpen(false);
  };

  const closeSuccessModal = () => {
    setIsSuccessVisible(false);
  };

  useEffect(() => {
    const areas = JSON.parse(localStorage.getItem("AdminDeliveryTime"));
    if (areas) {
      const areaData = areas.find((area) => area.Id === parseInt(id, 10));
      if (areaData) {
        setFormData({
          deliverytime: areaData.Deliverytime,
          activeStatus: areaData.Active === 1,
        });
      }
    }
  }, [id]);

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

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading spinner

    const objlist = {
      Id: id ? parseInt(id) : "",
      CompanyRefId: adminId,
      Deliverytime: formData.deliverytime,
      Active: formData.activeStatus ? 1 : 0,
    };

    try {
      const success = await insertdeliveryTime([objlist]);
      if (success) {
        setSuccessMessage("Delivery Time Add successfully")
        setIsSuccessVisible(true); // Show success modal
        setTimeout(() => {
          navigate(`/DeliveryTime`); // Redirect after success
        }, 2000); // Wait for a bit before redirecting
      } else {
        setErrorMessage("Failed to save the area.");
        setIsErrorModalOpen(true); // Show the error modal if failure
      }
    } catch (error) {
      console.error("Error during area insertion:", error);
      setErrorMessage("An error occurred while saving the area.");
      setIsErrorModalOpen(true); // Show the error modal if an error happens
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-shrink-0">
        <Slider />
      </div>
      <div className="flex-grow p-6 bg-white">
        <div className="max-w-full mx-auto bg-white shadow-md rounded-lg p-6">
          <h5 className="text-2xl font-semibold mb-4">Edit Delivery Time</h5>
          {errorMessage && <div className="text-red-500">{errorMessage}</div>}
          <form>
            <div className="mb-4">
              <label
                htmlFor="deliverytime"
                className="block text-sm font-medium text-gray-700"
              >
                Delivery Time
              </label>
              <input
                type="text"
                id="deliverytime"
                value={formData.deliverytime}
                onChange={handleInputChange}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter delivery time"
              />
            </div>
            <div className="mb-6 flex items-center space-x-4">
              <label
                htmlFor="activeStatus"
                className="text-sm font-medium text-gray-700"
              >
                Active Status
              </label>
              <input
                type="checkbox"
                id="activeStatus"
                checked={formData.activeStatus}
                onChange={handleInputChange}
                className="form-check-input h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
              />
            </div>
            <div className="flex space-x-4 mt-6">
              <button
                onClick={handleSave}
                className={`px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-all ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                type="button"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setFormData({ deliverytime: "", activeStatus: false })}
                className="px-4 py-2 bg-gray-400 text-white text-sm rounded-md hover:bg-gray-500 transition-all"
                type="button"
              >
                Clear
              </button>
              <button
                 onClick={() => navigate("/DeliveryTime")}
                className="px-4 py-2 bg-red-600 text-white text-sm rounded-md text-center hover:bg-red-700 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Show the error modal if an error occurs */}
      {isErrorModalOpen && <ErrorModal message={errorMessage} onClose={closeErrorModal} />}

      {/* Show the success modal if the process is successful */}
      {isSuccessVisible && <SuccessModal message={successMessage} onClose={closeSuccessModal} />}
    </div>
  );
};

export default AddDeliveryTime;
