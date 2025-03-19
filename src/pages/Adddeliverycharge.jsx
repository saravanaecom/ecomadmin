import React, { useState, useEffect } from 'react'
import Slider from "../components/sidebar";
import { useParams, useNavigate } from "react-router-dom";
import { insertDeliveryCharges } from "../services/deliverycharges";
import ErrorModal from "../components/error";
import SuccessModal from "../components/sucessmodel";

const Adddeliverycharge = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [startkm, setStartKM] = useState("");
  const [endkm, setEndKM] = useState("");
  const [deliverycharge, setDeliverycharge] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [adminId, setAdminId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

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
      const Deliverychagre = JSON.parse(localStorage.getItem("Deliverycharge"));
      if (Deliverychagre) {
        const DeliverychagreData = Deliverychagre.find((Deliverychagre) => Deliverychagre.Id === parseInt(id));
        if (DeliverychagreData) {
          setStartKM(DeliverychagreData.StartKM);
          setEndKM(DeliverychagreData.EndKM);
          setDeliverycharge(DeliverychagreData.DeliveryCharges || "");
          setIsActive(DeliverychagreData.Active === 1);
        }
      }
    }, [id]);

 const closeModal = () => {
    setIsErrorModalOpen(false);
  };

  const closeSuccessModal = () => {  // Close success modal
    setIsSuccessModalOpen(false);
  };

  const handleClear = () => {
    setStartKM("");
    setEndKM("");
    setDeliverycharge("");
    setIsActive(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that all fields are filled in correctly
    if (!startkm || !endkm || !deliverycharge) {
      setErrorMessage("All fields are required!");
      setIsErrorModalOpen(true);
      return;
    }

    const objlist = {
      Id: id ? parseInt(id) : "",
      CompanyRefId: adminId,
      StartKM: startkm,
      EndKM: endkm,
      DeliveryCharges: deliverycharge,
      Active: isActive ? 1 : 0,
    };

    try {
      const success = await insertDeliveryCharges([objlist]);
      if (success) {
        setSuccessMessage("Delivery charge saved successfully!");
        setIsSuccessModalOpen(true);
        setTimeout(() => {
          navigate("/DeliveryCharge");
        }, 1500);
      } else {
        setErrorMessage("Failed to save the delivery charge.");
        setIsErrorModalOpen(true);
      }
    } catch (error) {
      console.error("Error during area insertion:", error);
      setErrorMessage("An error occurred while saving the delivery charge.");
      setIsErrorModalOpen(true);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-shrink-0">
        <Slider />
      </div>
      <div className="flex-grow p-6">
        <div className="bg-white shadow rounded-lg mb-6 p-4">
          <h5 className="text-xl font-bold text-gray-800">Add Deliverycharge</h5>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                StartKM <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={startkm}
                onChange={(e) => setStartKM(e.target.value)}
                onKeyPress={(e) =>
                  (e.charCode >= 48 && e.charCode <= 57) || e.preventDefault()
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter StartKM"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                EndKM <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={endkm}
                onChange={(e) => setEndKM(e.target.value)}
                onKeyPress={(e) =>
                  (e.charCode >= 48 && e.charCode <= 57) || e.preventDefault()
                }
                maxLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter EndKM"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Deliverycharges <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={deliverycharge}
                onChange={(e) => setDeliverycharge(e.target.value)}
                onKeyPress={(e) =>
                  (e.charCode >= 48 && e.charCode <= 57) || e.preventDefault()
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Deliverycharge"
                required
              />
            </div>

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
                onClick={() => navigate("/DeliveryCharge")}
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
}

export default Adddeliverycharge;
