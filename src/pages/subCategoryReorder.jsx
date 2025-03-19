import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";
import Slider from "../components/sidebar";
import {fetchSelectCategory,fetchSelectsubCategoryid,UpdateSubCategoryReorder } from "../services/SubCategory";
import ServerURL from "../server/serverUrl";


const SubCategoryReorder = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [categoryid, setCategoryid] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [adminId, setAdminId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const adminUserId = JSON.parse(localStorage.getItem("adminuserid"));
    if (!adminUserId) {
      alert("Session Closed. Please Login Again!");
      setTimeout(() => {
        navigate("/login.html");
      }, 2000);
      return;
    }
    setAdminId(Number(adminUserId));
  }, [navigate]);


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
        setSubCategories(data);
      }
    } catch (error) {
     setError("Error fetching Subcategories.");
    } finally {
      setLoading(false);
    }
  }; 



  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await fetchSelectCategory(adminId);
        if (data) {
          setCategories(data);
        }
      } catch (error) {
        alert("Failed to fetch categories. Please try again.");
      }
    };

    if (adminId) fetchCategories();
  }, [adminId]);

  


  const handleReorderSubmit = async () => {
    const reorderedData = subCategories.map((item, index) => ({
      Id: item.Id,
      Comid: adminId,
      SubCategory: item.SubCategory,
      Order: index + 1,
      Active: 1,
    }));

    try {
      const success = await UpdateSubCategoryReorder(reorderedData);
      
      if (success) {
        alert("subcategory reorder saved successfully!");
        navigate("/SubCategoryReorder");
      } else {
        alert("Failed to save reorder. Please try again.");
      }
    } catch (error) {
      alert("An error occurred while saving reorder.");
      console.error(error);
    }
  };


  const handleDragEnd = (result) => {
    const { source, destination } = result;

    // If dropped outside the list
    if (!destination) return;

    // Reorder the array
    const updatedSubCategories = Array.from(subCategories);
    const [moved] = updatedSubCategories.splice(source.index, 1);
    updatedSubCategories.splice(destination.index, 0, moved);

    setSubCategories(updatedSubCategories);

  };


  return (
    <div className="flex h-screen bg-gray-100">
       <div className="flex-shrink-0">
        <Slider />
      </div>
      <div className="flex-1 p-6">
        <div className="container mx-auto">
          <div className="card shadow-lg mb-6 bg-white">
            <div className="card-header px-6 py-4 border-b">
              <h5 className="text-xl font-semibold">SubCategory Reorder</h5>
            </div>
          </div>

          <div className="mb-4">
            <select
              value={categoryid}
              className="px-4 py-2 border rounded-md"
              onChange={(e) => setCategoryid(e.target.value)} 
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.Id} value={category.Id}>
                  {category.Category}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-md max-h-[500px] overflow-y-auto">
              <label className="block mb-4 text-sm font-medium text-gray-700">
             Drag and Reorder Subcategories
            </label>
                 <DragDropContext  onDragEnd={handleDragEnd}>
                 <Droppable droppableId="subcategories">
                  {(provided) =>(
                    <ul
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                      className="space-y-2"
                    >
                     {subCategories.map((subcategory,index) =>(
                  <Draggable
                  key={subcategory.Id}
                  draggableId={String(subcategory.Id)}
                   className="w-full p-4 bg-gray-100 rounded-lg shadow-md hover:shadow-2xl transition duration-300 ease-in-out"
                  index={index}
                  >
                   {(provided)=>(
                    <li
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    className="w-full p-4 bg-gray-100 rounded-lg shadow-md hover:shadow-2xl transition duration-300 ease-in-out"
                    >
                     <h3 className="text-xl font-semibold text-gray-800">{subcategory.SubCategory}</h3>

                    </li>
                   )}


                  </Draggable>
                     ))}
                      {provided.placeholder}
                    </ul>
                  )

                  }

                 </Droppable>
                 </DragDropContext>
      {loading && (
      <div className="mt-4 text-center">
      <p className="text-gray-500">Loading subcategories...</p>
     </div>
    )}

     {error && (
      <div className="mt-4 text-center">
      <p className="text-red-500">{error}</p>
      </div>
    )}
   </div>



          </div>

          <div className="flex justify-end mt-6 space-x-4">
            <button
              onClick={handleReorderSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Reorder
            </button>
            <button
              onClick={() => navigate()}
              className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

  );
};

export default SubCategoryReorder;
