import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { loginUser } from '../services/AdminCommanFuncation';
import AdminLogo from '../assets/logoadmin.png';
import UserLogo from '../assets/user.png';
import PasswordLogo from '../assets/password.png';
import ErrorModal from "../components/error";
import SuccessModal from "../components/sucessmodel";

const Login = () => {
  const { setIsAuthenticated } = useAuth();
  const [loginData, setLoginData] = useState({
    Username: '',
    Password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState(""); // Unified modal message
  const navigate = useNavigate();

  const handleChange = (e) => {
    setErrors({});
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const validate = () => {
    let tempErrors = {};
    if (!loginData.Username) {
      tempErrors.Username = "Username is required";
    }
    if (!loginData.Password) {
      tempErrors.Password = "Password is required";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const closeModal = () => {
    setIsErrorModalOpen(false);
    setIsSuccessModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await loginUser(loginData.Username, loginData.Password);

      if (!response.ok) {
        setModalMessage("Invalid Username or Password");
        setIsErrorModalOpen(true);
        throw new Error("Invalid Username or Password");
      }

      const data = await response.json();

      if (data && data.length > 0) {
        // Save user details in localStorage
        localStorage.setItem("userLogin", "true");
        localStorage.setItem("adminuserid", data[0].Id);
        localStorage.setItem("adminusername", data[0].Username);
        localStorage.setItem("FireBaseId", data[0].CName);

        setIsAuthenticated(true);
        setModalMessage("Login successful! Redirecting...");
        setIsSuccessModalOpen(true);

        // Redirect after a short delay
        setTimeout(() => {
          navigate("/index");
        }, 2000);
      } else {
        throw new Error("Invalid response data.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setModalMessage(error.message || "An error occurred during login.");
      setIsErrorModalOpen(true);
    }
  };

  return (
    <div className="bg-gradient-to-b from-cyan-500 to-blue-500 min-h-screen flex items-center justify-center">
      <div className="bg-white bg-opacity-30 backdrop-blur-lg rounded-lg p-8 mx-auto max-w-md w-full shadow-lg">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-700 mt-4">Admin Login</h2>
        </div>

        <div className="header mb-6">
          <div className="logo mb-4">
            <img src={AdminLogo} alt="Admin Logo" className="w-56 mx-auto" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username field */}
          <div className="relative flex items-center border-b border-gray-300 pb-2">
            <div className="absolute left-4 top-3">
              <img src={UserLogo} alt="Username Icon" className="w-5" />
            </div>
            <input
              type="text"
              name="Username"
              value={loginData.Username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full pl-12 focus:outline-none text-gray-700 py-2 rounded-lg"
            />
          </div>
          {errors.Username && <div className="text-red-500 text-sm mt-1">{errors.Username}</div>}

          {/* Password field */}
          <div className="relative flex items-center border-b border-gray-300 pb-2 mt-4">
            <div className="absolute left-4 top-3">
              <img src={PasswordLogo} alt="Password Icon" className="w-5" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              name="Password"
              value={loginData.Password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full pl-12 focus:outline-none text-gray-700 py-2 rounded-lg"
            />
            <button type="button" onClick={handleClickShowPassword} className="ml-2 text-gray-500">
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.Password && <div className="text-red-500 text-sm mt-1">{errors.Password}</div>}

          {/* Submit button */}
          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
            >
              Login
            </button>
          </div>
        </form>
      </div>
      {/* Modals */}
      
      {isErrorModalOpen && <ErrorModal message={modalMessage} onClose={closeModal} />}
      {isSuccessModalOpen && <SuccessModal message={modalMessage} onClose={closeModal} />}
    </div>
  );
};

export default Login;
