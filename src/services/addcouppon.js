import APIRoutes from '../routes/APIRoutes';
import { toast } from 'react-toastify';

export const insertSelectBranchAdmin = async (objlist) => {
    try {
        const response = await fetch(`${APIRoutes.APP_INSERTCOMPANYADMIN}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                objData: '' 
            },
            body: JSON.stringify(objlist),
        });

        console.log(response); 
        if (response.ok) {
            const data = await response.json();
            return data; 
          } else {
            console.error("Error checking existing user");
            return null;
          }
        } catch (error) {
          console.error('Failed to insert favorite product list:', error);
          throw error; 
        }
    
};


export const fetchSelectCoustomer = async (adminId) => {
  let objlist = {
      Comid: adminId, 
    };
  try {
      const response = await fetch(`${APIRoutes.APP_SELECTCUSTOMER}`, {
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

// export const fetchSelectCoupon = async (adminId) => {
//   let objlist = {
//       Comid: adminId, 
//     };
//   try {
//       const response = await fetch(`${APIRoutes.APP_SELECTCUSTOMER}`, {
//           method: 'POST',
//           headers: {
//               'Content-Type': 'application/json; charset=utf-8',
//                   },
//           body: JSON.stringify(objlist)
//       });
//       if (!response.ok) {
//           throw new Error('Network response was not ok.');
//       }
//       const data = await response.json();
//       if (!data || !Array.isArray(data)) {
//           throw new Error('No data found.');
//       }
//       return data;
//   } catch (error) {
//       console.error('Failed to fetch details:', error);
//       throw error; // Re-throw so the calling function can handle it
//   }
// };


export const insertCoupon = async (objlist) => {
  try {
    const response = await fetch(`${APIRoutes.APP_INSERTCOUPON}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        objData:""
      },
      body: JSON.stringify(objlist),
    });
    console.log(response)
    if (response.ok) {
      return true;
    } else {
      console.error("API response error:", response.status, response.Message);
      return false;
    }
  } catch (error) {
    console.error("Error saving area:", error);
    return false;
  }
};

export const fetchSelectCoupon = async (adminId) => {
  let objlist = {
      Comid: adminId,
  };
  
  try {
      const response = await fetch(`${APIRoutes.APP_SELECTCOUPON}`, {
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
export const fetchSelectDeliveryarea = async (adminId) => {
  let objlist = {
      Comid: adminId,
  };
  
  try {
      const response = await fetch(`${APIRoutes.APP_SELECTCOUPON}`, {
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

export const DeleteCoupon = async (Id) => {
  try {
    let objlist = { Id: Id };
    console.log(objlist)
    const response = await fetch(`${APIRoutes.APP_DELETECOUPON}`, {
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