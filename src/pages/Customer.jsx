import React, { useState, useEffect } from "react";
import Slider from "../components/sidebar";
import { fetchSelectCoustomer,UpdateCustomer } from "../services/Customer";
import  customerimage from '../assets/customer-avat.jpg'
import { MdDelete } from "react-icons/md";
import { GrEdit } from "react-icons/gr";
const Customer = () => {
  const today = new Date().toISOString().split("T")[0];
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [status, setStatus] = useState("All");
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [loading, setLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); 

  const statuses = ["All", "Pending", "Cancel", "Accepted", "Delivered"];

  const companyId = localStorage.getItem("adminuserid");

  useEffect(() => {
    if (companyId) {
      fetchCustomers();
    } else {
      console.error("Company ID not found in localStorage");
    }
  }, [companyId]);

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSelectCoustomer(Number(companyId));
      if (data && Array.isArray(data)) {
        setCustomers(data);

        if (data.length > 0) {
          setIsChecked(data[0].GSTNo === '1');
        }
      } else {
        throw new Error("Unexpected API response");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  const handleUpdate = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to Update this coupon?");
    if (!confirmDelete) return;

    try {
      const isDeleted = await UpdateCustomer(id);

      if (isDeleted) {
        
        alert("Aera deleted successfully.");
      } else {
        alert("Failed to delete the coupon. Please try again.");
      }
    } catch (error) {
      alert("Error deleting the coupon: " + error.message);
    }
  };









  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);


  const openModal = (customer) => {
    setCurrentCustomer(customer);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCurrentCustomer(null);
    setIsModalOpen(false);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);  // Update the search term
  };
  const filteredCustomers = customers.filter(customer =>
    customer.MobileNo.includes(searchTerm)  // Filter by mobile number
  );

  const indexOfLastCustomer = currentPage * rowsPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - rowsPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);

  const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };;



  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="flex-shrink-0 text-white">
        <Slider />
      </div>

      {/* Main Content */}
      <div className="flex-1 py-6 bg-white">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold">Customer Panel</h1>
          </div>

          {/* Filters */}
          <div className="flex items-center mb-6 gap-4">
            <select
              className="border rounded-lg p-2"
              onChange={(e) => setCurrentPage(1)}
            >
              <option value="10">10 rows</option>
              <option value="15">15 rows</option>
              <option value="20">20 rows</option>
              <option value="50">50 rows</option>
            </select>
            <input
              type="text"
              placeholder="Search mobile..."
              className="border p-2 rounded-lg flex-grow"
              value={searchTerm}
              onChange={handleSearch}  // Call the search handler on change
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto px-6 py-4">
  <table className="min-w-full table-auto border-separate border-spacing-0 neumorphism-table">
    <thead className="bg-gray-100">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">S.No</th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer Name</th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Mobile No</th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
      </tr>
    </thead>
    <tbody className="bg-white">
      {loading ? (
        <tr>
          <td colSpan="6" className="text-gray-500 text-center py-4">Loading...</td>
        </tr>
      ) : error ? (
        <tr>
          <td colSpan="6" className="text-red-500 text-center py-4">{error}</td>
        </tr>
      ) : currentCustomers.length > 0 ? (
        currentCustomers.map((customer, index) => (
          <React.Fragment key={customer.Id}>
            <tr className="hover:bg-gray-50 transition duration-300 ease-in-out">
              <td className="px-6 py-4 text-sm font-medium text-gray-700">{index + 1}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-700">{customer.CustomerName}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-700">{customer.Email}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-700">{customer.MobileNo}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-700">
                {customer.Active === 1 ? (
                  <span className="inline-block bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-medium">
                    Active
                  </span>
                ) : (
                  <span className="inline-block bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-medium">
                    Inactive
                  </span>
                )}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-700 flex space-x-4">
                {/* Edit Button */}
                <button  onClick={() => openModal(customer)}
                  className="flex items-center px-3 py-1 bg-blue-100 text-blue-600 rounded-2xl hover:bg-blue-200 transition duration-300"
                >
              <GrEdit className="mr-1" />
              <span>Edit</span>
                </button>
 


             
                {/* Delete Button */}
         
              </td>
            </tr>

            {/* Horizontal Line */}
            <tr>
              <td colSpan="6" className="border-b border-gray-300"></td>
            </tr>
          </React.Fragment>
        ))
      ) : (
        <tr>
          <td colSpan="6" className="text-gray-500 text-center py-4">No data available</td>
        </tr>
      )}
    </tbody>
  </table>
