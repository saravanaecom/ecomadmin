import React, { useState, useEffect } from "react";
import Slider from "../components/sidebar";
import { insertBrand } from "../services/addBrand";
import { useParams, useNavigate } from "react-router-dom";

const Brand = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [brandName, setBrandName] = useState("");
  const [adminId, setAdminId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [Active, setActive] = useState(true);

  // Fetch existing brand data if id exists
  useEffect(() => {
    const Brandlists = JSON.parse(localStorage.getItem("BrandDataList"));
    if (Brandlists) {
      const selectedBrand = Brandlists.find((Brand) => Brand.Id === parseInt(id));
      if (selectedBrand) {
        setBrandName(selectedBrand.BrandName || "");
        setActive(selectedBrand.Active === 1);
      }
    }
  }, [id]);

  // Verify Admin User
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

  // Handle Save Button Click
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    const objlist = {
      Id: id ? parseInt(id) : "",
      Active: Active ? 1 : 0,
      BrandName: brandName,
    };

    console.log("Saving brand:", objlist);

    try {
      const success = await insertBrand([objlist], adminId);
      if (success) {
        alert("Brand saved successfully!");
        navigate(`/AllBrand`);
      } else {
        alert("Failed to save the brand.");
      }
    } catch (error) {
      console.error("Error during brand save:", error);
      alert("An error occurred while saving the brand.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r">
        <Slider />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
  {id && !isNaN(parseInt(id)) ? `Edit Brand` : "Add Brand"}
</h2>

          {/* Form Section */}
          <form onSubmit={handleSave}>
            {/* Brand Name Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brand Name
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Enter your brand name"
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Active Status Toggle */}
            <div className="mb-4 flex items-center">
              <label className="block text-sm font-medium text-gray-700 mr-2">Active:</label>
              <input
                type="checkbox"
                checked={Active}
                onChange={(e) => setActive(e.target.checked)}
                className="form-checkbox h-5 w-5 text-indigo-600"
              />
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className={`w-full ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } text-white font-medium py-2 rounded-md mt-4 transition-all duration-200`}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Brand"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Brand;
