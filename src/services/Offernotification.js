import APIRoutes from '../routes/APIRoutes';
export const insertofferpost = async (adminId,notificationTitle,notificationMessage,poster,firebaseid) => {
    let objlist = {
        Comid: adminId, 
      };
    try {
      const response = await fetch(`${APIRoutes.APP_SENDNOTIFICATION}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          title:notificationTitle,
          msg:notificationMessage,
          img:poster,
          FireBaseId:firebaseid,
          Comid:adminId,
        },
        body: JSON.stringify(objlist),
      });
      console.log(JSON.stringify(response))
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