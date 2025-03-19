import React, { useState, useEffect } from "react";
import Slider from "../components/sidebar";
import ErrorModal from "../components/error";
import ServerURL from "../server/serverUrl";
import { ImagePathRoutes } from '../routes/imagePathRoutes';
import SuccessModal from "../components/sucessmodel";
import ReactQuill from 'react-quill';
import { useParams, useNavigate, useLocation } from "react-router-dom";

import { fetchSelectBrand ,DeleteBrand} from "../services/addBrand";
import { fetchSelectCategory,fetchSelectsubCategoryid,fetchMultiplePriceListNew,fetchProductIdAdmin,insertProduct } from "../services/addproducts";
import 'react-quill/dist/quill.snow.css';

const AddProductForm = () => {

  const toolbarOptions = [
    [{ font: [] }], // Font styles
    [{ size: ["small", false, "large", "huge"] }], // Font sizes
    ["bold", "italic", "underline", "strike"], // Bold, italic, underline
    [{ list: "ordered" }, { list: "bullet" }], // Lists
    ["link", "image"], // Links and images
    [{ align: [] }], // Text alignment
    ["clean"], // Clear formatting
  ];
  const location = useLocation(); 
  const { id } = useParams();
  const [productCode, setProductCode] = useState('');
  const [productName, setProductName] = useState('');
  const [tamilName, setTamilName] = useState('');
  const [categoryid, setCategoryid] = useState('');
  const [Brand, setBrand] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategory1, setSelectedCategory1] = useState("");
  const [dsubcategory, setSubCategoryd] = useState([]);
  const [multicategory, setMulticategory] = useState([]);
  const [selectedsubCategory, setSelectedSubCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [mrp, setMrp] = useState();
  const [saleRate, setSaleRate] = useState();
  const[returnsavailabilityDate,setReturnsavailabilityDate] =useState();
  const[AproximiateDate,setAproximiate] =useState();
  const [multiplePrice, setMultiplePrice] = useState(false);
  const[multiplepricemrp,setMultipricemrp]=useState("")
  const[multiplepriceweightType,setMultipriceweightType]=useState("")
  const[multiplepricesalerate,setMultipricesalerate]=useState("")
  const [weightType, setWeightType] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [activeStatus, setActiveStatus] = useState(true);
  const [ourchoice, setOurchoice] = useState(false);
  const [returnsavailability, setReturnsavailability] = useState(false);
  const [offerProduct, setOfferProduct] = useState(false);
  const [newProduct, setNewProduct] = useState(false);
  const [featureProduct, setFeatureProduct] = useState(false);
  const [inStock, setInStock] = useState(true);
  const [mainImage, setMainImage] = useState(null);
  const [AdditionalImage, setAdditionalImage] = useState(null);
  const [AdditionalImage1, setAdditionalImage1] = useState(null);
  const [moreImages, setMoreImages] = useState([null, null]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const navigate = useNavigate();
  const [adminId, setAdminId] = useState(null)
 
 // State for success modal
  
  const [ProductList,setProductList]=useState("")
  const [SubItemsList,setSubItemsList]=useState([


  ])
  const [MultiplePriceListTemp,setMultiplePriceListTemp]=useState([])


  const [multiplePriceList, setMultiplePriceList] = useState([]); 
  const [weightType1, setWeightType1] = useState(""); 
  const [mrp1, setMrp1] = useState(""); // Single entry for MRP
  const [saleRate1, setSaleRate1] = useState("")
  const [selectedUOM, setSelectedUOM] = useState("Kgs");

  const resetForm = () => {
    setProductCode('');
    setProductName('');
    setTamilName('');
    setCategoryid('');
    setSelectedCategory('');
    setSelectedSubCategory('');
    setMrp('');
    setSaleRate('');
    setMultiplePrice(false);
    setWeightType('');
    setProductDescription('');
    setMainImage(null);
    setAdditionalImage(null);
    setAdditionalImage1(null);
    setMoreImages([null, null]);
  };
  const handleFileChange = (index, event) => {
    const newImages = [...moreImages];
    newImages[index] = event.target.files[0];
    setMoreImages(newImages);
  };


console.log(SubItemsList)



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

 
  const validateForm = () => {
    if (!productName.trim()) {
      setErrorMessage("Product name is required");
      setIsErrorModalOpen(true);
      return false;
    }
    if (!categoryid) {
      setErrorMessage("Please select a category");
      setIsErrorModalOpen(true);
      return false;
    }
    if (!mrp || mrp <= 0) {
      setErrorMessage("Please enter a valid MRP");
      setIsErrorModalOpen(true);
      return false;
    }
    return true;
  };
  

  useEffect(() => {
    if (adminId) {
      setLoading(true);
      const fetchProducts = async () => {
        try {
          const BrandData = await fetchSelectBrand(adminId);
          if (Array.isArray(BrandData)) {
            setBrand(BrandData); // Update with array data
          } else {
            setBrand([]); // Fallback if not array
            console.error("Expected an array but got:", BrandData);
          }
        } catch (error) {
          console.error("Failed to fetch BrandData", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    }
  }, [adminId]);
  






  useEffect(() => {
    let isMounted = true;
  
    const fetchCategories = async () => {
      try {
        setLoading(true); // Add loading state
        const adminUserId = JSON.parse(localStorage.getItem("adminuserid"));
        if (!adminUserId) {
          alert("Session Closed. Please Login Again!");
          navigate("/");
          return;
        }
        
        const categoriesData = await fetchSelectCategory(adminUserId);
        if (isMounted) {
          setCategory(categoriesData);
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching categories:", error);
          setError("Error fetching categories.");
          setLoading(false);
        }
      }
    };
  
    // Call fetchCategories immediately when component mounts
    fetchCategories();
  
    return () => {
      isMounted = false;
    };
  }, []);
  useEffect(() => {
    if (categoryid) {
      fetchsubcategoryid();
    }
  }, [categoryid]);
  const fetchsubcategoryid = async () => {
    setLoading(true);
    try {
      const data = await fetchSelectsubCategoryid(adminId, categoryid);
      if (data) {
        setSubCategoryd(data); 
   
      }
    } catch (error) {
      setError("Error fetching subcategory data: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  const closeSuccessModal = () => {  
    setIsSuccessModalOpen(false);
  };

  // useEffect(() => {
  //   if (dsubcategory.length > 0) {
  //     setSelectedCategory(dsubcategory[0].Id);
  //   } else {
  //     setSelectedCategory(""); // Reset if no subcategories are available
  //   }
  // }, [dsubcategory]);

  useEffect(() => {
    const productlists = JSON.parse(localStorage.getItem("AdminProductList"));
    if (productlists) {
      const products = productlists.find((product) => product.Id === parseInt(id));
      console.log(products)
      if (products) {
        const mainimage = products.Img0 ? products.Img0.replace('/productimages/', '') : null;
        const aditionalimage1 = products.Img1 ? products.Img1.replace('/productimages/', '') : null;
        const aditionalimage2 = products.Img2 ? products.Img2.replace('/productimages/', '') : null;
        const productcode =products.ProductCode;
        const productname =products.Description;
        const producttamilname =products.TamilFont
        const selectsubcategory =products.SId;
        const selectcategory =products.CId;
        const MRPRate =products.MRP;
        const SaleRateed =products.Price;
        const AddMultiplPrices = products.MultiplePriceEnable === 1 ? true : false;
        const selectbrand =products.Brandname;
        const selectumo =products.UnitType;
        setMulticategory(products.ProductWeightType);
        const multiweight = products.ProductWeightType.WeightType
        const activestatus =products.Active === 1 ? true : false;
        const OfferProduct =products.OfferProduct === 1 ? true : false;
        const NewProduct =products.NewProduct === 1 ? true : false;
        const TopProduct =products.FeatureProduct === 1 ? true : false;
        const Instock =products.InStock === 1 ? true : false;
        const ProductDescription = products.ProductDescription ? products.ProductDescription : '';
        const returnsavailability = products.ReturnsAvailability === 1 ? true : false;
        const Aproximiate = products.Aproximiatedays;
        const Ourchoice = products.OurChoice === 1 ? true : false;
        const returnsavailabilityDate =products.ReturnPolicyDays;
        setReturnsavailabilityDate(returnsavailabilityDate);
        setAproximiate(Aproximiate);
        setOurchoice(Ourchoice);
        setReturnsavailability(returnsavailability);
        setProductCode(productcode);
        setProductName(productname);
        setTamilName(producttamilname);
        setSelectedCategory(selectsubcategory);
        setSelectedBrand (selectbrand)
        setCategoryid(selectcategory);
        setMrp(MRPRate);
        setSaleRate(SaleRateed);
        setMultiplePrice(AddMultiplPrices);
        setInStock(Instock);
        setActiveStatus(activestatus);
        setOfferProduct(OfferProduct);
        setFeatureProduct(TopProduct);
        setNewProduct(NewProduct);
        setProductDescription(ProductDescription);
        setMainImage(mainimage);
        setAdditionalImage1(aditionalimage2)
        setAdditionalImage(aditionalimage1);
        setSelectedUOM(selectumo);
         

      }
    }
  }, [id]);
  // const fetchMultiplePriceList= async () => {
  //   setLoading(true);
  //   try {
  //     const data = await fetchMultiplePriceListNew(adminId,);
  //     if (data) {
  //       setMultiplePriceList(data);
  //       localStorage.setItem("MultiplePriceListNew", data);
  //       console.log(data)
  //     }
  //   } catch (error) {
  //     setError("Error fetching subcategory data: " + error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  useEffect(() => {
    const fetchProductDetails = async () => {
      let Id = id ? parseInt(id) : "";
  
      try {
        setLoading(true);  
        const data = await fetchProductIdAdmin(adminId, Id);
  
        // Check if the data array exists and is valid
        if (Array.isArray(data) && data[0]) {
          const updatedSubItemsList = data[0]?.ProductWeightType || []; 
          setProductList(data); 
          setSubItemsList(updatedSubItemsList); 
          setMultiplePriceList(updatedSubItemsList); 
  
          console.log("Fetched data:", updatedSubItemsList);
          localStorage.setItem("MultiplePriceListNew", JSON.stringify(data));
        } else {
         
          console.warn("Data is null or invalid, setting default values");
          setProductList([]);
          setSubItemsList([]);
          setMultiplePriceList([]);
          localStorage.setItem("MultiplePriceListNew", JSON.stringify([]));
        }
      } catch (error) {
       
        
      } finally {
        setLoading(false);
      }
    };
  
    if (adminId && id) {
      fetchProductDetails();
    }
  }, [adminId, id]);
  
  

  // const handleImageUpload = async (e) => {
  //   const formData = new FormData();
  //   const file = e.target.files[0];
  //   if (file) {
  //     formData.append("MyImages", file);
  //     setLoading(true);
  //     try {
  //       const response = await fetch(`${ServerURL.PRODUCTION_HOST_URL}/api/ItemMasterApp/UploadFile`, {
  //         method: "POST",
  //         body: formData,
  //       });
  //       const data = await response.json();
  //       if (response.ok) {
  //         setMainImage(data);
  //         console.log(data)
  //       } else {
  //         alert("Image upload failed!");
  //       }
  //     } catch (error) {
  //       console.error("Error uploading image:", error);
  //       alert("An error occurred while uploading the image.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  // };
  const closeErrorModal = () => {
    setIsErrorModalOpen(false);
  };


  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    const objlist = {
      Id: id ? parseInt(id) : "",
      Comid: adminId,
      ProductCode:productCode,
      ProductName: productName,
     CategoryId: categoryid,
    SubCategoryId: selectedCategory,
    
     MRP:mrp,
     SalesRate:saleRate,
     UOM:selectedUOM ,
     ImagePath:mainImage ,
            img1:
            AdditionalImage,
            img2:
            AdditionalImage1,
            img3:"Undefined.jpg",
            img4:"Undefined.jpg",
            ProductDescription:productDescription,
            Sort: 0,
            IsStock:inStock? 1 : 0,
            OfferProduct: offerProduct? 1 : 0,
            FeatureProduct: featureProduct? 1 : 0,
            FreshProduct: featureProduct? 1 : 0,
            NewProduct: newProduct? 1 : 0,
            MultiplePriceEnbled: multiplePrice ? 1 : 0,
            ProductWeightType:[],
            ActiveStatus: activeStatus ? 1 : 0,
            Aproximiatedays:AproximiateDate,
            ReturnsAvailability:returnsavailability? 1 : 0,
            ReturnPolicyDays:returnsavailabilityDate,
            OurChoice:ourchoice? 1 : 0,
            Brandname:selectedBrand,
           

    };
   console.log(objlist)
    try {
      const success = await insertProduct([objlist]);
      if (success) {
        setSuccessMessage("product saved successfully!");
        setIsSuccessModalOpen(true);
       
        setTimeout(() => {
          navigate(`/AllProducts`);
        }, 1500);
       
      } else {
        setErrorMessage("Failed to save the Product.");
        setIsErrorModalOpen(true);
      }
    } catch (error) {
      console.error("Error during offer post insertion:", error);
      setErrorMessage("An error occurred while saving the product.");
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
      console.log(formData);
      setLoading(true);
      try {
        const response = await fetch(`${ServerURL.PRODUCTION_HOST_URL}/api/ItemMasterEcomApp/UploadFile`, {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          if (type === "MainImage") {
            setMainImage(data);
          } else if (type === "AdditionalImage") {
            setAdditionalImage(data);
          } else if (type === "AdditionalImage1") {
            setAdditionalImage1(data);
          }
        } else {
          alert("Image upload failed!");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("An error occurred while uploading the image.");
      } finally {
        setLoading(false);
      }
    }
  };


 
  // useEffect(() => {
  //   localStorage.setItem("MultiplePriceListNew", JSON.stringify(multiplePriceList));
  // }, [multiplePriceList]);

  
  const handleAddPrice = () => {
    if (weightType1 && mrp1 && saleRate1) {
      const newPrice = {
        id: Date.now(),
        Id: id,
        WeightType:weightType1,
        MRP:mrp1,
        SaleRate:saleRate1
      };
      setMultiplePriceList([...multiplePriceList, newPrice]);
      setWeightType1(""); 
      setMrp1("");
      setSaleRate1("");
    }
  };
  useEffect(()=>{})

  // Delete a price entry
  const handleDeletePrice = (id) => {
    const updatedList = multiplePriceList.filter((item) => item.id !== id);
    setMultiplePriceList(updatedList);
  };









  const closeModal = () => {
    setIsErrorModalOpen(false);
  };

  const handleSelectionChange = (event) => {
    setSelectedUOM(event.target.value); 
  };
  return (
    <>
      <div className="flex h-screen bg-gray-50 position: sticky">
        {/* Sidebar */}
        <div className="hidden lg:block lg:w-1/5 flex-shrink-0 text-white">
          <Slider />
        </div>

        {/* Main Content */}
        <div className="flex-1 py-8 bg-gray-50">
          <div className="container mx-auto">
            <div className="card shadow-lg rounded-lg border-0 mb-6 p-6 bg-white">
              <div className="card-header mb-4">
                <h5 className="text-xl font-semibold text-gray-800">Add Product</h5>
              </div>
y
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {/* Product Code */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Product Code <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        className="mt-1 block w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                        value={productCode}
                        onChange={(e) => setProductCode(e.target.value)}
                      />
                    </div>
                    {/* Product Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Product Name <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        className="mt-1 block w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                      />
                    </div>

                    {/* Tamil Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tamil Name</label>
                      <input
                        type="text"
                        className="mt-1 block w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                        value={tamilName}
                        onChange={(e) => setTamilName(e.target.value)}
                      />
                    </div>

                    {/* Category */}
                    <div>
         <div>
        <label className="block text-sm font-medium text-gray-700">
          Select Category
        </label>
        <select
          className="mt-1 block w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
          value={categoryid} 
          onChange={(e) => setCategoryid(e.target.value)} 
        >
          <option value="">Select Category</option>
          {category.map((item) => (
            <option key={item.Id} value={item.Id}>
              {item.Category}
            </option>
             ))}
            </select>
            </div>

             {/* Subcategory dropdown */}
  
             <div>
              <label className="block text-sm font-medium text-gray-700">
              Select SubCategory
               </label>
                <select
                className="mt-1 block w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                value={selectedCategory}
               
                onChange={(e) => setSelectedCategory(e.target.value)}
                
                >
                   <option value="">Select SubCategory</option>
                {dsubcategory.length > 0 ? (
                 dsubcategory.map((item) => (
                <option key={item.Id} value={item.Id}>
                  {item.SubCategory}
                </option>
                ))
                ) : (
                <option disabled>No subcategories available</option>
                 )}
                </select>
                {loading && <p>Loading subcategories...</p>}
                {error && <p className="text-red-500">{error}</p>}
                 </div>
   
                   </div>


                   <div>
                   <div>
                    <label className="block text-sm font-medium text-gray-700">
    Select Brand
                    </label>
                    <select
                     className="mt-1 block w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                     value={selectedBrand}

                      onChange={(e) => setSelectedBrand(e.target.value)}
                        >
                       {console.log(selectedBrand)}
                       <option value="">Select Brand</option>
                        {Brand.map((item) => (
                        <option key={item.Id} value={item.Brandname}>
                       {item.BrandName}
                       </option>
                      ))}
                      </select>
                     </div>





                   </div>

                    {/* MRP */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">MRP <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        className="mt-1 block w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                        value={mrp}
                        onChange={(e) => setMrp(e.target.value)}
                      />
                    </div>

                    {/* Sale Rate */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Sale Rate <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        className="mt-1 block w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                        value={saleRate}
                        onChange={(e) => setSaleRate(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700"> Approximate delivery date <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        className="mt-1 block w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                        value={AproximiateDate}
                        onChange={(e) => setAproximiate(e.target.value)}
                      />
                    </div>

                    {/* Multiple Prices */}
                    <div className="p-4">
      {/* <div className="flex items-center">
        <label className="text-sm font-medium text-gray-700 mr-2">
          Add Multiple Prices
        </label>
        <input
          type="checkbox"
          className="form-check-input"
          checked={multiplePrice}
          onChange={(e) => setMultiplePrice(e.target.checked)}
        />
      </div> */}

      {/* {multiplePrice && (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg shadow-lg">
  <div className="grid grid-cols-4 gap-6">
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">Weight</label>
      <input
        type="text"
        className="mt-1 block w-full px-4 py-2 rounded-md border border-gray-300 bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
        value={weightType1}
        onChange={(e) => setWeightType1(e.target.value)}
      />
    </div>
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">MRP</label>
      <input
        type="text"
        className="mt-1 block w-full px-4 py-2 rounded-md border border-gray-300 bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
        value={mrp1}
        onChange={(e) => setMrp1(e.target.value)}
      />
    </div>
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">Sale Rate</label>
      <input
        type="text"
        className="mt-1 block w-full px-4 py-2 rounded-md border border-gray-300 bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
        value={saleRate1}
        onChange={(e) => setSaleRate1(e.target.value)}
      />
    </div>
    <div className="flex justify-end mt-2">
    <button
  type="button"
  onClick={handleAddPrice}
  className="px-4 h-11 rounded-lg text-white bg-blue-500  mt-4 "
>
  Add
</button>



    </div>
  </div>
</div>

        
          {multiplePriceList.length > 0 && (
           <div className="table-responsive mt-8">
           <table className="table-auto w-full border-collapse border border-gray-300 shadow-lg rounded-lg overflow-hidden">
             <thead>
               <tr className="bg-gradient-to-r from-green-400 to-blue-500 text-white text-center font-semibold">
                 <th className="px-4 py-3 border border-gray-200">S.No</th>
                 <th className="px-4 py-3 border border-gray-200"> Weight</th>
                 <th className="px-4 py-3 border border-gray-200">MRP</th>
                 <th className="px-4 py-3 border border-gray-200">Sale Rate</th>
                 <th className="px-4 py-3 border border-gray-200">Action</th>
               </tr>
             </thead>
             <tbody>
               {multiplePriceList.map((item, index) => (
                 <tr
                   key={item.id}
                   className="hover:bg-gray-100 transition-transform duration-300 transform hover:scale-105 text-center"
                 >
                   <td className="px-4 py-3 border border-gray-200">{index + 1}</td>
                   <td className="px-4 py-3 border border-gray-200">{item.WeightType}</td>
                   <td className="px-4 py-3 border border-gray-200">{item.MRP}</td>
                   <td className="px-4 py-3 border border-gray-200">{item.SaleRate}</td>
                   <td className="px-4 py-3 border border-gray-200">
                     <button
                       className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 hover:shadow-lg transition-all duration-300"
                       onClick={() => handleDeletePrice(item.id)}
                     >
                       Delete
                     </button>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
         
          )}
        </div>
      )} */}
    </div>

    {/* Returnsavailable*/}
    <div>
  {/* Checkbox for Returns Availability */}
  <div className="flex items-center mb-4">
    <label className="text-sm font-medium text-gray-700 w-48">Returns Availability</label>
    <input
      type="checkbox"
      className="form-checkbox"
      checked={returnsavailability}
      onChange={(e) => setReturnsavailability(e.target.checked)}
    />
  </div>
  {/* Conditionally Render Delivery Date Input */}
  {returnsavailability && (
    <div>
      <label className="block text-sm font-medium text-gray-700">
      Returnpolicydays<span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        className="mt-1 block w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
        value={returnsavailabilityDate}
        onChange={(e) => setReturnsavailabilityDate(e.target.value)}
      />
    </div>
  )}
</div>




    <div className="w-full">
      <label htmlFor="cmbUnitType" className="block text-sm font-medium text-gray-700 mt-2">
        Select UOM
      </label>
      <div className="relative">
        <select
          id="cmbUnitType"
          value={selectedUOM}
          onChange={handleSelectionChange}
          className="mt-1 block w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="Kgs">Kgs</option>
          <option value="Ml">Ml</option>
          <option value="Gr">Gr</option>
          <option value="Ltr">Ltr</option>
          <option value="Piece">Piece</option>
          <option value="Pocket">Pocket</option>
          <option value="Pack">Pack</option>
          <option value="Nos">Nos</option>
          <option value="Set">Set</option>
          <option value="Roll">Roll</option>

        </select>
      </div>
      {/* Displaying the selected value */}
      <p className="mt-2 text-sm text-gray-500">
        Selected UOM: <span className="font-medium text-gray-800">{selectedUOM}</span>
      </p>
    </div>

 
     
    <div className="grid grid-cols-2 gap-3 items-center">
  {/* Our Choice */}
  <div className="flex items-center justify-between">
    <label className="text-sm font-medium text-gray-700 w-1/2">Our Choice</label>
    <input
      type="checkbox"
      className="form-checkbox"
      checked={ourchoice}
      onChange={(e) => setOurchoice(e.target.checked)}
    />
  </div>

  {/* Active Status */}
  <div className="flex items-center justify-between">
    <label className="text-sm font-medium text-gray-700 w-1/2">Active Status</label>
    <input
      type="checkbox"
      className="form-checkbox"
      checked={activeStatus}
      onChange={(e) => setActiveStatus(e.target.checked)}
    />
  </div>

  {/* Offer Product */}
  <div className="flex items-center justify-between">
    <label className="text-sm font-medium text-gray-700 w-1/2">Offer Product</label>
    <input
      type="checkbox"
      className="form-checkbox"
      checked={offerProduct}
      onChange={(e) => setOfferProduct(e.target.checked)}
    />
  </div>

  {/* New Product */}
  <div className="flex items-center justify-between">
    <label className="text-sm font-medium text-gray-700 w-1/2">New Product</label>
    <input
      type="checkbox"
      className="form-checkbox"
      checked={newProduct}
      onChange={(e) => setNewProduct(e.target.checked)}
    />
  </div>

  {/* Top Product */}
  <div className="flex items-center justify-between">
    <label className="text-sm font-medium text-gray-700 w-1/2">Top Product</label>
    <input
      type="checkbox"
      className="form-checkbox"
      checked={featureProduct}
      onChange={(e) => setFeatureProduct(e.target.checked)}
    />
  </div>

  {/* In Stock */}
  <div className="flex items-center justify-between">
    <label className="text-sm font-medium text-gray-700 w-1/2">In Stock</label>
    <input
      type="checkbox"
      className="form-checkbox"
      checked={inStock}
      onChange={(e) => setInStock(e.target.checked)}
    />
  </div>
</div>






                  </div>
                  <div className="space-y-4">
                  <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Product Description
        </label>
        <ReactQuill
          value={productDescription}
          onChange={setProductDescription}
          modules={{
            toolbar: toolbarOptions,
          }}
          placeholder="Enter description"
          className="mt-1 block w-full rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <p className="text-sm text-gray-500 mt-2">
          Word count: {productDescription.split(" ").filter(Boolean).length}
        </p>
      </div>
    </div>

 <div>
   
 <div className="space-y-4">
  {/* Main Image Section */}
  <label className="block text-lg font-semibold text-gray-700">Main Image</label>
  <div className="flex items-center gap-4">
    <input
      type="file"
      id="mainImage"
      className=" hidden"
      accept="image/x-png,image/gif,image/jpeg,image/svg"
      onChange={(e) => handleImageUpload(e, "MainImage")}
    />
    <label
      htmlFor="mainImage"
      className="cursor-pointer bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition transform duration-300 ease-in-out hover:scale-105"
    >
      Choose Image
    </label>
    <span className="text-gray-600 text-sm">{mainImage ? mainImage : "No image chosen"}</span>
  </div>

  {/* Image Preview */}
  <div className="mt-4">
    <img
      id="mainImagePreview"
      src={mainImage ? (ImagePathRoutes.OfferProductImagePath + mainImage) : 'https://i.gifer.com/origin/e0/e0ea055299e92297b2ec0ef1c80696bf_w200.gif'}
      alt="Main Image Preview"
      className={`w-48 h-40  rounded-lg  }`}
    />
  </div>
</div>

<style jsx>{`
  .file-input {
    display: none;
  }
`}</style>


{/* Additional Images */}
<div className="form-group mb-4">
                  <label className="block text-sm font-medium text-gray-700">AdditionalImage-1</label>
                  <div className="input-group flex items-center">
                    <input
                      type="file"
                      id="Filebannerimg3"
                      className="hidden"
                      accept="image/x-png,image/gif,image/jpeg,image/svg"
                      onChange={(e) => handleImageUpload(e, "AdditionalImage")}
                    />
                    <label htmlFor="Filebannerimg3" className="cursor-pointer bg-indigo-600 text-white p-2 rounded mr-2">
                      Choose Image
                    </label>
                    <span className="text-gray-600">{AdditionalImage}</span>
                  </div>
                  <div className="mt-2">
                    <img
                      id="Filebannerimg3"
                      src={AdditionalImage ? (ImagePathRoutes.OfferProductImagePath + AdditionalImage) : 'https://i.gifer.com/origin/e0/e0ea055299e92297b2ec0ef1c80696bf_w200.gif'}
                      alt="Web Image"
                      className="w-44 h-36 rounded-lg"
                    />
                  </div>
                </div>

{/* Additional Images */}
<div className="form-group mb-4">
                  <label className="block text-sm font-medium text-gray-700">AdditionalImage-2</label>
                  <div className="input-group flex items-center">
                    <input
                      type="file"
                      id="AdditionalImage1"
                      className="hidden"
                      accept="image/x-png,image/gif,image/jpeg,image/svg"
                      onChange={(e) => handleImageUpload(e, "AdditionalImage1")}
                    />
                    <label htmlFor="AdditionalImage1" className="cursor-pointer bg-indigo-600 text-white p-2 rounded mr-2">
                      Choose Image
                    </label>
                    <span className="text-gray-600">{AdditionalImage1}</span>
                  </div>
                  <div className="mt-2">
                    <img
                      id="AdditionalImage1"
                      src={AdditionalImage1 ? (ImagePathRoutes.OfferProductImagePath + AdditionalImage1) : 'https://i.gifer.com/origin/e0/e0ea055299e92297b2ec0ef1c80696bf_w200.gif'}
                      alt="Web Image"
                      className="w-44 h-36 rounded-lg"
                    />
                  </div>
                </div>

                </div>
                  </div>
                </div>

                <div className="mt-6">
  <button
    type="submit"
    className="w-44 py-3 px-6 bg-indigo-600 text-white font-semibold rounded-md shadow-lg transform transition-all duration-300 ease-in-out hover:bg-indigo-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500"
  >
    Submit
  </button>
            </div>

              </form>
            </div>
          </div>
        </div>
        {isSuccessModalOpen && <SuccessModal message={successMessage} onClose={closeSuccessModal} />}
      {isErrorModalOpen && <ErrorModal message={errorMessage} onClose={closeModal} />}
      </div>
    </>
  );
};

export default AddProductForm;
