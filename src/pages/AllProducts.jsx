import React, { useState, useEffect } from "react";
import Slider from "../components/sidebar";
import { useNavigate } from "react-router-dom";
import { fetchSelectProduct, Deleteproduct } from "../services/Product";
import { ImagePathRoutes } from "../routes/imagePathRoutes";
import ErrorModal from "../components/error";
import SuccessModal from "../components/sucessmodel";
import { MdDelete } from "react-icons/md";
import { GrEdit } from "react-icons/gr";
import "../index.css";
import { fetchSelectCategory,fetchSelectsubCategoryid,fetchMultiplePriceListNew,fetchProductIdAdmin,insertProduct } from "../services/addproducts";

const AllProducts = () => {
  const [rows, setRows] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [adminId, setAdminId] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dsubcategory, setSubCategoryd] = useState([]);
  const [category, setCategory] = useState([]);
  const [categoryid, setCategoryid] = useState('');
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();



  
  // Fetch Admin ID
  useEffect(() => {
    const adminUserId = JSON.parse(localStorage.getItem("adminuserid"));
    if (!adminUserId) {
      alert("Session Closed. Please Login Again!");
      navigate("/");
    } else {
      setAdminId(Number(adminUserId));
    }
  }, [navigate]);




  // category and SubCategory
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const categoriesData = await fetchSelectCategory(adminId);
        setCategory(categoriesData);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };
    if (adminId) fetchCategories();
  }, [adminId]);

  useEffect(() => {
    if (categoryid) {
      setLoading(true);
      const fetchSubCategories = async () => {
        try {
          const subcategoriesData = await fetchSelectsubCategoryid(adminId, categoryid);
          setSubCategoryd(subcategoriesData);
        } catch (error) {
          console.error("Failed to fetch subcategories", error);
        } finally {
          setLoading(false);
        }
      };
      fetchSubCategories();
    }
  }, [categoryid, adminId]);

  ///////
  // Fetch products
  useEffect(() => {
    if (adminId) {
      setLoading(true);
      const fetchProducts = async () => {
        try {
          const productsData = await fetchSelectProduct(adminId);
          localStorage.setItem("AdminProductList", JSON.stringify(productsData));
          setProducts(productsData);
          setFilteredProducts(productsData);
          setTotalPages(Math.ceil(productsData.length / rows));
        } catch (error) {
          console.error("Failed to fetch products", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    }
  }, [adminId, rows]);
  
 
  useEffect(() => {
    const catfiltered = products.filter((product) => {
      if (categoryid && selectedCategory) {
        return product.CId === parseInt(categoryid) && product.SId === parseInt(selectedCategory);
      } else if (categoryid) {
        return product.CId === parseInt(categoryid);
      } else if (selectedCategory) {
        return product.SId === parseInt(selectedCategory);
      }
      return true;
    });

    const searchFiltered = searchKey
      ? catfiltered.filter((product) =>
          product.Description.toLowerCase().includes(searchKey.toLowerCase()) ||
          product.ProductCode.toLowerCase().includes(searchKey.toLowerCase()) ||
          product.SubCategoryName.toLowerCase().includes(searchKey.toLowerCase())
        )
      : catfiltered;

    setFilteredProducts(searchFiltered);
    setTotalPages(Math.ceil(searchFiltered.length / rows));
    setCurrentPage(1);
  }, [products, categoryid, selectedCategory, searchKey, rows]);


  // Filter products based on search
  // useEffect(() => {
  //   const filtered = products.filter((product) =>
  //     searchKey
  //       ? product.Description.toLowerCase().includes(searchKey.toLowerCase()) ||
  //         product.ProductCode.toLowerCase().includes(searchKey.toLowerCase()) ||
  //         product.SubCategoryName.toLowerCase().includes(searchKey.toLowerCase())
  //       : true
  //   );
  //   setFilteredProducts(filtered);
  //   setTotalPages(Math.ceil(filtered.length / rows));
  //   setCurrentPage(1); // Reset to first page after filtering
  // }, [searchKey, products, rows]);

  // Pagination
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * rows, currentPage * rows);

  const handlePageChange = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleSearchChange = (e) => setSearchKey(e.target.value);

  const handleRowChange = (e) => {
    setRows(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };

  const handleNavigate = (id) => {
    navigate(`/AddProducts/${id}`);
  };

  const handleDeleteClick = async (id) => {

    setIsModalOpen(true);
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      const isDeleted = await Deleteproduct(id);
      
      if (isDeleted) {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.Id !== id)
        );
        alert("Product deleted successfully.");
      } else {
        alert("Failed to delete the product. Please try again.");
      }
    } catch (error) {
      alert("Error deleting the product: " + error.message);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-shrink-0 text-white">
        <Slider />
      </div>
      <div className="w-full p-6">
        <div className="bg-white shadow rounded-lg">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h5 className="text-lg font-semibold text-gray-800">Product Panel</h5>
            <div className="flex items-center space-x-4">
              <input
                id="myInput"
                type="text"
                value={searchKey}
                onChange={handleSearchChange}
                placeholder="Search Products..."
                className="border border-gray-300 rounded-lg px-4 py-2 w-64 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />

<select
                value={categoryid}
                onChange={(e) => setCategoryid(e.target.value)}
                className="border rounded-lg px-4 py-2"
              >
                <option value="">Select Category</option>
                {category.map((item) => (
                  <option key={item.Id} value={item.Id}>
                    {item.Category}
                  </option>
                ))}
              </select>
         <select
             value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 w-64 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <option value="">Select SubCategory</option>
                {dsubcategory.length > 0 ? (
                 dsubcategory.map((item) => (
                <option key={item.Id} value={item.Id}>
                  {item.SubCategory}
                </option>
                ))
                ) : (
                <option disabled>No subcategories available</option>
                 )}
              </select>
              <button
                onClick={() => handleNavigate()}
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg shadow"
              >
                <i className="bi bi-plus-square-dotted pr-2"></i>Add Product
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-4 text-center text-blue-500">Loading...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No products found.</div>
          ) : (
            <div className="overflow-x-auto px-6 py-4">
              <table className="min-w-full table-auto border-separate border-spacing-0 neumorphism-table">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      S.No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Product Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Product Image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Product Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase hidden md:table-cell">
                      SubCategory Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      MRP
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {paginatedProducts.map((product, index) => (
                    <tr
                      key={product.Id}
                      className="hover:bg-gray-50 transition duration-300 ease-in-out"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-700">
                        {(currentPage - 1) * rows + index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-700">
                        {product.ProductCode}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-700">
                        <img
                          src={ImagePathRoutes.ProductImagePath + product.Img0}
                          alt={product.Description}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-700">
                        {product.Description}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-700 hidden md:table-cell">
                        {product.SubCategoryName || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-700">
                        {product.MRP}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-700">
                        {product.Price}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-700">
                {product.Active === 1 ? (
                  <span className="inline-block bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium">Active</span>
                ) : (
                  <span className="inline-block bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-medium">Inactive</span>
                )}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-700 flex space-x-4 mt-4">
                <button
                  onClick={() => handleNavigate(product.Id)}
                  className="flex items-center px-3 py-1 bg-blue-100 text-blue-600 rounded-2xl hover:bg-blue-200 transition duration-300"
                >
                  <GrEdit className="mr-1" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteClick(product.Id)}
                  className="flex items-center px-3 py-1 bg-red-100 text-red-600 rounded-2xl hover:bg-red-200 transition duration-300"
                >
                  <MdDelete className="mr-1" />
                  <span>Delete</span>
                </button>
              </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {filteredProducts.length > 0 && (
            <div className="flex justify-between items-center p-4">
              <select
                value={rows}
                onChange={handleRowChange}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <option value="5">5 Rows</option>
                <option value="10">10 Rows</option>
                <option value="15">15 Rows</option>
                <option value="20">20 Rows</option>
              </select>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange("prev")}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 rounded-lg ${
                    currentPage === 1
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  Previous
                </button>
                <span className="text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange("next")}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 rounded-lg ${
                    currentPage === totalPages
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error Modal */}
      {isErrorModalOpen && (
        <ErrorModal
          title="Error"
          message={errorMessage}
          onClose={() => setIsErrorModalOpen(false)}
        />
      )}

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <SuccessModal
          title="Success"
          message={successMessage}
          onClose={() => setIsSuccessModalOpen(false)}
        />
      )}
    </div>
  );
};

export default AllProducts;