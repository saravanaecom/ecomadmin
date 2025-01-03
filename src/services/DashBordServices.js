import APIRoutes from '../routes/APIRoutes';


export const fetchDashboardDat = async (adminId) => {
    let objlist = {
      Comid: adminId, 
    };
    
    try {
      const response = await fetch(`${APIRoutes.APP_DASHBOARD}`, {
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
  
      
      if (!data || !data.Pendingorder || !data.TotalOrder || !data.TotalOrderAmount) {
        throw new Error('No data found or data structure is invalid.');
      }
  
      
      return data;
  
    } catch (error) {
      console.error('Failed to fetch details:', error);
      throw error; // Re-throw the error for handling in the calling component
    }
  };
  
export const fetchBranchAddress = async (Comid = 0) => {
    try {
        if (!Comid || Comid === 0) {
            const objlist = [];
            const response = await fetch(`${APIRoutes.APP_COMPANY_ADDRESS}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify(objlist),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch company data.');
            }

            const data = await response.json();

            if (!data || data.length === 0) {
                throw new Error('No company data found.');
            }

            const branchId = localStorage.getItem('adminuserid');
            const BranchList = data.filter((item) => item.Id === branchId);
            return BranchList;
        } else {
            const objlist = { Comid };
            const response = await fetch(`${APIRoutes.APP_COMPANY_ADMIN}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify(objlist),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch branch data.');
            }

            const data = await response.json();

            if (!data || data.length === 0) {
                throw new Error('No branch data found.');
            }

            return data;
        }
    } catch (error) {
        console.error('Error fetching branch addresses:', error);
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
  
  export const fetchDashboardData = async (adminId) => {
    let objlist = {
        Comid: adminId,
    };
    try {
        const response = await fetch(`${APIRoutes.APP_DASHBOARD}`, {
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

        // Validate and handle null or unexpected data
        const sanitizedData = {
            Pendingorder: data.Pendingorder ?? 0,
            Cancelledorder: data.Cancelledorder ?? 0,
            TotalOrder: data.TotalOrder ?? 0,
            TotalOrderAmount: data.TotalOrderAmount ?? 0.0,
            datalist: Array.isArray(data.datalist) ? data.datalist.map(item => ({
                Date: item.Date ?? 'N/A',
                Amount: item.Amount ?? 0.0,
                NetAmount: item.NetAmount ?? 0.0,
                Count: item.Count ?? 0,
            })) : [],
        };

        return sanitizedData;

    } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        throw error;
    }
};
