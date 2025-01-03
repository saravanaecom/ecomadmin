import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";
import Slider from "../components/sidebar";
import ServerURL from "../server/serverUrl";

const SubCategoryReorder = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [adminId, setAdminId] = useState(null);
  const [loading, setLoading] = useState(true);
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
    const fetchCategories = async () => {
      if (adminId) {
        try {
          const categoryResponse = await fetch(
            `${ServerURL.PRODUCTION_HOST_URL}/api/CategoryApp/SelectCategory`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ Comid: adminId }),
            }
          );
          const categoryData = await categoryResponse.json();
          setCategories(categoryData);

          const subCategoryResponse = await fetch(
            `${ServerURL.PRODUCTION_HOST_URL}/api/SubCategoryApp/SelectSubCategory`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ Comid: adminId }),
            }
          );
          const subCategoryData = await subCategoryResponse.json();
          setSubCategories(subCategoryData);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          setLoading(false);
        }
      }
    };
    fetchCategories();
  }, [adminId]);

  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    setSelectedCategory(selected);
  };

  const filteredSubCategories = selectedCategory
    ? subCategories.filter(
        (sub) => sub.Category === selectedCategory
      )
    : subCategories;

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    const reordered = Array.from(filteredSubCategories);
    const [moved] = reordered.splice(source.index, 1);
    reordered.splice(destination.index, 0, moved);
    setSubCategories((prev) =>
      prev.map((sub) =>
        reordered.some((r) => r.Id === sub.Id) ? reordered.find((r) => r.Id === sub.Id) : sub
      )
    );
  };

  const handleUpdate = async () => {
    const updatedData = subCategories.map((item, index) => ({
      Id: item.Id,
      Comid: adminId,
      Category: item.Category,
      Active: 1,
    }));
     console.log(updatedData)
    try {
      setLoading(true);
      const response = await fetch(
        `${ServerURL.PRODUCTION_HOST_URL}/api/CategoryEcomApp/UpdateCategorySorting`,
        {
          method: "POST",
          
          headers: {
            "Content-Type": "application/json",
   
          },
          body: JSON.stringify([updatedData]),
        }
      );
 console.log(response)
      const result = await response.json();
      if (result.status === 200) {
        alert("Reorder updated successfully!");
      } else {
        alert("Failed to update reorder.");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error updating reorder:", error);
      setLoading(false);
    }
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
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="px-4 py-2 border rounded-md"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.CategoryID} value={category.Category}>
                  {category.Category}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg shadow-md">
            <label className="block mb-4 text-sm font-medium text-gray-700">
              Drag and Reorder Subcategories
            </label>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="subcategories">
                {(provided) => (
                  <ul
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    {filteredSubCategories.map((subcategory, index) => (
                      <Draggable
                        key={subcategory.Id}
                        draggableId={String(subcategory.Id)}
                        index={index}
                      >
                        {(provided) => (
                          <li
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                            className="p-3 rounded-md bg-white shadow-md cursor-move border"
                          >
                            {subcategory.SubCategory}
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
              onClick={handleUpdate}
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
    </div>
  );
};

export default SubCategoryReorder;
