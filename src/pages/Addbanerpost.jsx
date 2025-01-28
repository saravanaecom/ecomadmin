import Slider from "../components/sidebar";
import ServerURL from "../server/serverUrl";
import { useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { ImagePathRoutes } from '../routes/imagePathRoutes';
import { insertbannerpost } from "../services/BannerPost";
import ErrorModal from "../components/error";
import SuccessModal from "../components/sucessmodel";
import { fetchSelectCategory} from "../services/Category";
const AddBannerPost = () => {
  const { id } = useParams();
  const [Bannerimg1, setBannerimg1] = useState("");
  const [Bannerimg2, setBannerimg2] = useState("");
  const [Bannerimg3, setBannerimg3] = useState("");
  const [Bannerimg4, setBannerimg4] = useState("");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [adminId, setAdminId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [selectcategory,setSelectcategory]=useState("")
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); 
  const [error, setError] = useState(null); 
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const clearForm = () => {
    // Reset all banner image states
    setBannerimg1('');
    setBannerimg2('');
    setBannerimg3('');
    setBannerimg4('');
    
    // Reset category if you're using it
    setCategory('');
    
    // Reset the file inputs by getting the elements and resetting their values
    const fileInputs = [
      'Filebannerimg1',
      'Filebannerimg2',
      'Filebannerimg3',
      'Filebannerimg4'
    ];
    
    fileInputs.forEach(inputId => {
      const fileInput = document.getElementById(inputId);
      if (fileInput) {
        fileInput.value = '';
      }
    });
  };
  const closeModal = () => {
    setIsErrorModalOpen(false);
  };

  const closeSuccessModal = () => {  
    setIsSuccessModalOpen(false);
  };

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
    const areas = JSON.parse(localStorage.getItem("Bannerpost"));
    if (areas) {
      const areaData = areas.find((area) => area.Id === parseInt(id, 10));
      if (areaData) {
        const Bannerimgl1 = areaData.Bannerimg1 ? areaData.Bannerimg1.replace('/categoryimages/', '') : null;
        const Bannerimgl2 = areaData.Bannerimg2 ? areaData.Bannerimg2.replace('/categoryimages/', '') : null;
        const Bannerimgl3 = areaData.Bannerimg3 ? areaData.Bannerimg3.replace('/categoryimages/', '') : null;
        const Bannerimgl4 = areaData.Bannerimg4 ? areaData.Bannerimg4.replace('/categoryimages/', '') : null;
        const selectcategory =areaData.Category;
        setSelectcategory(selectcategory)
        setBannerimg1(Bannerimgl1); 
        setBannerimg2(Bannerimgl2);
        setBannerimg3(Bannerimgl3);
        setBannerimg4(Bannerimgl4);
      }
    }
  }, [id]);


// fetch category 

useEffect(() => {
  if (adminId) {
    fetchCategoryData();
  }
}, [adminId]);

