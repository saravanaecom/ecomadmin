import React from 'react';
import { FiAlertCircle } from 'react-icons/fi'; 

const ErrorModal = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-red-100 to-red-50 p-8 rounded-xl shadow-2xl w-96 relative">
        <div className="flex items-center gap-3 mb-4">
          <FiAlertCircle className="text-red-600 text-2xl" />
          <h3 className="text-2xl font-bold text-red-700">Error</h3>
        </div>
        <p className="text-red-600 text-sm leading-relaxed">{message}</p>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 focus:ring-2 focus:ring-red-500"
          >
            Close
          </button>
        </div>
        <div className="absolute -top-4 -right-4 bg-red-500 w-12 h-12 rounded-full shadow-lg animate-ping opacity-50"></div>
      </div>
    </div>
  );
};

export default ErrorModal;
