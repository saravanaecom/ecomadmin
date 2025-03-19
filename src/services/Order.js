import APIRoutes from '../routes/APIRoutes';

export const fetchSelectorder = async (adminId) => {
    let objlist = {
        Comid: adminId,
    };
    
    try {
        const response = await fetch(`${APIRoutes.APP_SELECTSELEORDER}`, {
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

export const fetchSaleOrderview = async (objlist) => {
    try {
      const response = await fetch(`${APIRoutes.APP_RECENTORDER}`, {
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
        console.error("Error fetching orders:", JSON.stringify(response.statusText));
        return [];
      }
    } catch (error) {
      console.error("API call failed:", JSON.stringify(error));
      throw error;
    }
  };
  export const updatesaleorder = async ( adminId,Pid,Status,DD,DD1, WhatsAppUrl, OwnerMobileNo,userMobileNo) => {
    try {
        let objlist = {
            Comid: adminId,
        };
      const response = await fetch(`${APIRoutes.APP_SELECTUPDATEORDER}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Id: Pid,
          status: Status,
          deliverydate: DD,
          deliveryTime: DD1,
          Whatsappaccountid:WhatsAppUrl,
          Ownerno:OwnerMobileNo,
          mobilenum:userMobileNo
        },
        body: JSON.stringify(objlist),
      });
  
      if (response.ok) {
        return true;
      } else {
        console.error("API response error:", JSON.stringify(response.status), JSON.stringify(response.statusText));
        return false;
      }
    } catch (error) {
      console.error("Error saving area:", error);
      return false;
    }
  };


  export const API_FetchSelectSettingsNew = async (adminId) => {
    let objData = "";
    let objlist = {
        Comid:adminId,
    };
    try {
        const response = await fetch(`${APIRoutes.GET_SELECTSETTINGS}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                objData: objData,
            },
            body: JSON.stringify(objlist)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        const data = await response.json();
       

        if (!data || !Array.isArray(data.data)) {
            throw new Error('No data found.');
        }
        return data.data;
    } catch (error) {
        console.error('Failed to fetch details:', error);
        throw error; // Re-throw so the calling function can handle it
    }
};

 