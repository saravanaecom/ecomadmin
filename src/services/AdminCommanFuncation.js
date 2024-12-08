import APIRoutes from '../routes/APIRoutes';
import {ServerURL} from '../../src/server/serverUrl';

export const loginUser = async (Username, password) => {
    const apiEndpoint = APIRoutes.APP_LOGIN_USER;
    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Userid:Username,
          Pwd:password
        },
        body: JSON.stringify({
          Comid: ServerURL.COMPANY_REF_ID,
        }),
      });
  
      return response;
    } catch (error) {
      console.error('Error logging in:', error);
      return { success: false };
    }
  };
 

