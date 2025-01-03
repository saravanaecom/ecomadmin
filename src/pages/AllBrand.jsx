
import Slider from "../components/sidebar";
import React, { useEffect, useState } from "react";
import { fetchSelectBrand ,DeleteBrand} from "../services/addBrand";
import { useNavigate } from 'react-router-dom';

const Brand = () => {
    const [adminId, setAdminId] = useState(null);
    const [loading, setLoading] = useState(false);
  const [brandName, setBrandName] = useState("");
  const [brands, setBrands] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rows, setRows] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const adminUserId = JSON.parse(localStorage.getItem("adminuserid"));
    if (!adminUserId) {
      alert("Session Closed. Please Login Again!");
      navigate("/");
    } else {
      setAdminId(Number(adminUserId));
    }
  }, [navigate]);
   
  useEffect(() => {
    if (adminId) {
      setLoading(true);
      const fetchProducts = async () => {
        try {
          const BrandData = await fetchSelectBrand(adminId);
          localStorage.setItem("BrandDataList", JSON.stringify(BrandData));
          setBrands(BrandData);
          setFilteredProducts(BrandData);
          setTotalPages(Math.ceil(BrandData.length / rows));
        } catch (error) {
          console.error("Failed to fetch BrandData", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    }
  }, [adminId, rows]);



  const handleDeleteClick = async (id) => {

    setIsModalOpen(true);
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      const isDeleted = await DeleteBrand(id);
      
      if (isDeleted) {
        setBrands((prevProducts) =>
          prevProducts.filter((Brands) => Brands.Id !== id)
        );
        alert("coupon deleted successfully.");
      } else {
        alert("Failed to delete the product. Please try again.");
      }
    } catch (error) {
      alert("Error deleting the product: " + error.message);
    }
  };
 
  const handleNavigate = (id) => {
    navigate(`/Brand/${id}`);
  };

 

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r">
        <Slider />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
      <div className="flex-1 p-6">
      {/* Header with Add Brand Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Brand List</h2>
        <button
          onClick={() => navigate('/Brand/:id')} // Navigate without ID for adding a new brand
          className="bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-800"
        >
          Add Brands
        </button>
      </div></div>

        {/* Table */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Brand List</h2>
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border border-gray-300 bg-gray-100 text-left">
                  BrandName
                </th>
                <th className="px-4 py-2 border border-gray-300 bg-gray-100 text-left">
                  Status
                </th>
                <th className="px-4 py-2 border border-gray-300 bg-gray-100 text-left">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {brands.map((brand) => (
                <tr key={brand.Id}>
                  <td className="px-4 py-2 border border-gray-300">{brand.BrandName}</td>
                  <td className="px-4 py-2 border border-gray-300">
  {brand.Active === 1 ? 'Active' : 'Inactive'}
</td>

                  <td className="px-4 py-2 border border-gray-300">
                    <button
                      onClick={() => handleNavigate(brand.Id)}
                      className="bg-blue-500 text-white px-4 py-1 rounded-md mr-2 hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(brand.Id)}
                      className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Brand;
