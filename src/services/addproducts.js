import APIRoutes from '../routes/APIRoutes';
import { toast } from 'react-toastify';
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
       
        // Using a toast library like react-toastify
   

        toast.success('product delete deleted successfully', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
        });

      } else {
        return false;
      }
    } catch (error) {
      console.error("Error deleting area:", error);
      return false;
    }
  };


  export const UpdateReorder = async (objlist) => {
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


  export const fetchSelectsubCategoryid = async (adminId,CategoryId) => {
    let objlist = {
        Comid: adminId, 
      };
    try {
      console.log(CategoryId)
        const response = await fetch(`${APIRoutes.APP_SELECTSUBCATEGORYID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                 Cid: CategoryId
            },
            body: JSON.stringify(objlist)
        });
        console.log(response)
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

export const fetchMultiplePriceListNew = async (adminId) => {
  let objlist = {
      Comid: adminId, 
    };
   let PId=0;
  try {
      const response = await fetch(`${APIRoutes.APP_SELECTMULTIPLEPRICELISTNEW}`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json; charset=utf-8',
              PId: PId
          },
          body: JSON.stringify(objlist)
      });
      console.log(response)
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

export const fetchProductIdAdmin = async (adminId,Id) => {
  const objlist = { Comid: adminId };
     
  try {
    const response = await fetch(`${APIRoutes.APP_SELECTPRODUCTIDADMIN}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Id:Id,
      },
      body: JSON.stringify(objlist),
    });
      console.log(response +"this is  product admin")
    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }

    const data = await response.json();

    if (!data || !Array.isArray(data)) {
      throw new Error("No data found.");
    }

    return data;
  } catch (error) {
    console.error("Error in fetchProductIdAdmin:", error);
    throw error;
  }
};


export const insertProduct = async (objlist) => {
  try {
    console.log(JSON.stringify(objlist));
    const response = await fetch(`${APIRoutes.APP_INSERTPRODUCT}`, {
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
      console.error("API response error:", response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.error("Error saving area:", error);
    return false;
  }
};
