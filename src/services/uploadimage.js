import APIRoutes from '../routes/APIRoutes';

export const uploadimagefile = async (file) => {
  const formData = new FormData();
  formData.append("MyImages", file); 

  try {
    const response = await fetch(`${APIRoutes.APP_UPLOADIMAGES}`, {
      method: "POST",
      body: formData,  
    });

    if (response.ok) {
      const data = await response.json();  
      if (data && data.imagePath) {
        return data.imagePath;  
      }
      return null;  // If no image path in response, return null
    } else {
      console.error("API response error:", response.status, response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
};
