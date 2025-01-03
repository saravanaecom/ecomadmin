import ServerURL from "../server/serverUrl";
import Slider from "../components/sidebar";
import ErrorModal from "../components/error";
import SuccessModal from "../components/sucessmodel"; 
import { useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { ImagePathRoutes } from '../routes/imagePathRoutes';
import { insertCategory } from "../services/Category";

const AddCategory = () => {

  const { id } = useParams();
  const [categoryName, setCategoryName] = useState('');
  const [tamilName, setTamilName] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);
  const [categoryFeature, setCategoryFeature] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); 
  const [successMessage, setSuccessMessage] = useState("");
  const [adminId, setAdminId] = useState(null);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // UseEffect to validate session on load
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

  // Fetch existing category data if editing
  useEffect(() => {
    const areas = JSON.parse(localStorage.getItem("Category"));
    if (areas) {
      const areaData = areas.find((area) => area.Id === parseInt(id, 10));
      if (areaData) {
        const categoryimage = areaData.ImagePath ? areaData.ImagePath.replace('/categoryimages/', '') : null;
        setCategory(categoryimage);
        setCategoryName(areaData.Category);
        setCategoryFeature(areaData.CategoryFeatures || "");
        setIsActive(areaData.Active === 1);
      }
    }
  }, [id]);

  // Handle image upload
  const handleImageUpload = async (e, type) => {
    const formData = new FormData();
    const file = e.target.files[0];
    if (file) {
      formData.append("MyImages", file);
      setLoading(true);
      try {
        const response = await fetch(`${ServerURL.PRODUCTION_HOST_URL}/api/CategoryEcomApp/UploadFileCategory`, {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        if (response.ok) {

          setSuccessMessage("image saved successfully!");  
          setIsSuccessModalOpen(true);  
          if (type === "categoryImage") {
            setCategory(data);  // Set the uploaded image path
          }
        } else {
          setErrorMessage("Image upload failed!");
          setIsErrorModalOpen(true);
        }
      } catch (error) {
        setErrorMessage("An error occurred while uploading the image.");
        setIsErrorModalOpen(true);
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle toggle of category active status
  const toggleActiveStatus = () => {
    setIsActive(!isActive);
  };

  // Handle form submission to save category
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    const objlist = {
      Id:id ? parseInt(id) : "",
      Comid:adminId,
      Category:categoryName,
      ImagePath:category,
      Sort:0,
      Active:isActive ? 1 : 0,
      CategoryFeatures:categoryFeature,
    };

    try {
      const success = await insertCategory([objlist]);
      if (success) {
        setSuccessMessage("Category saved successfully!");
        setIsSuccessModalOpen(true);
        setTimeout(() => {
          navigate(`/category`);
        }, 2000);
      } else {
        setErrorMessage("Failed to save the category.");
        setIsErrorModalOpen(true);
      }
    } catch (error) {
      console.error("Error saving category:", error);
      setErrorMessage("An error occurred while saving the category.");
      setIsErrorModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Close error modal
  const closeModal = () => {
    setIsErrorModalOpen(false);
    setIsSuccessModalOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-shrink-0">
        <Slider />
      </div>

      <div className="flex-1 p-6 bg-white rounded-lg shadow-lg">
        <div className="container mx-auto max-w-full">
          <div className="card shadow-lg rounded-lg mb-8 bg-white p-9">
            <div className="card-header px-6 py-4 border-b">
              <h5 className="text-2xl font-semibold text-gray-800">Add Category</h5>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block text-lg font-medium text-gray-700">Category Name <span className="text-red-500">*</span></label>
                <input 
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="block w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Enter Category Name"
                  required 
                />
              </div>

              <div className="hidden">
                <label className="block text-sm font-medium text-gray-700">Tamil Name</label>
                <input 
                  type="text"
                  value={tamilName}
                  onChange={(e) => setTamilName(e.target.value)}
                  className="block w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Enter Tamil Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Category Poster <span className="text-red-500">*</span></label>
                <div className="mt-3">
                  <label htmlFor="categoryImage" className="w-full cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md text-center hover:bg-blue-700 transition">
                    Browse
                  </label>
                  <input 
                    type="file"
                    id="categoryImage"
                    accept="image/x-png,image/gif,image/jpeg,image/svg"
                    onChange={(e) => handleImageUpload(e, "categoryImage")}
                    className="hidden"
                  />
                  <span className="text-gray-600">{category}</span>
                </div>
                <div className="mt-2">
                  <img
                    id="categoryImage"
                    src={category ? (ImagePathRoutes.CategoryImagePath + category) : 'https://i.gifer.com/origin/e0/e0ea055299e92297b2ec0ef1c80696bf_w200.gif'}
                    alt="Web Image"
                    className="w-44 h-36 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Category Feature (optional)</label>
                <textarea 
                  value={categoryFeature}
                  onChange={(e) => setCategoryFeature(e.target.value)}
                  className="block w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
                  rows="4"
                  placeholder="Enter category features"
                />
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">Active Status <span className="text-red-500">*</span></label>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="btnActiveStatus" 
                    checked={isActive} 
                    onChange={toggleActiveStatus}
                    className="form-checkbox h-5 w-5 text-blue-600 transition duration-200"
                  />
                  <span className="ml-2 text-sm text-gray-600">{isActive ? 'Active' : 'Inactive'}</span>
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {id ? "Update Category" : "Add Category"}
                </button>
                <button 
                  type="button" 
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none"
                  onClick={() => {
                    setCategoryName('');
                    setTamilName('');
                    setCategoryImage(null);
                    setCategoryFeature('');
                    setIsActive(true);
                  }}
                >
                  Clear
                </button>
                <button 
                  type="button" 
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none"
                >
                  <button   onClick={() => navigate("/category")} className="text-gray-700">Cancel</button>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isErrorModalOpen && <ErrorModal message={errorMessage} onClose={closeModal} />}
      {isSuccessModalOpen && <SuccessModal message={successMessage} onClose={closeModal} />}
    </div>
  );
};

export default AddCategory;
