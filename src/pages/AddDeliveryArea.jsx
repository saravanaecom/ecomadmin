import React, { useState, useEffect } from "react";
import Slider from "../components/sidebar";
import { useParams, useNavigate } from "react-router-dom";
import { insertDeliveryArea,  } from "../services/addDeliveryArea";
import SuccessModal from "../components/sucessmodel";
import ErrorModal from "../components/error";

const AddDeliveryArea = () => {
  const { id } = useParams();
  const [pincode, setPincode] = useState(""); // State for pincode input
  const [message, setMessage] = useState(""); // State for success/error message
  const navigate = useNavigate();
  const [adminId, setAdminId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [rows, setRows] = useState(10);
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
    const Pincodelists = JSON.parse(localStorage.getItem("Deliveryarea"));
    if (Pincodelists) {
      const Pincode = Pincodelists.find((Pincode) => Pincode.Id === parseInt(id));
      console.log(Pincode)
      if (Pincode) {
        const pincode =Pincode.pincode;
        setPincode(pincode)
      }
    }
  }, [id]);


  const closeSuccessModal = () => {  
    setIsSuccessModalOpen(false);
  };


  const closeModal = () => {
    setIsErrorModalOpen(false);
  };



  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const objlist = {
      CompanyRefid:adminId,
      Id: id ? parseInt(id) : "",
      pincode:pincode,
      Active:1
    };
  
    console.log(objlist);
  
    try {
      const success = await insertDeliveryArea([objlist]);
      console.log(success);
  
      if (success === true) {
        setSuccessMessage("DeliveryArea saved successfully!");
        setIsSuccessModalOpen(true);
        setTimeout(() => {
          navigate(`/DeliveryArea`);
        }, 2000);
      } else {
        setErrorMessage(success || "This DeliveryArea is already Exits.");
        setIsErrorModalOpen(true);
      }
    } catch (error) {
      console.error("Error during DeliveryArea save:", error);
      setErrorMessage("An error occurred while saving the DeliveryArea.");
      setIsErrorModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="flex-shrink-0">
        <Slider />
      </div>
      
      {/* Content */}
      <div className="flex-grow p-8">
        <h2 className="text-2xl font-semibold mb-4">Add Delivery Area</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <label htmlFor="pincode" className="block mb-2 font-medium">
            Enter Pincode:
          </label>
          <input
            type="text"
            id="pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            placeholder="Enter Pincode"
            className="w-full p-2 border rounded-md mb-4"
          />
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Add Pincode
          </button>
          {message && (
            <p className="mt-4 text-sm font-medium text-green-600">
              {message}
            </p>
          )}
        </div>
      </div>

      {isSuccessModalOpen && <SuccessModal message={successMessage} onClose={closeSuccessModal} />}
      {isErrorModalOpen && <ErrorModal message={errorMessage} onClose={closeModal} />}
    </div>
  );
};

export default AddDeliveryArea;
