import React, { useState,useEffect } from 'react';
import Slider from "../components/sidebar";  // Sidebar component
import { FaShippingFast, FaEdit, FaTrash } from 'react-icons/fa'; // Icons for delivery charge actions
import { useParams, useNavigate } from "react-router-dom";
import { fetchdeliverycharges,deleteDeliverycharge} from "../services/deliverycharges";

const DeliveryCharge = () => {
  const [adminId, setAdminId] = useState(null);
  const [chargesData, setChargesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [deliveryCharge, setDeliveryCharge] = useState('');
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
 
    
    const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const [editCharge, setEditCharge] = useState(null);
  

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
        if (adminId) {
          fetchdeliverycharge();
        }
      }, [adminId]);
      


       // Fetchfetchdeliverycharge
        const fetchdeliverycharge = async () => {
                    setLoading(true);
          try {
            const data = await fetchdeliverycharges(adminId);
            if (data) {
              setChargesData(data);
              localStorage.setItem("Deliverycharge", JSON.stringify(data));
            }
          } catch (error) {
            setErrorMessage("Error fetching deliverycharge: " + error.message);
          } finally {
            setLoading(false);
          }
        };
      
  const handleEditCharge = (chargeData) => {
    setEditCharge(chargeData);
    setDeliveryCharge(chargeData.charge);
  };

 const handleDeleteClick = async (id) => {
    try {
      const isDeleted = await deleteDeliverycharge(id);
      if (isDeleted) {
        setChargesData((prevAreaData) => prevAreaData.filter((Charges) => Charges.Id !== id));
        setSuccessMessage("deliverycharge deleted successfully!");
        setIsSuccessModalOpen(true);
      } else {
        setError("Failed to delete the deliverycharge. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Error deleting the area: " + error.message);
      setIsErrorModalOpen(true);
    }
  };

    const handleAdddeliverychargeClick = (id) => {
    navigate(`/AddDeliveryCharge/${id}`);
  };

  const handleClick = (id) => {

    navigate(`/AddDeliveryCharge/${id}`);
  };

  return (
    <div className="flex h-screen bg-gray-100">
    {/* Sidebar */}
    <div className="flex-shrink-0">
      <Slider />
    </div>
  
    {/* Content Area */}
    <div className="flex-grow p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-gray-800">Delivery Charge</h1>
      </div>
  
      {/* Delivery Charge Form */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Move the button to the right */}
        <div className="flex justify-end md:col-span-2">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md shadow-md flex items-center justify-center mb-16"
            disabled={loading}
            onClick={handleClick}
          >
            {loading ? 'Setting Charge...' : <><FaShippingFast className="mr-2" /> Set Delivery Charge</>}
          </button>
        </div>
      </div>
  
      {/* Delivery Charge Table */}
      <div className="bg-white shadow rounded-md p-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Delivery Charges Overview</h2>
        <div className="overflow-x-auto"> {/* Make table horizontally scrollable on small screens */}
          <table className="min-w-full table-auto border-separate border-spacing-0 neumorphism-table">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">S.No</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">StartKM</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">EndKM</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">$DeliveryCharges</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th> 
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {chargesData.length > 0 ? (
                chargesData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition duration-300 ease-in-out">
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">{index + 1}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">{item.StartKM}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">{item.EndKM}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">₹ {item.DeliveryCharges}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-700 flex items-center">
                      {item.Active === 1 ? (
                        <>
                          <span className="inline-block w-2.5 h-2.5 bg-green-500 rounded-full mr-2"></span>
                          <span className="text-green-500">Active</span>
                        </>
                      ) : (
                        <>
                          <span className="inline-block w-2.5 h-2.5 bg-red-500 rounded-full mr-2"></span>
                          <span className="text-red-500">InActive</span>
                        </>
                      )}
                    </td>
  
                    {/* Actions Column */}
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">
  <div className="flex space-x-2">
    <button
      onClick={() => handleAdddeliverychargeClick(item.Id)}
      className="flex items-center px-3 py-1 bg-blue-100 text-blue-600 rounded-2xl hover:bg-blue-200 transition duration-300"
    >
      <FaEdit className="mr-1" />
      Edit
    </button>

    <button
      onClick={() => handleDeleteClick(item.Id)}
      className="flex items-center px-3 py-1 bg-red-100 text-red-600 rounded-2xl hover:bg-red-200 transition duration-300"
    >
      <FaTrash className="mr-1" />
      Delete
    </button>
  </div>
</td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-red-500 py-6">No Delivery Charges Set!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  
  
  );
};

export default DeliveryCharge;