const fetchCategoryData = async () => {
  setLoading(true);
  setError(null);
  try {
    const data = await fetchSelectCategory(adminId);
    if (data) {
      setCategoryList(data);
      localStorage.setItem("Categories", JSON.stringify(data));
    }
  } catch (error) {
    setError("Error fetching category data: " + error.message);
    setIsErrorModalOpen(true);
  } finally {
    setLoading(false);
  }
};

   





  const handleImageUpload = async (e, type) => {
    const formData = new FormData();
    const file = e.target.files[0];
    if (file) {
      formData.append("MyImages", file);
      setLoading(true);
      
      try {
        const response = await fetch(`${ServerURL.PRODUCTION_HOST_URL}/api/CategoryEcomApp/UploadFileCategory`, {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
           
        if (response.ok) {
          setSuccessMessage("image upload successfully!");  
          setIsSuccessModalOpen(true); 
          if (type === "bannerimage1") {
            setBannerimg1(data);
          } else if (type === "bannerimage2") {
            setBannerimg2(data);
          } else if (type === "bannerimage3") {
            setBannerimg3(data);
          } else {
            setBannerimg4(data);
          }
        } else {
          setErrorMessage("Image upload failed!");
          setIsErrorModalOpen(true);
          
        }
      } catch (error) {
        console.error("Error uploading image:", error)
        setErrorMessage("An error occurred while uploading the image.");
        setIsErrorModalOpen(true);
      } finally {
        setLoading(false);
       
      }
    }
  };

  const handleSave1 = () => {
    console.log("Category:", category);
    console.log("Banner 1:", Bannerimg1);
    console.log("Banner 2:", Bannerimg2);
    console.log("Banner 3:", Bannerimg3);
    console.log("Banner 4:", Bannerimg4);
    alert("Banner Post Saved!");
  };

  let selectedId;

  if (id && !isNaN(parseInt(id))) {
    selectedId = parseInt(id);  // Parse the id from the URL if it's a valid number
  } else {
    selectedId = selectedCategory;  // Otherwise, use selectedCategory
  }


  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

     const objlist = {
      Id: selectedId,
      Comid: adminId,
      Category: null,
      ImagePath: null,
      Active: 1,
      Bannerimg1:Bannerimg1,
      Bannerimg2:Bannerimg2,
      Bannerimg3:Bannerimg3,
      Bannerimg4:Bannerimg4,
      Sort: 0,
    };
   console.log(objlist)
    try {
      const success = await insertbannerpost([objlist]);
      if (success) {
        setIsSuccessModalOpen(true)
        setSuccessMessage("Offer Post saved successfully!");
        navigate(`/bannerpost/:id`);
      } else {
        setErrorMessage("Failed to save the offer.");
        setIsErrorModalOpen(true);
      }
    } catch (error) {
      console.error("Error during offer post insertion:", error);
      setErrorMessage("An error occurred while saving the offer.");
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
      <div className="flex-grow py-6 bg-white">
        <div className="container mx-auto">
          {/* Card */}
          <div className="card shadow border-0 mb-7">
            <div className="card-header">
              <h5 className="mb-0 text-xl font-semibold">Add Banner Post</h5>
            </div>
          </div>

          {/* Form Row */}
          <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select 
  value={selectedCategory} 
  onChange={(e) => {
    console.log("Selected Category ID:", e.target.value);
    setSelectedCategory(e.target.value);
  }}
  className="w-full border rounded-md p-2"
>
  <option value="">Select a Category</option>
  {categoryList.map((item, index) => (
    <option key={index} value={item.Id}>
      {item.Category}
    </option>
  ))}
</select>

            </div>
          {/* <div className="col-12 p-5">
          <label className="form-label block text-3xl mb-2">Select Category Name</label>
            {/* Display selectcategory as a heading */}
            {/* {selectcategory && (
              <h2 className="text-2xl font-bold text-gray-800">{selectcategory}</h2>
            )}
          </div>  */}

          <div className="row flex flex-wrap">
            {/* Image Upload Section */}
            <div className="col-12 lg:col-6 p-5 w-1/2">
              <form className="shadow-lg p-5 bg-white rounded-md">
                {/* Banner Image 1 */}
                <div className="form-group mb-4">
                  <label className="block text-sm font-medium text-gray-700">Banner Image-1</label>
                  <div className="input-group flex items-center">
                    <input
                      type="file"
                      id="Filebannerimg1"
                      className="hidden"
                      accept="image/x-png,image/gif,image/jpeg,image/svg"
                      onChange={(e) => handleImageUpload(e, "bannerimage1")}
                    />
                    <label htmlFor="Filebannerimg1" className="cursor-pointer bg-blue-500 text-white p-2 rounded mr-2">
                      Choose Image
                    </label>
                    <span className="text-gray-600">{Bannerimg1}</span>
                  </div>
                  <div className="mt-2">
                    <img
                      id="Filebannerimg1"
                      src={Bannerimg1 ? (ImagePathRoutes.CategoryImagePath + Bannerimg1) : 'https://i.gifer.com/origin/e0/e0ea055299e92297b2ec0ef1c80696bf_w200.gif'}
                      alt="Web Image"
                      className="w-44 h-36 rounded-lg"
                    />
                  </div>
                </div>

                {/* Banner Image 2 */}
                <div className="form-group mb-4">
                  <label className="block text-sm font-medium text-gray-700">Banner Image-2</label>
                  <div className="input-group flex items-center">
                    <input
                      type="file"
                      id="Filebannerimg2"
                      className="hidden"
                      accept="image/x-png,image/gif,image/jpeg,image/svg"
                      onChange={(e) => handleImageUpload(e, "bannerimage2")}
                    />
                    <label htmlFor="Filebannerimg2" className="cursor-pointer bg-blue-500 text-white p-2 rounded mr-2">
                      Choose Image
                    </label>
                    <span className="text-gray-600">{Bannerimg2}</span>
                  </div>
                  <div className="mt-2">
                    <img
                      id="Filebannerimg2"
                      src={Bannerimg2 ? (ImagePathRoutes.CategoryImagePath + Bannerimg2) : 'https://i.gifer.com/origin/e0/e0ea055299e92297b2ec0ef1c80696bf_w200.gif'}
                      alt="Web Image"
                      className="w-44 h-36 rounded-lg"
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Image Upload Section */}
            <div className="col-12 lg:col-6 p-5 w-1/2">
              <form className="shadow-lg p-5 bg-white rounded-md">
                {/* Banner Image 3 */}
                <div className="form-group mb-4">
                  <label className="block text-sm font-medium text-gray-700">Banner Image-3</label>
                  <div className="input-group flex items-center">
                    <input
                      type="file"
                      id="Filebannerimg3"
                      className="hidden"
                      accept="image/x-png,image/gif,image/jpeg,image/svg"
                      onChange={(e) => handleImageUpload(e, "bannerimage3")}
                    />
                    <label htmlFor="Filebannerimg3" className="cursor-pointer bg-blue-500 text-white p-2 rounded mr-2">
                      Choose Image
                    </label>
                    <span className="text-gray-600">{Bannerimg3}</span>
                  </div>
                  <div className="mt-2">
                    <img
                      id="Filebannerimg3"
                      src={Bannerimg3 ? (ImagePathRoutes.CategoryImagePath + Bannerimg3) : 'https://i.gifer.com/origin/e0/e0ea055299e92297b2ec0ef1c80696bf_w200.gif'}
                      alt="Web Image"
                      className="w-44 h-36 rounded-lg"
                    />
                  </div>
                </div>

                {/* Banner Image 4 */}
                <div className="form-group mb-4">
                  <label className="block text-sm font-medium text-gray-700">Banner Image-4</label>
                  <div className="input-group flex items-center">
                    <input
                      type="file"
                      id="Filebannerimg4"
                      className="hidden"
                      accept="image/x-png,image/gif,image/jpeg,image/svg"
                      onChange={(e) => handleImageUpload(e, "bannerimage4")}
                    />
                    <label htmlFor="Filebannerimg4" className="cursor-pointer bg-blue-500 text-white p-2 rounded mr-2">
                      Choose Image
                    </label>
                    <span className="text-gray-600">{Bannerimg4}</span>
                  </div>
                  <div className="mt-2">
                    <img
                      id="Filebannerimg4"
                      src={Bannerimg4 ? (ImagePathRoutes.CategoryImagePath + Bannerimg4) : 'https://i.gifer.com/origin/e0/e0ea055299e92297b2ec0ef1c80696bf_w200.gif'}
                      alt="Web Image"
                      className="w-44 h-36 rounded-lg"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Buttons */}
          <div className="form-group mt-5 flex pl-10">
            <button
              className="bg-blue-600 text-white px-6  rounded-md hover:bg-blue-700"
              type="button"
              onClick={handleSave}
            >
              Add Banner Post
            </button>
            <button
  className="bg-gray-500 text-white px-6 py-2 ml-5 rounded-md hover:bg-gray-600"
  type="button"
  onClick={clearForm}
>
  Clear
</button>
            <button
              onClick={() => navigate("/bannerpost/:id")}
         
              className="bg-red-600 text-white px-6 ml-5 py-2 rounded-md hover:bg-red-700"
              type="button"
            >
              <button       onClick={() => navigate("/bannerpost/:id")}  className="text-white">
                Cancel
              </button>
            </button>
          </div>
        </div>
      </div>
      {isSuccessModalOpen && <SuccessModal message={successMessage} onClose={closeSuccessModal} />}
      {isErrorModalOpen && <ErrorModal message={errorMessage} onClose={closeModal} />}
    </div>
  );
};

export default AddBannerPost;
