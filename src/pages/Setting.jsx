import React, { useEffect, useState } from "react";
import Slider from "../components/sidebar";
import { useNavigate } from "react-router-dom";
import { fetcsetting, updatesetting } from "../services/service";
import ErrorModal from "../components/error"; // Import ErrorModal
import SuccessModal from "../components/sucessmodel";

const Setting = () => {
  const [adminId, setAdminId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);
  const [formData, setFormData] = useState({
    Id: "",
    btnSubCategory: true,
    btnDelivery: true,
    btnLocation: true,
    btnSubscription: true,
    btnRazorpay: true,
    btnWallet: true,
    btnCoupon: true,
    txtPaymentId: "",
    txtUrl: "",
    basecolorCode: "",
    shadowcolorCode: "",
    whitecolorCode: "",
    lightblackcolorCode: "",
    colorCode: "",
    Firebasetext: "",
    WhatsAppUrl: "",
    OwnerMobileNo:"",
  });
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
      fetchOfferData();
    }
  }, [adminId]);

  const fetchOfferData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetcsetting(adminId); 
      const data = response?.data[0];

      if (data) {
        setFormData({
          ...formData,
          Id: data.Id, 
          btnSubCategory: data.SubCategoryStatus === 1,
          btnRazorpay: data.PaymentId ? true : false,
          txtPaymentId: data.PaymentId || "",
          txtUrl: data.MinOrderAmt || "",
          basecolorCode: data.basecolorCode || "",
          colorCode: data.colorCode || "",
          lightblackcolorCode: data.lightblackcolorCode || "",
          shadowcolorCode: data.shadowcolorCode || "",
          whitecolorCode: data.whitecolorCode || "",
          Firebasetext: data.FireBaseId || "",
          WhatsAppUrl: data.WhatsAppUrl || "",
        });
        localStorage.setItem("AdminSetting", JSON.stringify(data)); 
      } else {
        setError("No data available.");
      }
    } catch (err) {
      setError("Failed to fetch data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [id]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const objlist = {
      Id: formData.Id,
      CompanyRefId: adminId,
      SubCategoryStatus: formData.btnSubCategory ? 1 : 0,
      DeliveryStatus: formData.btnDelivery ? 1 : 0,
      LocationStatus: formData.btnLocation ? 1 : 0,
      PaymentId: formData.txtPaymentId,
      MinOrderAmt: formData.txtUrl,
      FireBaseId: formData.Firebasetext,
      basecolorCode: formData.basecolorCode,
      shadowcolorCode: formData.shadowcolorCode,
      whitecolorCode: formData.whitecolorCode,
      lightblackcolorCode: formData.lightblackcolorCode,
      colorCode: formData.colorCode,
      WhatsAppUrl:formData.WhatsAppUrl,
      OwnerMobileNo:formData.OwnerMobileNo,
      
    };
    console.log(objlist)
    try {
      const success = await updatesetting(objlist);
   
      if (success) {
        setSuccessMessage("Setting updated successfully!");
        setIsSuccessVisible(true);
        navigate("/index");
      } else {
        setError("Failed to save the settings.");
      }
    } catch (error) {
      console.error("Error during settings update:", error);
      setError("An error occurred while saving the settings.");
    }
  };
  return (
    <div className="flex h-screen bg-gray-50">

      <div className="flex-shrink-0">
        <Slider />
      </div>

     
      <div className="flex-grow py-6 px-8 bg-white overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    
          <div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* SubCategory Toggle */}
              <div className="flex justify-between items-center">
                <label className="text-lg font-medium">
                  SubCategory  (<b>{formData.btnSubCategory ? "ON" : "OFF"}</b>)
                </label>
                <div className="relative">
                  <input
                    className="appearance-none w-14 h-6 rounded-full bg-gray-300 checked:bg-blue-600 transition duration-300 ease-in-out cursor-pointer"
                    type="checkbox"
                    id="btnSubCategory"
                    checked={formData.btnSubCategory}
                    onChange={handleInputChange}
                  />
                  <span
                    className={`absolute left-0 top-0 w-6 h-5 bg-white rounded-full transition-transform duration-300 ease-in-out ${
                      formData.btnSubCategory ? "translate-x-6" : ""
                    }`}
                    style={{ pointerEvents: "none" }}
                  />
                </div>
              </div>

             
              <div className="flex justify-between items-center">
                <label className="text-lg font-medium">
                  Razorpay (<b>{formData.btnRazorpay ? "ON" : "OFF"}</b>)
                </label>
                <div className="relative">
                  <input
                    className="appearance-none w-14 h-6 rounded-full bg-gray-300 checked:bg-blue-600 transition duration-300 ease-in-out cursor-pointer"
                    type="checkbox"
                    id="btnRazorpay"
                    checked={formData.btnRazorpay}
                    onChange={handleInputChange}
                  />
                  <span
                    className={`absolute left-0 top-0 w-6 h-5 bg-white rounded-full transition-transform duration-300 ease-in-out ${
                      formData.btnRazorpay ? "transform translate-x-6" : ""
                    }`}
                    style={{ pointerEvents: "none" }}
                  />
                </div>
              </div>

             
              <div>
                <label
                  htmlFor="txtPaymentId"
                  className="block text-base font-semibold mb-2"
                >
                  PaymentId (Razor Pay Key)
                </label>
                <input
                  type="text"
                  id="txtPaymentId"
                  className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.txtPaymentId}
                  onChange={handleInputChange}
                />
              </div>

           
              <div>
                <label className="block text-base font-semibold mb-2">
                  Minimum Order <i className="text-red-500">*</i>
                </label>
                <input
                  type="number"
                  id="txtUrl"
                  className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.txtUrl}
                  onChange={handleInputChange}
                />
              </div>
                


              <div>
                <label
                  htmlFor="WhatsAppUrl"
                  className="block text-base font-semibold mb-2"
                >
           What's App Url
                </label>
                <input
                  type="text"
                  id="WhatsAppUrl"
                  className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.WhatsAppUrl}
                  onChange={handleInputChange}
                />
              </div>
                


              <div>
                <label
                  htmlFor="OwnerMobileNo"
                  className="block text-base font-semibold mb-2"
                >
                 OwnerMobileNumber
                </label>
                <input
                  type="text"
                  id="OwnerMobileNo"
                  className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.OwnerMobileNo}
                  onChange={handleInputChange}
                />
              </div>





              <div>
              <button
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                  type="submit"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>


          <div>
            <div className="grid gap-6">

              <div>
                <label className="block text-base font-semibold mb-2">
                  Base Color Code
                </label>
                <input
                  type="text"
                  id="basecolorCode"
                  className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.basecolorCode}
                  onChange={handleInputChange}
                />
              </div>

            
              <div>
                <label className="block text-base font-semibold mb-2">
                  Shadow Color Code
                </label>
                <input
                  type="text"
                  id="shadowcolorCode"
                  className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.shadowcolorCode}
                  onChange={handleInputChange}
                />
              </div>

       
              <div>
                <label className="block text-base font-semibold mb-2">
                  White Color Code
                </label>
                <input
                  type="text"
                  id="whitecolorCode"
                  className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.whitecolorCode}
                  onChange={handleInputChange}
                />
              </div>

      
              <div>
                <label className="block text-base font-semibold mb-2">
                  Light Black Color Code
                </label>
                <input
                  type="text"
                  id="lightblackcolorCode"
                  className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.lightblackcolorCode}
                  onChange={handleInputChange}
                />
              </div>

           
              <div>
                <label className="block text-base font-semibold mb-2">
                  Firebase Text ID
                </label>
                <input
                  type="text"
                  id="Firebasetext"
                  className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.Firebasetext}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
