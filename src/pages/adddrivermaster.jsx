import React, { useState, useEffect } from "react";
import Slider from "../components/sidebar";
import { useParams, useNavigate } from "react-router-dom";
import { insertdriver } from "../services/drivermaster";
import ErrorModal from "../components/error"; // Import ErrorModal
import SuccessModal from "../components/sucessmodel"; 
const AddDriverMaster = () => {
  const { id } = useParams();
  const [driverName, setDriverName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [activeStatus, setActiveStatus] = useState(true);
  const [error, setError] = useState('');
  const [adminId, setAdminId] = useState(null);
  const navigate = useNavigate();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  // Validate input fields
  const validateInput = () => {
    if (!driverName || !mobileNumber || !password) {
      setError('All fields are required!');
      return false;
    }

    const mobilePattern = /^[0-9]{10}$/; // Simple mobile number pattern (10 digits)
    if (!mobilePattern.test(mobileNumber)) {
      setError('Please enter a valid mobile number.');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }

    setError('');
    return true;
  };

  useEffect(() => {
    const drivers = JSON.parse(localStorage.getItem("DriverData"));
    if (drivers) {
      const Driverdata = drivers.find((area) => area.Id === parseInt(id, 10));
      if (Driverdata) {
        setDriverName (Driverdata.Name);
        setMobileNumber(Driverdata.Mobile);
        setActiveStatus(Driverdata.Active === 1);
        setPassword(Driverdata.CategoryId); 
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




  // Handle form submit
  const handleSubmit =async (e) => {
    e.preventDefault();
    if (!validateInput()) return;

    const objlist = {
      Id: id ? parseInt(id) : "",
      CompanyRefId: adminId,
      Name: driverName,
      Mobile: mobileNumber,
      Active: activeStatus ? 1 : 0,
      Password:password
      
    };  
    console.log(objlist);
        try {
           const success = await insertdriver([objlist])
           if (success) {
            setSuccessMessage("Driver Added successfully!");
            setIsSuccessModalOpen(true);
            console.log(success)
            setTimeout(() => {
              navigate(`/AllDriver`);
            }, 2000);
          }
           else {
            setError(" Driver failed to save");
            setIsErrorModalOpen(true);
          }
        
          } catch (error) {
            console.error("Error during insert operation:", error);
            setError("An error occurred while saving the Subcategory.");
            setIsErrorModalOpen(true);
        }
     
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className=" text-whitep-6">
        <Slider />
      </div>
      <div className="flex-1 p-8 bg-white shadow-lg rounded-lg mx-8 my-4">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Add Driver</h2>

        {/* Display Error Message */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Driver Name */}
          <div>
            <label htmlFor="driverName" className="block text-lg font-medium text-gray-700">Driver Name</label>
            <input
              type="text"
              id="driverName"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              placeholder="Enter driver's name"
              required
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label htmlFor="mobileNumber" className="block text-lg font-medium text-gray-700">Mobile Number</label>
            <input
              type="text"
              id="mobileNumber"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              placeholder="Enter mobile number"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-lg font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              placeholder="Enter password"
              required
            />
          </div>

          {/* Active Status */}
          <div>
            <label className="block text-lg font-medium text-gray-700">Active Status</label>
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="active"
                  name="activeStatus"
                  value="1"
                  checked={activeStatus === true}
                  onChange={() => setActiveStatus(true)}
                  className="mr-2"
                />
                <label htmlFor="active" className="text-gray-700">Active</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="inactive"
                  name="activeStatus"
                  value="0"
                  checked={activeStatus === false}
                  onChange={() => setActiveStatus(false)}
                  className="mr-2"
                />
                <label htmlFor="inactive" className="text-gray-700">Inactive</label>
              </div>
            </div>
          </div>
          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Driver
            </button>
          </div>
        </form>
      </div>

      {isErrorModalOpen && <ErrorModal message={error} onClose={() => setIsErrorModalOpen(false)} />}
      {isSuccessModalOpen && <SuccessModal message={successMessage} onClose={() => setIsSuccessModalOpen(false)} />}
    </div>
  );
};

export default AddDriverMaster;
