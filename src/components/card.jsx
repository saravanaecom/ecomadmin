import { BsCreditCard } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";
import { IoMdTime } from "react-icons/io";
import { AiOutlineDollarCircle } from "react-icons/ai";
import React, { useState, useEffect } from "react";
import { fetchDashboardData } from "../services/DashBordServices";

const Card = ({ top = "0" }) => {
  const [dashboardData, setDashboardData] = useState(null);
  useEffect(() => {
    const fetchDashboardDataAsync = async () => {
      try {
        const adminUserId = localStorage.getItem("adminuserid");
        if (!adminUserId) {
          console.error("No admin user ID found in localStorage.");
          return;
        }

        const data = await fetchDashboardData(adminUserId);
        setDashboardData(data);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      }
    };

    fetchDashboardDataAsync();
  }, []);
  if (!dashboardData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6 z-10 left-12 position: relative">
      
      <div
        className="relative p-4 bg-[#f3f3f3] border border-gray-300 rounded-lg shadow-lg"
        style={{ top: top }}
      >
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm font-semibold text-gray-600 block mb-2">
              Order Pending
            </span>
            <span className="text-3xl font-bold text-gray-800">{dashboardData.Pendingorder}</span>
          </div>
          <div className="flex items-center justify-center w-12 h-12 bg-indigo-500 rounded-full">
            <i className="bi bi-credit-card text-white text-lg"><BsCreditCard/></i>
          </div>
        </div>
        <div className="mt-2 text-sm">
          {/* <span className="inline-block bg-indigo-200 text-indigo-800 px-2 py-1 text-xs rounded-full">
            <i className="bi bi-arrow-up"></i> 0%
          </span> */}
          <span className="text-gray-500 ml-2 text-xs">Since last month</span>
        </div>
      </div>

      <div
        className="relative p-4 bg-[#f3f3f3] border border-gray-300 rounded-lg shadow-lg"
        style={{ top: top }}
      >
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm font-semibold text-gray-600 block mb-2">
              Order Cancel
            </span>
            <span className="text-3xl font-bold text-gray-800">{dashboardData.Cancelledorder}</span>
          </div>
          <div className="flex items-center justify-center w-12 h-12 bg-red-500 rounded-full">
            <i className="bi bi-x-circle text-white text-lg"><RxCross1 /></i>
          </div>
        </div>
        <div className="mt-2 text-sm">
          {/* <span className="inline-block bg-red-200 text-red-800 px-2 py-1 rounded-full text-xs">
            <i className="bi bi-arrow-up"></i> 0%
          </span> */}
          <span className="text-gray-500 ml-2 text-xs">Since last month</span>
        </div>
      </div>

      <div
        className="relative p-4 bg-[#f3f3f3] border border-gray-300 rounded-lg shadow-lg"
        style={{ top: top }}
      >
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm font-semibold text-gray-600 block mb-2">
              Order Process
            </span>
            <span className="text-3xl font-bold text-gray-800">{dashboardData.TotalOrder}</span>
          </div>
          <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-full">
            <i className="bi bi-clock-history text-white text-lg"><IoMdTime /></i>
          </div>
        </div>
        <div className="mt-2 text-sm">
          {/* <span className="inline-block bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs">
            <i className="bi bi-arrow-down"></i> 0%
          </span> */}
          <span className="text-gray-500 ml-2 text-xs">Since last month</span>
        </div>
      </div>

      <div
        className="relative p-4 bg-[#f2f2f2] border border-gray-300 rounded-lg shadow-lg"
        style={{ top: top }}
      >
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm font-semibold text-gray-600 block mb-2">
              Total Income
            </span>
            <span className="text-3xl font-bold text-gray-800">₹{dashboardData.TotalOrderAmount}</span>
          </div>
          <div className="flex items-center justify-center w-12 h-12 bg-yellow-500 rounded-full">
            <i className="bi bi-coin text-white text-lg"><AiOutlineDollarCircle /></i>
          </div>
        </div>
        <div className="mt-2 text-sm">
          {/* <span className="inline-block bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs">
            <i className="bi bi-arrow-up"></i> 0%
          </span> */}
          <span className="text-gray-500 ml-2 text-xs">Since last month</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
