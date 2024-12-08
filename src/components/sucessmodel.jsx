import React, { useEffect } from 'react';

const SuccessModal = ({ message, onClose }) => {
  // Automatically close the modal after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000); // 2 seconds

    // Cleanup timer on component unmount
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96 max-w-sm transform transition-all duration-500 ease-in-out">
        <h3 className="text-2xl font-semibold text-green-600 text-center">Success</h3>
        <p className="text-green-500 mt-4 text-center text-lg">{message}</p>
        <div className="mt-6 flex justify-center">
       
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
