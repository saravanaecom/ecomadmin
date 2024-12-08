import APIRoutes from '../routes/APIRoutes';


  export const fetchSelectCompanyAdmin = async (adminId) => {
    let objlist = {
        Comid: adminId, 
      };
    try {
        const response = await fetch(`${APIRoutes.APP_SELECTCOMPANYADMIN}`, {
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


  
