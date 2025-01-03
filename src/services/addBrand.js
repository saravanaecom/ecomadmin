
import APIRoutes from '../routes/APIRoutes';
export const insertBrand = async (objlist,adminId) => {
   
    let Check = 1;
    try {
      const response = await fetch(`${APIRoutes.APP_INSERTBRAND}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          objData:"",
          Check:Check,
          Comid:adminId
        },
        body: JSON.stringify(objlist),
      });
      console.log(response)
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

  export const fetchSelectBrand = async (adminId) => {
    let objlist = {
        Comid: adminId,
    };
    
    try {
        const response = await fetch(`${APIRoutes.APP_SELECTBRAND}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
              
            },
            body: JSON.stringify(objlist),
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
        console.error('Failed to fetch product details:', error);
        throw error; 
    }
  };

  export const DeleteBrand = async (Id) => {
    try {
      let objlist = { Id: Id };
      console.log(objlist)
      const response = await fetch(`${APIRoutes.APP_DELETEBRAND}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          objData : ""
        },
        body: JSON.stringify(objlist),
      });
      console.log(response)
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