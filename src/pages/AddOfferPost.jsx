import React, { useState, useEffect } from "react";
import Slider from "../components/sidebar";
import { useParams, useNavigate } from "react-router-dom";
import { insertOfferPost } from "../services/offerpost";
import ErrorModal from "../components/error";
import { ImagePathRoutes } from "../routes/imagePathRoutes";
import ServerURL from "../server/serverUrl";
import SuccessModal from "../components/sucessmodel";

const AddOfferPost = () => {
  const { id } = useParams();
  const [adminId, setAdminId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);
  const [webImage, setWebImage] = useState("");
  const [mobileImage, setMobileImage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    Imagepath: "",
    MobileImagepath: "",
    OfferDescription: "",
    OfferName: "",
  });


  const [istopoffer, setIsTopoffer] = useState(false);

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
    const areas = JSON.parse(localStorage.getItem("AdminOfferPost"));
    if (areas) {
      const areaData = areas.find((area) => area.Id === parseInt(id, 10));
      if (areaData) {
        const webImagePath = areaData.Imagepath ? areaData.Imagepath.replace("/offerposts/", "") : null;
        const mobileImagePath = areaData.MobileImagepath ? areaData.MobileImagepath.replace("/offerposts/", "") : null;
        setFormData({
          Imagepath: webImagePath || "",
          MobileImagepath: mobileImagePath || "",
          OfferDescription: areaData.OfferDescription || "",
          OfferName: areaData.OfferName || "",
        });
        setWebImage(webImagePath);
        setMobileImage(mobileImagePath);
      }
    }
  }, [id]);

  const closeErrorModal = () => {
    setIsErrorModalOpen(false);
  };

  const closeSuccessModal = () => {
    setIsSuccessVisible(false);
  };

  const handleImageUpload = async (e, type) => {
    const formData = new FormData();
    const file = e.target.files[0];
    if (file) {
      formData.append("MyImages", file);
      setLoading(true);

      try {
        const uploadImage = `${ServerURL.PRODUCTION_HOST_URL}api/OfferPost/UploadOfferPostFile`;
        const response = await fetch(uploadImage, {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          setIsSuccessVisible(true);
          setSuccessMessage("Image saved successfully!");
          if (type === "web") {
            setWebImage(data);
          } else {
            setMobileImage(data);
          }
        } else {
          setErrorMessage("Image upload failed!");
          setIsErrorModalOpen(true);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        setErrorMessage("An error occurred during the image upload.");
        setIsErrorModalOpen(true);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    const objlist = {
      Id: id ? parseInt(id) : "",
      Comid: adminId,
      OfferPer: 0,
      OfferName: formData.OfferName,
      OfferDescription: formData.OfferDescription,
      Imagepath: webImage,
      MobileImagepath: mobileImage,
      NewPostImagePath: "",
      OfferPostImagePath: "",
      SubCatPostImagePath: "",
      OfferSubDescription: formData.OfferName,
      istopoffer:istopoffer ? 1 : 0,
    };

    try {
      const success = await insertOfferPost([objlist]);
      if (success) {
        setIsSuccessVisible(true);
        setSuccessMessage("Offer Post saved successfully!");
        navigate(`/OfferPost`);
      } else {
        setErrorMessage("Failed to save the offer.");
        setIsErrorModalOpen(true);
      }
    } catch (error) {
      console.error("Error during offer post insertion:", error);
      setErrorMessage("An error occurred while saving the offer.");
      setIsErrorModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="slider-section w-1/5 h-full overflow-y-auto bg-white">
        <Slider className="position-sticky top-0" />
      </div>

      <div className="flex-grow py-6 h-full overflow-y-auto bg-white">
        <div className="container mx-auto">
          <div className="shadow border rounded-lg mb-7 bg-white">
            <div className="px-6 py-4 border-b">
              <h5 className="text-lg font-semibold">Add Offer Post</h5>
            </div>
            <div className="px-6 py-4">
              <form className="space-y-6 shadow-lg p-6 bg-gray-50 rounded-lg">
                <div>
                  <label htmlFor="txtOfferName" className="block font-medium text-gray-700">Offer Name</label>
                  <input
                    type="text"
                    id="txtOfferName"
                    value={formData.OfferName}
                    onChange={(e) =>
                      setFormData({ ...formData, OfferName: e.target.value })
                    }
                    className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                  />
                </div>

                <div>
                  <label htmlFor="txtOfferDescription" className="block font-medium text-gray-700">Offer Description (optional)</label>
                  <textarea
                    id="txtOfferDescription"
                    rows="4"
                    value={formData.OfferDescription}
                    onChange={(e) =>
                      setFormData({ ...formData, OfferDescription: e.target.value })
                    }
                    className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                  ></textarea>
                </div>

                {/* Image Upload Fields */}
                {/* Web Image */}
                <div className="form-group mb-4">
                  <label className="block text-sm font-medium text-gray-700 pb-7">Web Poster*</label>
                  <input
                    type="file"
                    className="hidden"
                    id="Filewebimg"
                    accept="image/x-png,image/gif,image/jpeg,image/svg"
                    onChange={(e) => handleImageUpload(e, "web")}
                  />
                  <label htmlFor="Filewebimg" className="cursor-pointer bg-blue-500 text-white p-2   rounded mr-2">
                    Choose Image
                  </label>
                  <span className="text-gray-600">{webImage}</span>
                  <img
                    src={webImage ? (ImagePathRoutes.OfferprePostImagePath + webImage) : 'https://i.gifer.com/origin/e0/e0ea055299e92297b2ec0ef1c80696bf_w200.gif'}
                    alt="Web Image"
                    className="w-44 h-36 rounded-lg mt-2"
                  />
                </div>

                {/* Mobile Image */}
                <div className="form-group mb-4">
                  <label className="block text-sm font-medium text-gray-700 pt-11  pb-7">Mobile Poster*</label>
                  <input
                    type="file"
                    className="hidden"
                    id="Filemobileimg"
                    accept="image/x-png,image/gif,image/jpeg,image/svg"
                    onChange={(e) => handleImageUpload(e, "mobile")}
                  />
                  <label htmlFor="Filemobileimg" className="cursor-pointer bg-blue-500 text-white p-2 rounded mr-2">
                    Choose Image
                  </label>
                  <span className="text-gray-600">{mobileImage}</span>
                  <img
                    src={mobileImage ? (ImagePathRoutes.OfferprePostImagePath + mobileImage) : 'https://i.gifer.com/origin/e0/e0ea055299e92297b2ec0ef1c80696bf_w200.gif'}
                    alt="Mobile Image"
                    className="w-44 h-36 rounded-lg mt-2"
                  />
                </div>
            

                <div className="flex items-center">
              <input type="checkbox" checked={istopoffer} onChange={() => setIsTopoffer(!istopoffer)} className="mr-2" />
              <label className="text-gray-700">Is Top Offer</label>
            </div>
                {/* Save Button */}
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className={`px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 focus:ring focus:ring-indigo-300 disabled:opacity-50`}
                  >
                    {loading ? "Saving..." : "Save Offer"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Error Modal */}
      {isErrorModalOpen && <ErrorModal message={errorMessage} onClose={closeErrorModal} />}

      {/* Success Modal */}
      {isSuccessVisible && <SuccessModal message={successMessage} onClose={closeSuccessModal} />}
    </div>
  );
};

export default AddOfferPost;
