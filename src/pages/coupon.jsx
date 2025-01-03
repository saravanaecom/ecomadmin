import { useNavigate } from 'react-router-dom';
import { MdDelete } from "react-icons/md";
import { GrEdit } from "react-icons/gr";
import React, { useEffect, useState } from "react";
import Slider from "../components/sidebar";
import { fetchSelectCoupon, DeleteCoupon } from "../services/addcouppon";

const Coupon = () => {
  const [adminId, setAdminId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rows, setRows] = useState(10);
  const [searchMobile, setSearchMobile] = useState("");
  const [searchCouponCode, setSearchCouponCode] = useState("");
  const [searchFromDate, setSearchFromDate] = useState("");
  const [searchToDate, setSearchToDate] = useState("");
  const [searchStatus, setSearchStatus] = useState("");  // Added search status

  const navigate = useNavigate();

  // Date formatting function
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = d.getFullYear();
    return `${year}-${month}-${day}`; // This format will be consistent for filtering and search
  };

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
          const CouponData = await fetchSelectCoupon(adminId);
          localStorage.setItem("CouponDataList", JSON.stringify(CouponData));
          setCoupon(CouponData);
          setFilteredProducts(CouponData);
          setTotalPages(Math.ceil(CouponData.length / rows));
        } catch (error) {
          console.error("Failed to fetch CouponData", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    }
  }, [adminId, rows]);

  const handleNavigate = (id) => {
    navigate(`/Addcoupon/${id}`);
  };

  const handleDeleteClick = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this coupon?");
    if (!confirmDelete) return;

    try {
      const isDeleted = await DeleteCoupon(id);

      if (isDeleted) {
        setCoupon((prevCoupons) =>
          prevCoupons.filter((coupon) => coupon.Id !== id)
        );
        alert("Coupon deleted successfully.");
      } else {
        alert("Failed to delete the coupon. Please try again.");
      }
    } catch (error) {
      alert("Error deleting the coupon: " + error.message);
    }
  };

  const handleAddCoupon = () => {
    navigate('/Addcoupon/:id');
  };

  // Dynamic Filtering for Mobile Number, Coupon Code, Date Range, and Status
  useEffect(() => {
    let filtered = coupon;

    // Filter by Mobile Number
    if (searchMobile) {
      filtered = filtered.filter(c =>
        c.MobileNo?.toString().includes(searchMobile)
      );
    }

    // Filter by Coupon Code
    if (searchCouponCode) {
      filtered = filtered.filter(c =>
        c.code?.toLowerCase().includes(searchCouponCode.toLowerCase())
      );
    }

    // Filter by From Date
    if (searchFromDate) {
      const fromDate = new Date(searchFromDate);
      filtered = filtered.filter(c =>
        new Date(c.expiresAt) >= fromDate
      );
    }

    // Filter by To Date
    if (searchToDate) {
      const toDate = new Date(searchToDate);
      filtered = filtered.filter(c =>
        new Date(c.expiresAt) <= toDate
      );
    }

    // Filter by Status
    if (searchStatus) {
      filtered = filtered.filter(c =>
        c.isActive === parseInt(searchStatus)
      );
    }

    setFilteredProducts(filtered);
  }, [searchMobile, searchCouponCode, searchFromDate, searchToDate, searchStatus, coupon]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="flex-shrink-0">
        <Slider />
      </div>

      {/* Main Content */}
      <div className="flex-grow p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Coupon</h1>
          <button
            onClick={handleAddCoupon}
            className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition duration-300"
          >
            + Add Coupon
          </button>
        </div>

        {/* Search Filters */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 grid grid-cols-2 gap-4 md:grid-cols-5">
          <input
            type="text"
            placeholder="Search Mobile Number"
            value={searchMobile}
            onChange={(e) => setSearchMobile(e.target.value)}
            className="p-2 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Search Coupon Code"
            value={searchCouponCode}
            onChange={(e) => setSearchCouponCode(e.target.value)}
            className="p-2 border rounded-lg"
          />
          <input
            type="date"
            value={searchFromDate}
            onChange={(e) => setSearchFromDate(e.target.value)}
            className="p-2 border rounded-lg"
          />
          <input
            type="date"
            value={searchToDate}
            onChange={(e) => setSearchToDate(e.target.value)}
            className="p-2 border rounded-lg"
          />
          {/* <select
            value={searchStatus}
            onChange={(e) => setSearchStatus(e.target.value)}
            className="p-2 border rounded-lg"
          >
            <option value="">All Status</option>
            <option value="1">Active</option>
            <option value="0">Not Active</option>
          </select> */}
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full bg-white border border-gray-200">
            {/* Table Header */}
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="py-2 px-4 border-b text-left">Coupon Code</th>
                <th className="py-2 px-4 border-b text-left">Customer Name</th>
                <th className="py-2 px-4 border-b text-left">Mobile No</th>
                <th className="py-2 px-4 border-b text-left">Status</th>
                <th className="py-2 px-4 border-b text-left">Expires At</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {filteredProducts.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-gray-100 transition-colors duration-200">
                  <td className="py-2 px-4 border-b">{coupon.code}</td>
                  <td className="py-2 px-4 border-b">{coupon.AccountName}</td>
                  <td className="py-2 px-4 border-b">{coupon.MobileNo}</td>
                  <td className={`py-2 px-4 border-b ${coupon.isActive === 1 ? "text-green-600" : "text-red-600"}`}>
                    {coupon.isActive === 1 ? "Active" : "Not Active"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {formatDate(coupon.expiresAt)}
                  </td>
                  <td>
                    <button onClick={() => handleNavigate(coupon.Id)} className="text-blue-600 hover:text-blue-800">
                      <GrEdit />
                    </button>
                    <button onClick={() => handleDeleteClick(coupon.Id)} className="ml-4 text-red-600 hover:text-red-800">
                      <MdDelete />
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

export default Coupon;
