import React, { useState, useEffect } from "react";
import Slider from "../components/sidebar";
import { insertCoupon, fetchSelectCoustomer } from "../services/addcouppon";
import { useParams, useNavigate } from "react-router-dom";
import SuccessModal from "../components/sucessmodel";
import ErrorModal from "../components/error";

const AddCoupon = () => {
  const { id } = useParams();
  const [code, setCode] = useState('');
  const [CustomerName, setCustomerName] = useState('');
  const [CustomerRefId, setCustomerRefId] = useState();
  const [MobileNo, setMobileNo] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adminId, setAdminId] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  useEffect(() => {
    const Couponlists = JSON.parse(localStorage.getItem("CouponDataList"));
    if (Couponlists) {
      const Coupon = Couponlists.find((Coupon) => Coupon.Id === parseInt(id));
      console.log(Coupon)
      if (Coupon) {
        const AccountName =Coupon.AccountName;
        const Code =Coupon.code;
        const formattedDate = Coupon.expiresAt
        ? new Date(Coupon.expiresAt).toISOString().split("T")[0]
        : '';
        const MobileNo =Coupon.MobileNo;
        
        const isActive = Coupon.isActive === 1 ? true : false;
        setCustomerName(AccountName);
        setCode(Code);
        setMobileNo(MobileNo);
        setIsActive(isActive);
        setExpiresAt(formattedDate);
      }
    }
  }, [id]);



  const closeSuccessModal = () => {  
    setIsSuccessModalOpen(false);
  };


  const closeModal = () => {
    setIsErrorModalOpen(false);
  };
  // ✅ Fetch Admin ID from Local Storage
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

  // ✅ Fetch Customers
  useEffect(() => {
    if (adminId) {
      fetchCustomers();
    }
  }, [adminId]);

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSelectCoustomer(Number(adminId));
      if (data && Array.isArray(data)) {
        setCustomers(data);
      } else {
        throw new Error("Unexpected API response");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Mobile Input and Show Suggestions
  const handleMobileChange = (e) => {
    const value = e.target.value;
    setMobileNo(value);

    if (value) {
      const filtered = customers.filter((customer) =>
        customer.MobileNo.includes(value)
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  // ✅ Handle Suggestion Selection
  const handleSuggestionClick = (customer) => {
    setMobileNo(customer.MobileNo);
    setCustomerName(customer.CustomerName);
    setCustomerRefId(customer.Id);
    setSuggestions([]);
  };

  // ✅ Handle Save
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const objlist = {
      Id: id ? parseInt(id) : "",
      CompanyRefid: adminId,
      CustomerRefId: CustomerRefId,
      code: code,
      AccountName: CustomerName,
      MobileNo: MobileNo,
      isActive: isActive ? 1 : 0,
      expiresAt: expiresAt,
    };
  
    console.log(objlist);
  
    try {
      const success = await insertCoupon([objlist]);
      console.log(success);
  
      if (success === true) {
        setSuccessMessage("Coupon saved successfully!");
        setIsSuccessModalOpen(true);
        setTimeout(() => {
          navigate(`/Coupon`);
        }, 2000);
      } else {
        setErrorMessage(success || "This coupon is already Exits.");
        setIsErrorModalOpen(true);
      }
    } catch (error) {
      console.error("Error during coupon save:", error);
      setErrorMessage("An error occurred while saving the coupon.");
      setIsErrorModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="flex-shrink-0">
        <Slider />
      </div>

      {/* Main Content */}
      <div className="flex-grow p-8 flex justify-center items-center">
        <div className="w-full max-w-2xl bg-white shadow-md rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white text-center py-4">
            <h1 className="text-2xl font-bold">Add New Coupon</h1>
          </div>

          {/* Form */}
          <div className="p-6 space-y-4">
            {error && <p className="text-red-500 text-center">{error}</p>}

            <form onSubmit={handleSave} className="space-y-4">
              {/* Coupon Code */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Coupon Code</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  className="w-full p-2 border rounded-md"
                />
              </div>

              {/* Mobile Number with Suggestions */}
              <div className="relative">
                <label className="block text-gray-700 font-medium mb-1">Mobile Number</label>
                <input
                  type="tel"
                  pattern="[0-9]{10}"
                  placeholder="Enter Customer number"
                  value={MobileNo}
                  onChange={handleMobileChange}
                  required
                  className="w-full p-2 border rounded-md"
                />
                {suggestions.length > 0 && (
                  <ul className="absolute bg-white border w-full mt-1 max-h-48 overflow-auto rounded-md shadow-lg">
                    {suggestions.map((customer) => (
                      <li
                        key={customer.Id}
                        onClick={() => handleSuggestionClick(customer)}
                        className="p-2 cursor-pointer hover:bg-gray-100"
                      >
                        {customer.CustomerName} - {customer.MobileNo}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Customer Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Customer Name</label>
                <input
                  type="text"
                  value={CustomerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  disabled
                />
              </div>

              {/* Expiration Date */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Expiration Date</label>
                <input
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  required
                  className="w-full p-2 border rounded-md"
                />
              </div>

              {/* Active Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-5 h-5"
                />
                <label className="text-gray-700">Active</label>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-md"
                >
                  Add Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
        {isSuccessModalOpen && <SuccessModal message={successMessage} onClose={closeSuccessModal} />}
        {isErrorModalOpen && <ErrorModal message={errorMessage} onClose={closeModal} />}
      </div>
    </div>
  );
};

export default AddCoupon;
