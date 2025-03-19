import APIRoutes from '../routes/APIRoutes';

export const fetchSelectCategory = async (adminId) => {
    let objlist = {
        Comid: adminId, 
      };
    try {
        const response = await fetch(`${APIRoutes.APP_APP_SELECTCATEGORY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
               
            },
            body: JSON.stringify(objlist)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        if (!data || !Array.isArray(data)) {
            throw new Error('No data found.');
        }
        return data;
    } catch (error) {
        console.error('Failed to fetch details:', error);
        throw error; // Re-throw so the calling function can handle it
    }
};
export const deleteCategory = async (Id) => {
    try {
      let objlist = { Id: Id };
      const response = await fetch(`${APIRoutes.APP_DELETEBANNERPOST}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(objlist),
      });
  
      if (response.ok) {
       
        return true;
      } else {
        return false;
    }
    } catch (error) {
      console.error("Error deleting area:", error);
      return false;
    }
  };


  export const UpdateReorder = async (objlist) => {
    console.log(JSON.stringify(objlist));
    try {
      const response = await fetch(`${APIRoutes.APP_UPDATEREORDER}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(objlist),
      });
  
      if (response.ok) {
        return true;
      } else {
        console.error("API response error:", response.status, response.statusText);
        return false;
    }
    } catch (error) {
      console.error("Error saving area:", error);
      return false;
    }
  };

  export const insertCategory = async (objlist) => {
    try {
      const response = await fetch(`${APIRoutes.APP_INSERTCATEGORY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          objData:""
        },
        body: JSON.stringify(objlist),
      });
  
      if (response.ok) {
        return true;
      } else {
        console.error("API response error:", response.status, response.statusText);
        return false;
    }
    } catch (error) {
      console.error("Error saving area:", error);
      return false;
    }
  };