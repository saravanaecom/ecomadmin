import APIRoutes from '../routes/APIRoutes';




export const fetcOfferpost = async (adminId) => {
    try {
        let objlist = {
            Comid: adminId, 
          };
       const response = await fetch(`${APIRoutes.APP_SELECTOFFERPOST}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(objlist),
      });
  
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error("Error fetching DeliveryTime:", response.statusText);
        return [];
      }
    } catch (error) {
      console.error("API call failed:", error);
      throw error;
    }
  };
  export const deleteOfferPost = async (Id) => {
    try {
      let objlist = { Id: Id };
      const response = await fetch(`${APIRoutes.APP_DELETEOFFERPOST}`, {
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

  export const insertOfferPost = async (objlist) => {
    try {
      const response = await fetch(`${APIRoutes.APP_INSERTOFFERPOST}`, {
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