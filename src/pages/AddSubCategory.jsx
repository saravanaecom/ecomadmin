import React, { useState, useEffect } from "react";
import ServerURL from "../server/serverUrl";
import Slider from "../components/sidebar";
import { fetchSelectCategory } from "../services/Category";
import { insertsubCategory } from "../services/SubCategory";
import { useParams, useNavigate } from "react-router-dom";
import { ImagePathRoutes } from '../routes/imagePathRoutes';
import ErrorModal from "../components/error"; // Import ErrorModal
import SuccessModal from "../components/sucessmodel"; // Import SuccessModal

const AddSubCategory = () => {
  const { id } = useParams();
  const [subCategoryName, setSubCategoryName] = useState("");
  const [activeStatus, setActiveStatus] = useState(true);
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(""); 
  const [subCategoryImg, setSubCategoryImg] = useState("");
  const [adminId, setAdminId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const areas = JSON.parse(localStorage.getItem("SubCategories"));
    if (areas) {
      const areaData = areas.find((area) => area.Id === parseInt(id, 10));
      if (areaData) {
        const subcategoryimage = areaData.ImagePath ? areaData.ImagePath.replace('/subcategoryimages/', '') : null;
        setSubCategoryImg(subcategoryimage);
        setSubCategoryName(areaData.SubCategory);
        setActiveStatus(areaData.Active === 1);
        setSelectedCategoryId(areaData.CategoryId); 
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
        setCategoryList(data);
      }
    } catch (error) {
      setError("Error fetching category data: " + error.message);
      setIsErrorModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const formData = new FormData();
    const file = e.target.files[0];
    if (file) {
      formData.append("MyImages", file);
      setLoading(true);
      try {
        const response = await fetch(`${ServerURL.PRODUCTION_HOST_URL}/api/SubCategoryApp/UploadSubCategoryFile`, {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        if (response.ok) {
          setSubCategoryImg(data);
        } else {
          alert("Image upload failed!");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("An error occurred while uploading the image.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // Form Validation
    if (!subCategoryName || !selectedCategoryId || !subCategoryImg) {
      setError("All fields are required!");
      setIsErrorModalOpen(true);
      return;
    }

    setLoading(true);

    const objlist = {
      Id: id ? parseInt(id) : "",
      Comid: adminId,
      Category: selectedCategoryId,
      SubCategory: subCategoryName,
      CategoryId: selectedCategoryId,
      ImagePath: subCategoryImg,
      Active: activeStatus ? 1 : 0,
      Sort: 0
    };

    try {
      const success = await insertsubCategory([objlist]);
      if (success) {
        setSuccessMessage("SubCategory saved successfully!");
        setIsSuccessModalOpen(true);
        console.log(success)
        setTimeout(() => {
          navigate(`/SubCategory`);
        }, 2000);
      }
       else {
        setError(" Subcategory already Exits");
        setIsErrorModalOpen(true);
      }
    } catch (error) {
      console.error("Error during insert operation:", error);
      setError("An error occurred while saving the Subcategory.");
      setIsErrorModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSubCategoryName("");
    setActiveStatus(true);
    setSelectedCategoryId(""); // Reset category ID
    setSubCategoryImg("");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/5 text-white">
        <Slider />
      </div>
      <div className="w-4/5 p-6">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Add SubCategory</h1>
          <form className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Select Category Name</label>
              <select
                className="w-full border border-gray-300 rounded-lg p-2"
                value={selectedCategoryId}
                onChange={(e) => {
                  setSelectedCategoryId(e.target.value); 
                }}
              >
                <option value="">Select a category</option>
                {categoryList.map((cat) => (
                  <option key={cat.Id} value={cat.Id}>
                    {cat.Category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">SubCategory Name</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg p-2"
                placeholder="Enter subcategory name"
                value={subCategoryName}
                onChange={(e) => setSubCategoryName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">SubCategory Poster*</label>
              <div className="flex items-center gap-4">
                <label htmlFor="subcategoryImage" className="w-28 cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md text-center hover:bg-blue-700 transition">
                  Browse
                </label>
                <input
                  id="subcategoryImage"
                  type="file"
                  className="hidden"
                  accept="image/x-png,image/gif,image/jpeg,image/svg"
                  onChange={handleImageUpload}
                />
                <span className="text-gray-600">{subCategoryImg}</span>
              </div>
              <div className="mt-2">
                <img
                  id="subcategoryImage"
                  src={subCategoryImg ? (ImagePathRoutes.SubCategoryPostImagePath + subCategoryImg) : 'https://i.gifer.com/origin/e0/e0ea055299e92297b2ec0ef1c80696bf_w200.gif'}
                  alt="SubCategory"
                  className="w-44 h-36 rounded-lg"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="text-gray-700 font-medium">Active Status*</label>
              <input
                type="checkbox"
                className="w-6 h-6 text-blue-500 border-gray-300 rounded focus:ring-blue-400"
                checked={activeStatus}
                onChange={(e) => setActiveStatus(e.target.checked)}
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
                onClick={handleSave}
              >
                Add SubCategory
              </button>
              <button
                type="button"
                className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-600"
                onClick={handleClear}
              >
                Clear
              </button>
              <button
             onClick={() => navigate("/SubCategory")}
                className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </form>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
        </div>
      </div>

      {/* Show Modals */}
      {isErrorModalOpen && <ErrorModal message={error} onClose={() => setIsErrorModalOpen(false)} />}
      {isSuccessModalOpen && <SuccessModal message={successMessage} onClose={() => setIsSuccessModalOpen(false)} />}
    </div>
  );
};

export default AddSubCategory;
