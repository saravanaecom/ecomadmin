import React, { useState, useEffect } from "react";
import Slider from "../components/sidebar";
import ErrorModal from "../components/error";
import SuccessModal from "../components/sucessmodel";
import { fetchSelectCompanyAdmin } from "../services/branch";
import { useNavigate } from "react-router-dom";
import { GrEdit } from "react-icons/gr";
import '../index.css'
const Branch = () => {
  const navigate = useNavigate();
  const [Comid, setCompanyId] = useState(null);
  const [admindata, setAdmindata] = useState([]);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleNavigate = (id) => {
    navigate(`/branchedit/${id}`);
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
      fetchAdminData();
    }
  }, [Comid]);

  const fetchAdminData = async () => {
    let adminId = Comid;

    try {
      const data = await fetchSelectCompanyAdmin(adminId);
      if (data && Array.isArray(data)) {
        setAdmindata(data);
        localStorage.setItem("AdminBranch", JSON.stringify(data));
     
      } else {
        showError("Unexpected API response.");
      }
    } catch (error) {
      showError("Failed to fetch admin data.");
    }
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

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <div className="slider-section w-1/5 h-full overflow-y-auto bg-white">
        <Slider  className="position-sticky top-0" />
      </div>

      {/* Right Content */}
      <div className="flex-grow py-6 h-full overflow-y-auto bg-white" style={{ position: "relative", top: "50px", right: "5px" }}>
        <div className="container-fluid">
          <div className="card shadow-lg border-0 mb-7">
            {/* Card Header */}
            <div className="card-header  text-black font-bold  py-4 px-5 flex justify-between items-center">
              <h2 className="mb-0 text-3xl">Branch View</h2>
              <button
                className="bg-[var(--primary-button-bg)] hover:bg-blue-600  text-white py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
                onClick={() => handleNavigate()}
              >
                Add Branch
              </button>
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto px-6 py-4">
  <table className="min-w-full table-auto border-separate border-spacing-0 neumorphism-table">
    <thead className="bg-gray-100">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">S.No</th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Branch Code</th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Branch Name</th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User Name</th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Password</th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
      </tr>
    </thead>
    <tbody className="bg-white">
      {admindata.map((admindatas, index) => (
        <React.Fragment key={admindatas.Id}>
          <tr className="hover:bg-gray-50 transition duration-300 ease-in-out">
            <td className="px-6 py-4 text-sm font-medium text-gray-700">{index + 1}</td>
            <td className="px-6 py-4 text-sm font-medium text-gray-700">{admindatas.CCode}</td>
            <td className="px-6 py-4 text-sm font-medium text-gray-700">{admindatas.BranchName}</td>
            <td className="px-6 py-4 text-sm font-medium text-gray-700">{admindatas.Username}</td>
            <td className="px-6 py-4 text-sm font-medium text-gray-700">{admindatas.Password}</td>
            <td className="px-6 py-4 text-sm font-medium text-gray-700">
              {admindatas.CStatus ? (
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
            <button
                  className="flex items-center px-3 py-1 bg-blue-100 text-blue-600 rounded-2xl hover:bg-blue-200 transition duration-300"
                  onClick={() => handleNavigate(admindatas.Id)}
                >
                  <GrEdit className="mr-1" />
                  <span>Edit</span>
                </button>
            </td>
   

         


          </tr>
          <tr>
            <td colSpan="7" className="border-b border-gray-300"></td>
          </tr>
        </React.Fragment>
      ))}
    </tbody>
  </table>
</div>


            {/* Card Footer */}
            <div className="card-footer border-0 py-4 bg-gray-50 flex justify-center">
              <span className="text-muted text-sm">
                Showing {admindata.length} items out of {admindata.length} results found
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isErrorModalOpen && <ErrorModal message={modalMessage} onClose={closeModal} />}
      {isSuccessModalOpen && <SuccessModal message={modalMessage} onClose={closeModal} />}
    </div>
  );
};

export default Branch;
