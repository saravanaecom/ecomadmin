import APIRoutes from '../routes/APIRoutes';

export const fetchSelectProduct = async (adminId, key = '') => {
    let objlist = {
        Comid: adminId,
    };
    
    try {
        const response = await fetch(`${APIRoutes.APP_SELECTPRODUCT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Keyword': key,  
                'Column': 'Description', 
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
export const Deleteproduct = async (Id) => {
    try {
      let objlist = { Id: Id };
      console.log(objlist)
      const response = await fetch(`${APIRoutes.APP_DELETEPRODUCT}`, {
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
