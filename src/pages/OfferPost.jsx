import React, { useState, useEffect } from "react";
import Slider from "../components/sidebar";
import { useNavigate } from "react-router-dom";
import { fetcOfferpost , deleteOfferPost} from "../services/offerpost";
import { ImagePathRoutes } from '../routes/imagePathRoutes';
import { MdDelete } from "react-icons/md";
import { GrEdit } from "react-icons/gr";
import SuccessModal from "../components/sucessmodel";
import ErrorModal from "../components/error";
import '../index.css'

const OfferPostPanel = () => {
  const [numRows, setNumRows] = useState(5); // Default rows to show
  const [offers, setOffers] = useState([]); // Offers to display
  const [currentPage, setCurrentPage] = useState(1); // Pagination
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [adminId, setAdminId] = useState(null);
  const [areaData, setAreaData] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const navigate = useNavigate();

  const handleRowChange = (e) => {
    setNumRows(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page
  };

  const handlePagination = (direction) => {
    setCurrentPage((prevPage) =>
      direction === "next" ? prevPage + 1 : Math.max(prevPage - 1, 1)
    );
  };
  const handleNavigate = (id) => {
  
    navigate(`/AddOfferPost/${id}`);
  }

  useEffect(() => {
    const adminUserId = JSON.parse(localStorage.getItem("adminuserid"));
    if (!adminUserId) {
      alert("Session Closed. Please Login Again!");
      setTimeout(() => navigate("/"), 2000);
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
      const data = await fetcOfferpost(adminId);
      console.log(data)
     
      if (data && data.length) {
        setOffers(data);
        localStorage.setItem("AdminOfferPost",JSON.stringify(data));
      } else {
        setOffers([]);
        setError("No data available.");
      }
    } catch (err) {
      setError("Failed to fetch data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      const isDeleted = await deleteOfferPost(id);
      if (isDeleted) {
         setOffers((prevOffers) => prevOffers.filter((offer) => offer.Id !== id));
         setAreaData((prevAreaData) => prevAreaData.filter((area) => area.Id !== id));
         setSuccessMessage("product deleted successfully!");
         setIsSuccessModalOpen(true);
      } else {
        setError("Failed to delete the area. Please try again.");
      }
    } catch (error) {
      setError("Error deleting the area: " + error.message);
    }
  };

 

  const closeModal = () => {
    setIsErrorModalOpen(false);
  };

  const closeSuccessModal = () => {  
    setIsSuccessModalOpen(false);
  };

 
  const startIndex = (currentPage - 1) * numRows;
  const paginatedOffers = offers.slice(startIndex, startIndex + numRows);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-shrink-0">
        <Slider />
      </div>

      <div className="container mx-auto">
        <div className="bg-white shadow-md rounded-lg mb-7">
          <div className="border-b p-4">
            <h5 className="text-xl font-semibold">Offer Post Panel</h5>
          </div>

          <div className="border-b p-4 flex justify-between items-center">
            <button
            onClick={() => handleNavigate()}
              href="./addOfferPost.html"
              className="bg-[var(--primary-button-bg)]  text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center"
            >
              <i className="bi bi-plus-square-dotted mr-2"></i>
              Add Offer Post
            </button>
            <div className="flex items-center">
              <label htmlFor="maxRows" className="text-sm font-medium mr-4">
                Select Number Of Rows
              </label>
              <select
                id="maxRows"
                className="w-32 p-2 border border-gray-300 rounded-md"
                value={numRows}
                onChange={handleRowChange}
              >
                <option value="1000">Show ALL Rows</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto px-6 py-4">
  {loading ? (
    <p className="text-center py-4 text-blue-500">Loading...</p>
  ) : error ? (
    <p className="text-center py-4 text-red-500">{error}</p>
  ) : (
    <table className="min-w-full table-auto border-separate border-spacing-0 neumorphism-table">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">S.No</th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Web Poster</th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Mobile Poster</th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Offer Name</th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
        </tr>
      </thead>
      <tbody className="bg-white">
        {offers.length > 0 ? (
          offers.map((offer, index) => (
            <React.Fragment key={offer.Id}>
              <tr className="hover:bg-gray-50 transition duration-300 ease-in-out">
                <td className="px-6 py-4 text-sm font-medium text-gray-700">{startIndex + index + 1}</td>
                <td className="border px-6 py-4">
                  <img
                    src={ImagePathRoutes.OfferPostImagePath + offer.Imagepath}
                    alt={offer.webPoster}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                </td>
                <td className="border px-6 py-4">
                  <img
                    src={ImagePathRoutes.OfferPostImagePath + offer.MobileImagepath}
                    alt={offer.mobilePoster}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-700">{offer.OfferName}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-700 flex space-x-4 mt-6">
                  <button
                    onClick={() => handleNavigate(offer.Id)}
                    className="flex items-center px-3 py-1 bg-blue-100 text-blue-600 rounded-2xl hover:bg-blue-200 transition duration-300"
                  >
                    <GrEdit className="mr-1" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteClick(offer.Id)}
                    className="flex items-center px-3 py-1 bg-red-100 text-red-600 rounded-2xl hover:bg-red-200 transition duration-300"
                  >
                    <MdDelete className="mr-1" />
                    <span>Delete</span>
                  </button>
                </td>
              </tr>
              <tr>
                <td colSpan="6" className="border-b border-gray-300"></td>
              </tr>
            </React.Fragment>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="text-gray-500 text-center py-4">No offers available</td>
          </tr>
        )}
      </tbody>
    </table>
  )}
</div>


          <div className="flex justify-between p-4">
            <button
              onClick={() => handlePagination("prev")}
              disabled={currentPage === 1}
              className={`py-1 px-3 rounded-md ${
                currentPage === 1 ? "bg-gray-300" : "bg-gray-200 hover:bg-gray-400"
              }`}
            >
              Prev
            </button>
            <button
              onClick={() => handlePagination("next")}
              disabled={startIndex + numRows >= offers.length}
              className={`py-1 px-3 rounded-md ${
                startIndex + numRows >= offers.length
                  ? "bg-gray-300"
                  : "bg-gray-200 hover:bg-gray-400"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      {isSuccessModalOpen && <SuccessModal message={successMessage} onClose={closeSuccessModal} />}
      {isErrorModalOpen && <ErrorModal message={errorMessage} onClose={closeModal} />}
    </div>
  );
};

export default OfferPostPanel;
