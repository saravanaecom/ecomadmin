import React, { useState, useEffect } from "react";
import { fetchSelectsubCategory, fetchSelectCategory, deleteSubCategory } from "../services/SubCategory";
import Slider from "../components/sidebar";
import { useNavigate } from "react-router-dom";
import { ImagePathRoutes } from "../routes/imagePathRoutes";
import ErrorModal from "../components/error"; // Import ErrorModal
import SuccessModal from "../components/sucessmodel"; // Import SuccessModal
import { MdDelete } from "react-icons/md";
import { GrEdit } from "react-icons/gr";
import '../index.css'

const SubCategory = () => {
  const [rows, setRows] = useState(10);
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [adminId, setAdminId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);

  const navigate = useNavigate();

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
      fetchsubCategoryData();
      fetchCategoryData();
    }
  }, [adminId]);

  const fetchsubCategoryData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSelectsubCategory(adminId);
      if (data) {
        setSubCategories(data);
        localStorage.setItem("SubCategories", JSON.stringify(data));
      }
    } catch (error) {
      setError("Error fetching subcategory data: " + error.message);
      setIsErrorModalOpen(true);
    } finally {
      setLoading(false);
    }
  };
  ////

// First, modify your filteredSubCategories logic
const filteredSubCategories = subCategories.filter((sub) =>
  (!selectedCategory || sub.Category.toLowerCase().includes(selectedCategory.toLowerCase())) &&
  (!search || sub.SubCategory.toLowerCase().includes(search.toLowerCase()))
);

// Then update your pagination logic
const totalPages = Math.ceil(filteredSubCategories.length / rows);

// Update handlePageChange function
const handlePageChange = (direction) => {
  if (direction === "prev" && currentPage > 1) {
    setCurrentPage(currentPage - 1);
  } else if (direction === "next" && currentPage < totalPages) {
    setCurrentPage(currentPage + 1);
  }
};

// Make sure currentPage is reset when search or category filter changes
useEffect(() => {
  setCurrentPage(1);
}, [search, selectedCategory, rows]);

// Update your paginatedSubCategories calculation
const paginatedSubCategories = filteredSubCategories.slice(
  (currentPage - 1) * rows,
  currentPage * rows
);

  ////
 



  
  const fetchCategoryData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSelectCategory(adminId);
      if (data) {
        setCategoryList(data);
        localStorage.setItem("Categories", JSON.stringify(data));
      }
    } catch (error) {
      setError("Error fetching category data: " + error.message);
      setIsErrorModalOpen(true);
    } finally {
      setLoading(false);
    }
  };


  

  const handleRowChange = (e) => {
    setRows(parseInt(e.target.value));
    setCurrentPage(1);
  };


  



  const handleNavigate = (id) => {
    navigate(`/AddSubCategory/${id}`);
  };

  const handleDeleteClick = async (id) => {
    try {
      const isDeleted = await deleteSubCategory(id);
      if (isDeleted) {
        setSuccessMessage("SubCategory deleted successfully!");
        setIsSuccessVisible(true);
        setSubCategories((prevAreaData) => prevAreaData.filter((area) => area.Id !== id));
      } else {
        setError("Failed to delete the SubCategory. Please try again.");
        setIsErrorModalOpen(true);
      }
    } catch (error) {
      setError("Error deleting the SubCategory: " + error.message);
      setIsErrorModalOpen(true);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-shrink-0">
        <Slider />
      </div>
      <div className="flex-grow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-gray-800">SubCategory Panel</h1>
          <button onClick={() => handleNavigate()} className="bg-[var(--primary-button-bg)] hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow-md flex items-center">
            <i className="bi bi-plus-square-dotted mr-2"></i> Add SubCategory
          </button>
        </div>

        <div className="bg-white shadow rounded-md p-4 mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of Rows</label>
              <select value={rows} onChange={handleRowChange} className="w-full border rounded-md p-2">
                <option value="1000">Show ALL Rows</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full border rounded-md p-2">
                <option value="">Select a Category</option>
                {categoryList.map((item, index) => (
                  <option key={index} value={item.Category}>
                    {item.Category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                placeholder="Search SubCategories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border rounded-md p-2"
              />
            </div>
          </div>
        </div>

        {loading && <div className="text-center py-6">Loading...</div>}

        {error && <div className="text-center text-red-500 py-6">{error}</div>}

        {!loading && (
    <div className="overflow-x-auto px-6 py-4">
    <table className="min-w-full table-auto border-separate border-spacing-0 neumorphism-table">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">S.No</th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">SubCategory Name</th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category Name</th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white">
        {!loading ? (
          paginatedSubCategories.length > 0 ? (
            paginatedSubCategories.map((item, index) => (
              <React.Fragment key={item.id || index}>
                <tr className="hover:bg-gray-50 transition duration-300 ease-in-out">
                  <td className="px-6 py-4 text-sm font-medium text-gray-700">{(currentPage - 1) * rows + index + 1}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-700">{item.SubCategory}</td>
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
                  <td className="px-6 py-4 text-sm font-medium text-gray-700 flex space-x-4">
                    {/* Edit Button */}
                    <button
                      onClick={() => handleNavigate(item.Id)}
                      className="flex items-center px-3 py-1 bg-blue-100 text-blue-600 rounded-2xl hover:bg-blue-200 transition duration-300"
                    >
                      <GrEdit className="mr-1" />
                      <span>Edit</span>
                    </button>
  
                    {/* Delete Button */}
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
              <td colSpan="6" className="text-center text-red-500 py-6">No SubCategories Found!</td>
            </tr>
          )
        ) : (
          <tr>
            <td colSpan="6" className="text-center text-gray-500 py-4">Loading...</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
  
        )}

        {filteredSubCategories.length > rows && (
      <div className="flex justify-between items-center mt-4">
      <button
        onClick={() => handlePageChange("prev")}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded ${
          currentPage === 1 
            ? 'bg-gray-300 cursor-not-allowed' 
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        Previous
      </button>
      <span className="text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => handlePageChange("next")}
        disabled={currentPage >= totalPages}
        className={`px-4 py-2 rounded ${
          currentPage >= totalPages 
            ? 'bg-gray-300 cursor-not-allowed' 
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        Next
      </button>
    </div>
        )}

        {/* Success Modal */}
        {isSuccessVisible && <SuccessModal message={successMessage} onClose={() => setIsSuccessVisible(false)} />}

        {/* Error Modal */}
        {isErrorModalOpen && <ErrorModal message={error} onClose={() => setIsErrorModalOpen(false)} />}
      </div>
    </div>
  );
};

export default SubCategory;
