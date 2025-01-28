import React, { useState, useEffect } from "react";
import Slider from "../components/sidebar";
import { useNavigate } from "react-router-dom";
import { ImagePathRoutes } from "../routes/imagePathRoutes";
import { fetchSelectbannerpost,deleteBannerPost } from "../services/BannerPost";
import ErrorModal from "../components/error";
import SuccessModal from "../components/sucessmodel";
import { MdDelete } from "react-icons/md";
import { GrEdit } from "react-icons/gr";
const BannerPost = () => {
  const [rows, setRows] = useState(5); 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);
  const [adminId, setAdminId] = useState(null);
  const [bannerpost, setBannerpost] = useState([]);
  const [loading, setLoading] = useState(false);  
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);  // State for success modal
  const [successMessage, setSuccessMessage] = useState(""); 
  const navigate = useNavigate();

  useEffect(() => {
    const adminUserId = JSON.parse(localStorage.getItem("adminuserid"));
    if (!adminUserId) {
      setErrorMessage("Session Closed. Please Login Again!");
      setIsErrorModalOpen(true);
      setTimeout(() => navigate("/"), 2000);
    } else {
      setAdminId(Number(adminUserId));
    }
  }, [navigate]);

  useEffect(() => {
    if (adminId) fetchBannerData();
  }, [adminId, rows, currentPage]);

  const fetchBannerData = async () => {
    setLoading(true);
    try {
      const data = await fetchSelectbannerpost(adminId);
      if (data) {
        setBannerpost(data);
        setTotalPages(Math.ceil(data.length / rows)); // Calculate total pages
        localStorage.setItem("Bannerpost", JSON.stringify(data));
      }
    } catch (err) {
      setError("Error fetching banner data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRowChange = (e) => {
    setRows(parseInt(e.target.value, 10));
    setCurrentPage(1); // Reset to the first page on row change
  };

  const handlePageChange = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const handleNavigate = (id) => {
  
    navigate(`/addbannerpost/${id}`);
  }
  const closeErrorModal = () => {
    setIsErrorModalOpen(false);
  };

  const closeSuccessModal = () => {  // Method to close success modal
    setIsSuccessModalOpen(false);
  };

  const paginatedData = bannerpost.slice(
    (currentPage - 1) * rows,
    currentPage * rows
  );
  const handleDeleteClick = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this banner?");
   if(isConfirmed){
    try {
      const isDeleted = await deleteBannerPost(id);
      if (isDeleted) {
        setBannerpost((prevAreaData) => prevAreaData.filter((area) => area.Id !== id));
        setSuccessMessage("Area deleted successfully!");  
        setIsSuccessModalOpen(true); 
      } else {
        setError("Failed to delete the area. Please try again.");
      }
    } catch (error) {
      setError("Error deleting the area: " + error.message);
      setIsErrorModalOpen(true);
    }

    
   }
   else {
    // If the user cancels the action, log or handle the cancellation if needed
    setErrorMessage("Banner deletion was cancelled.");
    setIsErrorModalOpen(true);
  }
   
   
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="flex-shrink-0">
        <Slider />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg p-6 space-y-6">
            {/* Banner Panel Title */}
            <div className="flex justify-between items-center mb-6">
              <h5 className="text-2xl font-semibold text-gray-800">Banner Panel</h5>
            </div>

            {/* Row Selection */}
            <div className="flex items-center space-x-6 mb-6">
              <div className="flex items-center space-x-2">
                <label
                  htmlFor="maxRows"
                  className="text-sm font-medium text-gray-600"
                >
                  Select Number Of Rows
                </label>
                <select
                  id="maxRows"
                  value={rows}
                  onChange={handleRowChange}
                  className="border border-gray-300 rounded-md py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1000">Show ALL Rows</option>
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="20">20</option>
                </select>
              </div>
            </div>

            {/* Banner Table */}
            <div className="overflow-x-auto px-6 py-4">
  <table className="min-w-full table-auto border-separate border-spacing-0 neumorphism-table">
    <thead className="bg-gray-100">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">S.No</th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category Name</th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Banner Image-1</th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Banner Image-2</th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Banner Image-3</th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Banner Image-4</th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
      </tr>
    </thead>
    <tbody className="bg-white">
      {loading ? (
        <tr>
          <td colSpan="8" className="text-gray-500 text-center py-4">Loading...</td>
        </tr>
      ) : paginatedData.length > 0 ? (
        paginatedData.map((banner, index) => (
          <React.Fragment key={banner.Id}>
            <tr className="hover:bg-gray-50 transition duration-300 ease-in-out">
              <td className="px-6 py-4 text-sm font-medium text-gray-700">{index + 1}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-700">{banner.Category}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-700">
                <img
                  src={ImagePathRoutes.BannerPostImagePath + banner.Bannerimg1}
                  alt={banner.Category}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-700">
                <img
                  src={ImagePathRoutes.BannerPostImagePath + banner.Bannerimg2}
                  alt={banner.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-700">
                <img
                  src={ImagePathRoutes.BannerPostImagePath + banner.Bannerimg3}
                  alt={banner.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-700">
                <img
                  src={ImagePathRoutes.BannerPostImagePath + banner.Bannerimg4}
                  alt={banner.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-700">
                {banner.Active ? (
                  <span className="inline-block bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium">
                    Active
                  </span>
                ) : (
                  <span className="inline-block bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-medium">
                    Inactive
                  </span>
                )}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-700 flex space-x-4 mt-4">
                {/* Edit Button */}
                <button
                  onClick={() => handleNavigate(banner.Id)}
                  className="flex items-center px-3 py-1 bg-blue-100 text-blue-600 rounded-2xl hover:bg-blue-200 transition duration-300"
                >
                  <GrEdit className="mr-1" />
                  <span>Edit</span>
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => handleDeleteClick(banner.Id)}
                  className="flex items-center px-3 py-1 bg-red-100 text-red-600 rounded-2xl hover:bg-red-200 transition duration-300"
                >
                  <MdDelete className="mr-1" />
                  <span>Delete</span>
                </button>
              </td>
            </tr>

            {/* Horizontal Line */}
            <tr>
              <td colSpan="8" className="border-b border-gray-300"></td>
            </tr>
          </React.Fragment>
        ))
      ) : (
        <tr>
          <td colSpan="8" className="text-gray-500 text-center py-4">No data available</td>
        </tr>
      )}
    </tbody>
  </table>
</div>


            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-500">
                <span>
                  Showing <strong>{paginatedData.length}</strong> items out of{" "}
                  <strong>{bannerpost.length}</strong> results
                </span>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => handlePageChange("prev")}
                  disabled={currentPage === 1}
                  className={`px-6 py-2 rounded-lg ${
                    currentPage === 1
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  &lt; Prev
                </button>
                <button
                  onClick={() => handlePageChange("next")}
                  disabled={currentPage === totalPages}
                  className={`px-6 py-2 rounded-lg ${
                    currentPage === totalPages
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  Next &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isErrorModalOpen && <ErrorModal message={errorMessage} onClose={closeErrorModal} />}
      
      {/* Success Modal */}
      {isSuccessModalOpen && <SuccessModal message={successMessage} onClose={closeSuccessModal} />}
    </div>
  );
};

export default BannerPost;