import React, { useState,useEffect } from 'react';
import Slider from "../components/sidebar";
import { useNavigate } from 'react-router-dom';
import {fetchSelectdriver,DeleteDriver}from '../services/drivermaster';
import { MdDelete } from "react-icons/md";
import { GrEdit } from "react-icons/gr";

const Drivermaster = () => {

  const navigate = useNavigate();
  const [Comid, setCompanyId] = useState(null);
  const [driverData, setDriverData] = useState([]);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleNavigate = (id) => {
 
    navigate(`/AddDriver/${id}`);
  };

  

  useEffect(() => {
    const adminuserid = localStorage.getItem("adminuserid");
    if (adminuserid) {
      setCompanyId(Number(adminuserid));
    } else {
      showError("Admin ID not found in localStorage");
    }
  }, []);

  useEffect(() => {
    if (Comid !== null) {
      fetchDriverData();
    }
  }, [Comid]);
  const fetchDriverData = async () => {
    let adminId = Comid;

    try {
      const data = await fetchSelectdriver(adminId);
      if (data && Array.isArray(data)) {
        setDriverData(data);
        localStorage.setItem("DriverData", JSON.stringify(data));
     
      } else {
        showError("Unexpected API response.");
      }
    } catch (error) {
      showError("Failed to fetch admin data.");
    }
  };

  const handleDeleteClick = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this Driver?");
    if (!confirmDelete) return;

    try {
      const isDeleted = await DeleteDriver(id);

      if (isDeleted) {
        setDriverData((prevCoupons) =>
          prevCoupons.filter((coupon) => coupon.Id !== id)
        );
        alert("Driver deleted successfully.");
      } else {
        alert("Failed to delete the driver. Please try again.");
      }
    } catch (error) {
      alert("Error deleting the driver: " + error.message);
    }
  };



   




  const showError = (message) => {
    setModalMessage(message);
    setIsErrorModalOpen(true);
  };


  return (
    <>
     <div >
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-1/5 h-full  bg-white shadow-md">
        <Slider />
      </div>

      {/* Right Content */}
      <div className="flex-grow py-6 h-full overflow-y-auto bg-white" style={{ position: "relative", top: "50px", right: "5px" }}>
        <div className="container-fluid">
          {/* Card Structure */}
          <div className="card shadow-lg border-0 mb-7">
            {/* Card Header */}
            <div className="card-header text-black font-bold py-4 px-5 flex justify-between items-center">
              <h2 className="mb-0 text-3xl">Driver List</h2>
              <button
                onClick={() => handleNavigate()}
                className="bg-blue-800 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
              >
                Add Driver
              </button>
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto px-6 py-4">
              <table className="min-w-full table-auto border-separate border-spacing-0 neumorphism-table">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">S.No</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Mobile</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {driverData.map((driver, index) => (
                    <React.Fragment key={driver.Id}>
                      <tr className="hover:bg-gray-50 transition duration-300 ease-in-out">
                        <td className="px-6 py-4 text-sm font-medium text-gray-700">{index + 1}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-700">{driver.Name}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-700">{driver.Mobile}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-700">
                          {driver.Active === 1 ? (
                            <span className="inline-block bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium">
                              Active
                            </span>
                          ) : (
                            <span className="inline-block bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-medium">
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-700 flex justify-center">
                        <button onClick={() => handleNavigate(driver.Id)} className="text-blue-600 hover:text-blue-800">
                      <GrEdit />
                    </button>
                    <button onClick={() => handleDeleteClick(driver.Id)} className="ml-4 text-red-600 hover:text-red-800">
                      <MdDelete />
                    </button>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="5" className="border-b border-gray-300"></td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Card Footer */}
            <div className="card-footer border-0 py-4 bg-gray-50 flex justify-center">
              <span className="text-muted text-sm">
                Showing {driverData.length} items out of {driverData.length} results found
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
   </div>
    </>
  );
};

export default Drivermaster;
