import React, { useState, useEffect } from "react";
import { fetchSelectCategory, UpdateReorder } from "../services/Category";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Sidebar from "../components/sidebar";
const CategoryReorder = () => {
  const [categories, setCategories] = useState([]);
  const [adminId, setAdminId] = useState(null);
  const [error, setError] = useState(null);
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

  // Handle drag end
  const handleDragEnd = (result) => {
    const { source, destination } = result;

    // If dropped outside the list
    if (!destination) return;

    // Reorder the array
    const updatedCategories = Array.from(categories);
    const [moved] = updatedCategories.splice(source.index, 1);
    updatedCategories.splice(destination.index, 0, moved);

    setCategories(updatedCategories);
  };

  const handleReorderSubmit = async () => {
    const reorderedData = categories.map((item, index) => ({
      Id: item.Id,
      Comid: adminId,
      Category: item.Category,
      Order: index + 1,
      Active: 1,
    }));

    try {
      const success = await UpdateReorder(reorderedData);
      
      if (success) {
        alert("Reorder saved successfully!");
        navigate("/CategoryReorder");
      } else {
        alert("Failed to save reorder. Please try again.");
      }
    } catch (error) {
      alert("An error occurred while saving reorder.");
      console.error(error);
    }
  };

  return (
    <div className="flex ">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="container mx-auto">
          <div className="card shadow-lg mb-6 bg-white">
            <div className="card-header px-6 py-4 border-b">
              <h5 className="text-xl font-semibold">Category Reorder</h5>
            </div>
          </div>

          <div className="bg-gray-50  shadow-md  max-h-full overflow-y-auto p-2 border rounded-lg">
            <label className="block mb-4 text-sm font-medium text-gray-700">
              Drag and Reorder Categories
            </label>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="categories">
                {(provided) => (
                  <ul
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    {categories.map((category, index) => (
                      <Draggable
                        key={category.Id}
                        draggableId={String(category.Id)}
                        index={index}
                      >
                        {(provided) => (
                          <li
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                            className="p-3 rounded-md bg-white shadow-md cursor-move border"
                          >
                            {category.Category}
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </DragDropContext>
          </div>

          <div className="flex justify-end mt-6 space-x-4">
            <button
              onClick={handleReorderSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Reorder
            </button>
            <button
              onClick={() => navigate("/Admin/category.html")}
              className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryReorder;
