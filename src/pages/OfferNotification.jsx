import React, { useState, useEffect } from "react";
import Slider from "../components/sidebar"; // Import Sidebar component
import ServerURL from "../server/serverUrl"; // Import server URL configuration
import { ImagePathRoutes } from '../routes/imagePathRoutes'; // Import image path routes for display
import { useParams, useNavigate } from "react-router-dom";
import { insertofferpost } from "../services/Offernotification";
import '../index.css'

const OfferNotification = () => {
  // States to handle form inputs
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [activeStatus, setActiveStatus] = useState(true);
  const [poster, setPoster] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);
  const navigate = useNavigate();
  const [adminId, setAdminId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Handle file input change for poster
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPoster(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPosterPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };


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
  // Handle image upload (to server)
  const handleImageUpload = async (e, type) => {
    const formData = new FormData();
    const file = e.target.files[0];
    if (file) {
      formData.append("MyImages", file);
      setLoading(true);
      try {
        const response = await fetch(`${ServerURL.PRODUCTION_HOST_URL}/api/OfferPost/UploadNotificationOfferFile`, {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        console.log(data)
        if (response.ok) {
          if (type === "offernotificationimage") {
            setPoster(data); 
        
          }
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



    setLoading(true);

    const objlist = {
 
      Comid: adminId,
   
    };
    const firebaseid =localStorage.getItem("FireBaseId");
   
    try {
      const success = await insertofferpost(adminId,notificationTitle,notificationMessage,poster,firebaseid);
      if (success) {
        console.log(success)
        setSuccessMessage("SubCategory saved successfully!");
        setIsSuccessModalOpen(true);
        setTimeout(() => {
          navigate(`/index`);
        }, 2000);
      } else {
        setError("Failed to save the Subcategory.");
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

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      notificationTitle,
      notificationMessage,
      activeStatus,
      poster,
    });
   
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="flex-shrink-0 text-white">
        <Slider />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h5 className="text-2xl font-semibold">Offer Notification</h5>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Notification Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Notification Title</label>
              <input
                type="text"
                id="txtNotificationTitle"
                className="mt-1 block w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                value={notificationTitle}
                onChange={(e) => setNotificationTitle(e.target.value)}
              />
            </div>

            {/* Notification Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Notification Message</label>
              <input
                type="text"
                id="txtNotificationMsg"
                className="mt-1 block w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
              />
            </div>

            {/* Active Status */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Active Status</label>
              <input
                type="checkbox"
                id="btnActiveStatus"
                checked={activeStatus}
                onChange={() => setActiveStatus(!activeStatus)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
            </div>

            {/* Notification Poster */}
            {/* Notification Poster */}
<div>
  <label className="block text-sm font-medium text-gray-700">Notification Poster*</label>
  
  {/* Custom File Input */}
  <div className="relative inline-block">
    <input
      type="file"
      id="offernotificationimage"
      accept="image/x-png,image/gif,image/jpeg,image/svg"
      onChange={(e) => handleImageUpload(e, "offernotificationimage")}
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
    />
    <label
      htmlFor="offernotificationimage"
      className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
    >
      Choose File
    </label>
  </div>
  
  <span className="text-gray-600 ml-4">{poster ? poster : "No file selected"}</span>

  {/* Poster Preview */}
  <div className="mt-2">
    <img
      src={posterPreview || (poster ? ImagePathRoutes.OfferNotificationImagePath + poster : 'https://i.gifer.com/origin/e0/e0ea055299e92297b2ec0ef1c80696bf_w200.gif')}
      alt="Offer Notification Preview"
      className="w-44 h-36 rounded-lg"
    />
  </div>
</div>


            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-1/2 py-2 px-4 bg-[var(--primary-button-bg)] text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Send Notification
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default OfferNotification;
