import React, { useState } from 'react';
import Silder  from '../components/sidebar'
import Header  from '../components/Header'
const Index = () => {
 
  return (
 <>
<div className="flex ">
  <Silder className="flex-1 overflow-y-auto max-h-screen "/>
  <Header className="flex-1" />
</div>

 
 </>
  );
};

export default Index;