</div>

          {/* Pagination */}
          <div className="mt-6 flex justify-center">
            <ul className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, idx) => (
                <li
                  key={idx}
                  onClick={() => handlePageChange(idx + 1)}
                  className={`cursor-pointer px-3 py-2 rounded ${
                    currentPage === idx + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {idx + 1}
                </li>
              ))}
            </ul>
          </div>

          {/* Modal */}
          {isModalOpen && currentCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white p-6 rounded-lg max-w-5xl w-full h-full relative transform transition-transform duration-500 ease-in-out scale-95 hover:scale-100 overflow-y-scroll"
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center bg-gray-300 hover:bg-gray-400 text-gray-700 hover:text-gray-900"
              style={{
                boxShadow: "4px 4px 8px #bebebe, -4px -4px 8px #ffffff",
              }}
            >
              &times;
            </button>

            {/* Heading */}
            <h2 className="text-lg font-bold mb-4 text-gray-800 text-center">
              Customer Details
            </h2>
            <div className="flex flex-col items-center">
              <img
                src={customerimage}
                alt="Customer Avatar"
                className="w-24 h-24 rounded-full mb-4"
              />
              <h4 className="text-lg font-semibold">{currentCustomer.CustomerName}</h4>
              <p className="text-gray-600">Customer</p>
            </div>

  {/* Checkbox Section */}
  <div className="mt-6 flex items-center">
              <input
                type="checkbox"
                id="checkboxOption"
                checked={isChecked}
                onChange={handleCheckboxChange}
                className="mr-2 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="checkboxOption"
                className="text-sm font-medium text-gray-700"
              >
               B2B Coustomer
              </label>
            </div>



            {/* Content */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600">Name</label>
              <input
                type="text"
                value={currentCustomer.CustomerName}
                disabled
                className="w-full mt-1 p-2 border rounded-lg bg-gray-100"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600">Email</label>
              <input
                type="text"
                value={currentCustomer.Email}
                disabled
                className="w-full mt-1 p-2 border rounded-lg bg-gray-100"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600">Mobile No</label>
              <input
                type="text"
                value={currentCustomer.MobileNo}
                disabled
                className="w-full mt-1 p-2 border rounded-lg bg-gray-100"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600">Address-1</label>
              <textarea
                value={currentCustomer.Address1}
                disabled
                className="w-full mt-1 p-2 border rounded-lg bg-gray-100"
              ></textarea>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600">Address-2</label>
              <textarea
                value={currentCustomer.Address2}
                disabled
                className="w-full mt-1 p-2 border rounded-lg bg-gray-100"
              ></textarea>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600">City</label>
              <input
                type="text"
                value={currentCustomer.City}
                disabled
                className="w-full mt-1 p-2 border rounded-lg bg-gray-100"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600">Pincode</label>
              <input
                type="text"
                value={currentCustomer.Pincode}
                disabled
                className="w-full mt-1 p-2 border rounded-lg bg-gray-100"
              />
            </div>

          
            <div className="mt-6 flex justify-end">
        <button
       
          onClick={() =>handleUpdate(currentCustomer.Id)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md"
          style={{
            boxShadow: "4px 4px 8px #bebebe, -4px -4px 8px #ffffff",
          }}
        >
          Update
        </button>
      </div>
          </div>
        </div>
      )}

        </div>
      </div>
    </div>
  );
};

export default Customer;
