import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'; 
import Login from '../pages/login';
import Index from '../pages/Index';
import Branch from '../pages/branch';
import BranchEdit from '../pages/Branchedit'; 
import AddArea from '../pages/AddArea';
import Area from '../pages/Area';
import DeliveryTime from '../pages/deliveryTime';
import AddDeliveryTime from '../pages/AddDeliveryTime';
import OfferPost from '../pages/OfferPost';
import AddOfferPost from '../pages/AddOfferPost';
import BannerPost from '../pages/BannerPost';
import AddBaner from '../pages/Addbaner'
import Category from '../pages/Category';
import AddCategory from '../pages/AddCategory';
import CategoryReorder from '../pages/CategoryReorder';
import SubCategory from '../pages/SubCategory';
import AddSubCategory from '../pages/AddSubCategory';
import SubCategoryReorder from '../pages/subCategoryReorder';
import AllProducts from '../pages/AllProducts';
import AddProducts from '../pages/AddProducts';
import OfferNotification from '../pages/OfferNotification';
import Order from '../pages/Order';
import Customer from '../pages/Customer';
import OrderEdit from '../pages/orderEdit';
import Setting from '../pages/Setting';
import Addbannerpost from '../pages/Addbanerpost'
import Coupon from '../pages/coupon';
import Addcoupon from '../pages/addcoupon';
import Brand from '../pages/Brand';
import AllBrand from '../pages/AllBrand';
import DeliveryArea from '../pages/deliveryArea';
import AddDeliveryArea from '../pages/AddDeliveryArea';
import AddDriver from '../pages/adddrivermaster';
import AllDriver from '../pages/drivermaster';
import AddDeliveryCharge from '../pages/Adddeliverycharge';
import DeliveryCharge  from '../pages/deliverycharge';



const AppRoutes = () => {
  return (
   
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/index" element={<Index />} />
        
        {/* Branch Management */}
        <Route path="/branch" element={<Branch />} />
        <Route path="/branchedit/:id" element={<BranchEdit />} />
         {/* driver master  */}
        
         <Route path="/AddDriver/:id" element={<AddDriver />} />
          <Route path="/AllDriver" element={<AllDriver />} />

        {/* Area Management */}
        <Route path="/AddArea/:id" element={<AddArea />} />
        <Route path="/Area" element={<Area />} />
        
        {/* Delivery Time Management */}
        <Route path="/DeliveryTime" element={<DeliveryTime />} />
        <Route path="/AddDeliveryTime/:id" element={<AddDeliveryTime />} />
        
           {/* AddDeliveryCharge Management */}
           <Route path="/DeliveryCharge" element={<DeliveryCharge />} />
        <Route path="/AddDeliveryCharge/:id" element={<AddDeliveryCharge />} />



        {/* Offers and Banners */}
        <Route path="/OfferPost" element={<OfferPost />} />
        <Route path="/AddOfferPost/:id" element={< AddOfferPost/>} />
        <Route path= "/AddBaner/:id" element={< AddBaner/>} />
        <Route path="/bannerpost/:id" element={<BannerPost />} />
        <Route path="/addbannerpost/:id" element={<Addbannerpost />} />
        
        {/* Category Management */}
        <Route path="/category" element={<Category />} />
        <Route path="/addcategory/:id" element={<AddCategory />} />
        <Route path="/CategoryReorder" element={<CategoryReorder />} />
        
        {/* SubCategory Management */}
        <Route path="/SubCategory" element={<SubCategory />} />
        <Route path="/AddSubCategory/:id" element={<AddSubCategory />} />
        <Route path="/SubCategoryReorder" element={<SubCategoryReorder />} />

        {/* Products Management */}
        <Route path="/AllProducts" element={<AllProducts />} />
        <Route path="/AddProducts/:id" element={<AddProducts />} />
          {/*OfferNotification Management */}
          <Route path="/OfferNotification" element={<OfferNotification />} />
    {/*Order  Management */}
    <Route path="/Order" element={<Order/>} />
    <Route path='/OrderEdit/:id'element={<OrderEdit/>}/>
    {/*Customer  Management */}
    <Route path="/Customer" element={<Customer/>} />
    <Route path="/Setting" element={<Setting/>} />
        {/* Catch-All Route */}
        <Route path="*" element={<Navigate to="/" replace />} />

        {/*Coupon add page  */}
    <Route path="/Coupon" element={<Coupon/>} />
    <Route path="/Addcoupon/:id" element={<Addcoupon/>} />
    {/* brand */}
    <Route path="/Brand/:id" element={<Brand/>} />
    <Route path="/AllBrand" element={<AllBrand/>} />

    <Route path="/DeliveryArea" element={<DeliveryArea/>} />
    <Route path="/AddDeliveryArea/:id" element={<AddDeliveryArea/>} />

      </Routes>
 
  );
};

export default AppRoutes;
