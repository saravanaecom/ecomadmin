import React, { useState, useEffect } from "react";
import Slider from "../components/sidebar";
import { useParams, useNavigate } from "react-router-dom";
import { insertArea } from "../services/Area";
import ErrorModal from "../components/error";
import SuccessModal from "../components/sucessmodel";

const AddArea = () => {
  const { id } = useParams();
  const [areaName, setAreaName] = useState("");
  const [pincode, setPincode] = useState("");
  const [deliveryCharges, setDeliveryCharges] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [adminId, setAdminId] = useState(null);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);  // State for success modal
  const [successMessage, setSuccessMessage] = useState(""); 
  
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

  useEffect(() => {
    const areas = JSON.parse(localStorage.getItem("AdminArea"));
    if (areas) {
      const areaData = areas.find((area) => area.Id === parseInt(id));
      if (areaData) {
        setAreaName(areaData.AreaName);
        setPincode(areaData.Pincode);
        setDeliveryCharges(areaData.DeliveryCharges || "");
        setIsActive(areaData.Active === 1);
      }
    }
  }, [id]);

  const closeModal = () => {
    setIsErrorModalOpen(false);
  };

  const closeSuccessModal = () => {  // Close success modal
    setIsSuccessModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const objlist = {
      Id: id ? parseInt(id) : "",
      CompanyRefId: adminId,
      AreaName: areaName,
      Pincode: pincode,
      DeliveryCharges: deliveryCharges || 0,
      Active: isActive ? 1 : 0,
    };

    try {
      const success = await insertArea([objlist]);
      if (success) {
        setSuccessMessage("Area saved successfully!");  
        setIsSuccessModalOpen(true);  // Show success modal
        setTimeout(() => {
          navigate("/Area");
        }, 1500);  // Delay the navigation for 1.5 seconds to show the success modal
      } else {
        setErrorMessage("Failed to save the area.");
        setIsErrorModalOpen(true);
      }
    } catch (error) {
      console.error("Error during area insertion:", error);
      setErrorMessage("An error occurred while saving the area.");
      setIsErrorModalOpen(true);
    }
  };

  const handleClear = () => {
    setAreaName("");
    setPincode("");
    setDeliveryCharges("");
    setIsActive(true);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-shrink-0">
        <Slider />
      </div>
      <div className="flex-grow p-6">
        <div className="bg-white shadow rounded-lg mb-6 p-4">
          <h5 className="text-xl font-bold text-gray-800">Add Area</h5>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Area Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={areaName}
                onChange={(e) => setAreaName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Area Name"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Pincode <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                onKeyPress={(e) =>
                  (e.charCode >= 48 && e.charCode <= 57) || e.preventDefault()
                }
                maxLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Pincode"
                required
              />
            </div>

            {/* <div>
              <label className="block text-gray-700 font-medium mb-2">
                Delivery Charges
              </label>
              <input
                type="text"
                value={deliveryCharges}
                onChange={(e) => setDeliveryCharges(e.target.value)}
                onKeyPress={(e) =>
                  (e.charCode >= 48 && e.charCode <= 57) || e.preventDefault()
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Delivery Charges"
              />
            </div> */}

            <div className="flex items-center gap-5">
              <label className="text-gray-700 font-medium">Active Status</label>
              <input
                type="checkbox"
                checked={isActive}
                onChange={() => setIsActive(!isActive)}
                className="form-checkbox h-5 w-5 text-blue-600 rounded"
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
              >
                Save Area
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-200"
              >
                Clear
              </button>
              <button
                  type="button"
                onClick={() => navigate("/Area")}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      {isSuccessModalOpen && <SuccessModal message={successMessage} onClose={closeSuccessModal} />}
      {isErrorModalOpen && <ErrorModal message={errorMessage} onClose={closeModal} />}
    </div>
  );
};

export default AddArea;
