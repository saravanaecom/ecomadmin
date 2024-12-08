import APIRoutes from '../routes/APIRoutes';

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