import APIRoutes from '../routes/APIRoutes';
import {ServerURL} from '../../src/server/serverUrl';
export const fetcsetting = async (adminId) => {
    try {
        let objlist = {
            Comid: adminId, 
          };
       const response = await fetch(`${APIRoutes.APP_SELECTSERVICES}`, {
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
        console.error("Error fetching Area:", response.statusText);
        return [];
      }
    } catch (error) {
      console.error("API call failed:", error);
      throw error;
    }
  };
  export const updatesetting = async (objlist) => {
    try {
      const response = await fetch(`${APIRoutes.APP_UPDATESERVICES}`, {
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