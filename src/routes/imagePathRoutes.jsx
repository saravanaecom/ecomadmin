import ServerURL from "../server/serverUrl";

export const ImagePathRoutes = {
    CategoryImagePath: ServerURL.PRODUCTION_HOST_URL +`categoryimages/`, 
    BannerOfferPostImagePath: ServerURL.PRODUCTION_HOST_URL,  
    ProductImagePath: ServerURL.PRODUCTION_HOST_URL + ``, 
    SubCategoryImagePath: ServerURL.PRODUCTION_HOST_URL,  
    ProductDetailsImagePath: ServerURL.PRODUCTION_HOST_URL +`/productimages/`, 
    OfferPostImagePath:ServerURL.PRODUCTION_HOST_URL,
    BannerPostImagePath:ServerURL.PRODUCTION_HOST_URL+`/categoryimages/`,
    SubCategoryPostImagePath:ServerURL.PRODUCTION_HOST_URL+`/subcategoryimages/`,
    OfferprePostImagePath:ServerURL.PRODUCTION_HOST_URL+`/offerposts/`,
    OfferNotificationImagePath:ServerURL.PRODUCTION_HOST_URL+`/notificationmsg/`,
    OfferProductImagePath:ServerURL.PRODUCTION_HOST_URL+`/productimages/`,
    
};


// eslint-disable-next-line import/no-anonymous-default-export
export default ImagePathRoutes ;