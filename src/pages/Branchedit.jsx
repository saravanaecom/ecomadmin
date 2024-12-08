import React, { useEffect, useState } from "react";
import Slider from "../components/sidebar";
import { useParams } from "react-router-dom";
import ErrorModal from "../components/error";
import SuccessModal from "../components/sucessmodel";
import { insertSelectBranchAdmin } from "../services/branch";
import { useNavigate } from "react-router-dom";
const Branchedit = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    branchName: "",
    userName: "",
    password: "",
    areaName: "",
    pincode: "",
    address1: "",
    address2: "",
    city: "",
    landMark: "",
    email: "",
    mobileNo1: "",
    mobileNo2: "",
    latitude: "",
    longitude: "",
    upiId: "",
    activeStatus: true,
  });
   const navigate = useNavigate();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const s = localStorage.getItem("AdminBranch");
    const CompanyList = JSON.parse(s);
    const selectedBranch = CompanyList?.find(branch => branch.Id === parseInt(id));

    if (selectedBranch) {
      setFormData({
        branchName: selectedBranch.BranchName,
        userName: selectedBranch.Username,
        password: selectedBranch.Password,
        areaName: selectedBranch.AreaName,
        pincode: selectedBranch.Pincode,
        address1: selectedBranch.Address1,
        address2: selectedBranch.Address2,
        city: selectedBranch.City,
        landMark: selectedBranch.LandMark,
        email: selectedBranch.Email,
        mobileNo1: selectedBranch.MobileNo1,
        mobileNo2: selectedBranch.MobileNo2,
        latitude: selectedBranch.Latitude,
        longitude: selectedBranch.Longitude,
        upiId: selectedBranch.UpiId,
        activeStatus: selectedBranch.CStatus,
      });
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [id]: type === "checkbox" ? checked : value,
    });
  };

  const clearFields = () => {
    setFormData({
      branchName: "",
      userName: "",
      password: "",
      areaName: "",
      pincode: "",
      address1: "",
      address2: "",
      city: "",
      landMark: "",
      email: "",
      mobileNo1: "",
      mobileNo2: "",
      latitude: "",
      longitude: "",
      upiId: "",
      activeStatus: true,
    });
  };

  const validateInputs = () => {
    const { branchName, userName, password, areaName, pincode, address1, city, email, mobileNo1 } = formData;

    if (!branchName) {
      setModalMessage("Enter Branch Name");
      setIsErrorModalOpen(true);
      return false;
    } else if (!userName) {
      setModalMessage("Enter User Name");
      setIsErrorModalOpen(true);
      return false;
    } else if (!password) {
      setModalMessage("Enter Password");
      setIsErrorModalOpen(true);
      return false;
    } else if (!areaName) {
      setModalMessage("Enter Area Name");
      setIsErrorModalOpen(true);
      return false;
    } else if (!pincode) {
      setModalMessage("Enter Pincode");
      setIsErrorModalOpen(true);
      return false;
    } else if (!address1) {
      setModalMessage("Enter Address 1");
      setIsErrorModalOpen(true);
      return false;
    } else if (!city) {
      setModalMessage("Enter City");
      setIsErrorModalOpen(true);
      return false;
    } else if (!email) {
      setModalMessage("Enter Email");
      setIsErrorModalOpen(true);
      return false;
    } else if (!mobileNo1) {
      setModalMessage("Enter Mobile No 1");
      setIsErrorModalOpen(true);
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setModalMessage("Invalid Email Address");
      setIsErrorModalOpen(true);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateInputs()) {
      const objlist = {
        Id: id,
        CompanyRefId: 0,
        CCode: 0,
        CName: formData.branchName,
        BranchName: formData.branchName,
        ComputerName: formData.userName,
        Password: formData.password,
        Username: formData.userName,
        Address1: formData.address1,
        Address2: formData.address2,
        City: formData.city,
        LandMark: formData.landMark,
        Pincode: formData.pincode,
        MobileNo1: formData.mobileNo1,
        MobileNo2: formData.mobileNo2,
        Latitude: formData.latitude,
        Longitude: formData.longitude,
        Email: formData.email,
        UpiId: formData.upiId,
        AreaName: formData.areaName,
        Active: formData.activeStatus ? 1 : 0,
      };

      try {
        const data = await insertSelectBranchAdmin([objlist]);
        if (data) {
          setModalMessage("Branch updated successfully!");
          setIsSuccessModalOpen(true);
        } else {
          setModalMessage("Failed to update the branch.");
          setIsErrorModalOpen(true);
        }
      } catch (error) {
        setModalMessage("An error occurred while updating the branch.");
        setIsErrorModalOpen(true);
      }
    }
  };

  const closeModal = () => {
    setIsErrorModalOpen(false);
    setIsSuccessModalOpen(false);
  };

  return (
    <div className="flex h-screen bg-white py-6">
      <div className="flex-1">
        <Slider />
      </div>
      <div className="container mx-auto">
        <div className="bg-white shadow-lg border-0 mb-7 p-6">
          <h5 className="mb-4 text-xl font-semibold">Edit Branch</h5>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[{ label: "Branch Name", id: "branchName" }, { label: "User Name", id: "userName" }, { label: "Password", id: "password" }, { label: "Area Name", id: "areaName" }, { label: "Pincode", id: "pincode" }, { label: "Address 1", id: "address1" }, { label: "City", id: "city" }].map(({ label, id }) => (
                <div key={id} className="space-y-2">
                  <label className="block text-sm font-medium">
                    {label} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id={id}
                    value={formData[id]}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
              ))}

              <div className="flex items-center space-x-2 mt-4">
                <label className="text-sm font-medium">
                  Active Status <span className="text-red-500">*</span>
                </label>
                <input
                  type="checkbox"
                  id="activeStatus"
                  checked={formData.activeStatus}
                  onChange={handleInputChange}
                  className="form-checkbox"
                />
              </div>

              <div className="mt-6 flex space-x-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 transform hover:scale-105"
                >
                  Update Branch
                </button>
                <button
                  type="button"
                  onClick={clearFields}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300 transform hover:scale-105"
                >
                  Clear
                </button>
                <button
                       onClick={() => navigate("/branch")}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 transform hover:scale-105"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          <div>
            <form className="space-y-4">
              {[{ label: "Landmark", id: "landMark" }, { label: "Email", id: "email" }, { label: "Mobile No 1", id: "mobileNo1" }, { label: "Mobile No 2", id: "mobileNo2" }, { label: "Latitude", id: "latitude" }, { label: "Longitude", id: "longitude" }, { label: "UPI ID", id: "upiId" }].map(({ label, id }) => (
                <div key={id} className="space-y-2">
                  <label className="block text-sm font-medium">
                    {label}
                  </label>
                  <input
                    type="text"
                    id={id}
                    value={formData[id]}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
              ))}
            </form>
          </div>
        </div>
      </div>
      {isErrorModalOpen && <ErrorModal message={modalMessage} onClose={closeModal} />}
      {isSuccessModalOpen && <SuccessModal message={modalMessage} onClose={closeModal} />}
    </div>
  );
};

export default Branchedit;
