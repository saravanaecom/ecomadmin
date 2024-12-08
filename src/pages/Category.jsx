import React, { useState, useEffect } from "react";
import { fetchSelectCategory, deleteCategory } from "../services/Category";
import Slider from "../components/sidebar";
import { useNavigate } from "react-router-dom";
import { ImagePathRoutes } from "../routes/imagePathRoutes";
import ErrorModal from "../components/error"; // Import ErrorModal
import SuccessModal from "../components/sucessmodel"; // Import SuccessModal
import { MdDelete } from "react-icons/md";
import { GrEdit } from "react-icons/gr";

const Category = () => {
  const [rows, setRows] = useState(10); // Number of rows per page
  const [category, setCategory] = useState([]); // Category data
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [adminId, setAdminId] = useState(null); // Admin ID from localStorage
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); 
  // Error state
  const [successMessage, setSuccessMessage] = useState(""); // Success message state
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false); // Modal state for error
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // Modal state for success
  const [filteredCategory, setFilteredCategory] = useState([]); // Filtered category data based on search
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Handle rows per page change
  const handleRowChange = (e) => {
    setRows(parseInt(e.target.value));
    setCurrentPage(1); // Reset to the first page
  };

  // Handle pagination
  const handlePageChange = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < Math.ceil(category.length / rows)) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Fetch Admin ID from localStorage
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

  // Fetch category data
  useEffect(() => {
    if (adminId) {
      fetchCategoryData();
    }
  }, [adminId]);

  const fetchCategoryData = async () => {
    setLoading(true);
    try {
      const data = await fetchSelectCategory(adminId);
      if (data) {
        setCategory(data);
        localStorage.setItem("Category", JSON.stringify(data));
      }
    } catch (error) {
      setError("Error fetching category data: " + error.message);
      setIsErrorModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Handle navigation to a specific category
  const handleNavigate = (id) => {
    navigate(`/addcategory/${id}`);
  };

  // Handle delete click
  const handleDeleteClick = async (id) => {
    try {
      const isDeleted = await deleteCategory(id);
      if (isDeleted) {
        setCategory((prevCategoryData) => prevCategoryData.filter((item) => item.Id !== id));
        setSuccessMessage("Category deleted successfully!");
        setIsSuccessModalOpen(true);
      } else {
        setError("Failed to delete the category. Please try again.");
        setIsErrorModalOpen(true);
      }
    } catch (error) {
      setError("Error deleting the category: " + error.message);
      setIsErrorModalOpen(true);
    }
  };
  useEffect(() => {
    setFilteredCategory(category); // Initially, show all categories
  }, [category]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter categories based on search query
    if (query === "") {
      setFilteredCategory(category);
    } else {
      const filtered = category.filter((item) =>
        item.Category.toLowerCase().includes(query)
      );
      setFilteredCategory(filtered);
    }

    setCurrentPage(1); // Reset to the first page after search
  };
  // Pagination logic
  const startIndex = (currentPage - 1) * rows;
  const currentRows = filteredCategory.slice(startIndex, startIndex + rows);
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-shrink-0">
        <Slider />
      </div>

      <div className="flex-1 p-6 bg-gray-50">
        <div className="container mx-auto">
          <div className="card shadow-xl rounded-lg border-0 mb-7 bg-white">
            <div className="card-header px-6 py-4 border-b">
              <h5 className="text-xl font-semibold text-gray-800">Category Panel</h5>
            </div>

            <div className="card-header px-6 py-4 border-b">
              <div className="flex justify-start mt-4">
                <button
                  onClick={() => handleNavigate()}
                  className="btn bg-blue-600 text-white hover:bg-blue-700 py-2 px-4 rounded-lg text-sm shadow-md"
                >
                  <i className="bi bi-plus-square-dotted mr-2"></i>
                  Add Category
                </button>
              </div>
            </div>

            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="w-1/4">
                  <label className="text-sm text-gray-700">Select Number Of Rows</label>
                  <select
                    value={rows}
                    onChange={handleRowChange}
                    className="w-full mt-1 py-2 px-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={1000}>Show ALL Rows</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>

                <div className="w-1/2 flex items-center space-x-4">
                <input
                    id="myInput"
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full py-2 px-4 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    placeholder="Category Search..."
                    aria-label="Search"
                  />
                  <span className="bg-gray-300 p-2 rounded-r-md">
                    <i className="bi bi-search text-gray-600"></i>
                  </span>
                </div>
              </div>
            </div>

          <div className="overflow-x-auto px-6 py-4">
  <table className="min-w-full table-auto border-separate border-spacing-0 neumorphism-table">
    <thead className="bg-gray-100">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">S.No</th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden">Category Id</th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category Image</th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category Name</th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
      </tr>
    </thead>
    <tbody className="bg-white">
      {loading ? (
        <tr>
          <td colSpan="6" className="text-gray-500 text-center py-4">Loading...</td>
        </tr>
      ) : currentRows.length > 0 ? (
        currentRows.map((item, index) => (
          <React.Fragment key={item.Id}>
            <tr className="hover:bg-gray-50 transition duration-300 ease-in-out">
              <td className="px-6 py-4 text-sm font-medium text-gray-700">{startIndex + index + 1}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-700 hidden">{item.Id}</td>
              <td className="border px-6 py-4">
                <img
                  src={ImagePathRoutes.BannerPostImagePath + item.ImagePath}
                  alt={item.mobilePoster}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-700">{item.Category}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-700">
                {item.Active ? (
                  <span className="inline-block bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium">
                    Active
                  </span>
                ) : (
                  <span className="inline-block bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-medium">
                    Inactive
                  </span>
                )}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-700 flex space-x-4 mt-5">
                <button
                  onClick={() => handleNavigate(item.Id)}
                  className="flex items-center px-3 py-1 bg-blue-100 text-blue-600 rounded-2xl hover:bg-blue-200 transition duration-300"
                >
              <GrEdit className="mr-1" />
              <span>Edit</span>
                </button>
                <button
               onClick={() => handleDeleteClick(item.Id)}
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


            <div className="card-footer border-0 py-5 px-6 flex justify-between items-center text-sm text-gray-500">
              <span>
                Showing <b>{currentRows.length}</b> items out of <b>{category.length}</b> results found
              </span>

              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange("prev")}
                  disabled={currentPage === 1}
                  className="text-gray-600 hover:bg-blue-500 hover:text-white py-2 px-4 rounded-md"
                >
                  &lt; Prev
                </button>
                <button
                  onClick={() => handlePageChange("next")}
                  disabled={currentPage === Math.ceil(category.length / rows)}
                  className="text-gray-600 hover:bg-blue-500 hover:text-white py-2 px-4 rounded-md"
                >
                  Next &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Show Modals */}
      {isErrorModalOpen && <ErrorModal message={error} onClose={() => setIsErrorModalOpen(false)} />}
      {isSuccessModalOpen && <SuccessModal message={successMessage} onClose={() => setIsSuccessModalOpen(false)} />}
    </div>
  );
};

export default Category;
