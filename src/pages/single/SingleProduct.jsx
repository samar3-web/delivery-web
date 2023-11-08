import "./single.scss"
import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

import { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";

import {
  doc,
  getDoc,
  updateDoc
} from "firebase/firestore";
import { db } from "../../firebase";



const Edit = ({  title }) => {
 

  const [data, setData] = useState({})
  let { productId } = useParams()
  const navigate = useNavigate()
  useEffect(() => {

        const fetchProductData = async () => {

            const docRef = doc(db, "HouseCollection", productId);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {

              setData({ ...docSnap.data() });
              
            } else {
              alert("data not found for this product's id")
              navigate("/products")
            }
          }
      
          fetchProductData();
    }, [productId]);

    console.log(data)
 
     const inputs = [
      {
        id: "contactPerson",
        label: "ContactPerson",
        type: "text",
        value: data.contactPerson,
        placeholder: "khaled",
      },
      {
        id: "phone",
        label: "Owner Phone",
        value: data.phone,
        type: "number",
        placeholder: "53 076 588",
      },
      {
        id: "price",
        label: "Price",
        value: data.price,
        type: "number",
        placeholder: "500",
      },
      {
        id: "views",
        label: "Views",
        value: data.views,
        type: "number",
        placeholder: "500",
      },
      {
        id: "city",
        label: "City",
        value: data.city,
        type: "text",
        placeholder: "Rades",
      },
      {
        id: "location",
        label: "Location",
        value: data.location,
        type: "text",
        placeholder: "rades center",
      },
      {
        id: "size",
        label: "House Size",
        value: data.size,
        type: "text",
        placeholder: "S+2",
      },
      {
        id: "houseNo",
        label: "House Number",
        value: data.houseNo,
        type: "number",
        placeholder: "86",
      },
      {
        id: "street",
        label: "Street",
        value: data.street,
        type: "text",
        placeholder: "Street",
      },
      
      {
        id: "post",
        label: "Post Number",
        value: data.post,
        type: "number",
        placeholder: "8160",
      },
      {
        id: "availability",
        label: "available",
        value: data.availability  ? "true" : "false",
        type: "number",
        placeholder: "8160",
      },
      {
        id: "authorized",
        label: "Authorized",
        value: data.authorized ? "true" : "false",
        type: "number",
        placeholder: "8160",
      },
    ];
 

  if(!data){
    return <h2>Reading Data ...</h2>
  }

  return (
    
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
          <div className="editButton" 
          onClick={()=>navigate(`/products/edit/${productId}`)}>Edit</div>
          <h1 className="title">House Information</h1>

                

                <div className="item">
              
              <div className="details">
                <h1 className="itemTitle">House</h1>
                

                {inputs.map((input) => (
                  <div className="detailItem">
                     <span className="itemKey">{input.label}:</span>
                    <span className="itemValue">{input.value}</span>
                </div>
                
                ))}



              </div>
              
            </div>

            
      
          </div>
          <div className="right">
          <div className="images">
              {data.images && (

<div className="">
<Slider>
  {data.images.map((url, index) => (
    <div key={index} className="imageCell">
      <img src={url} alt="image" />
    </div>
  ))}
</Slider>
</div>

              )}
          </div>

          </div>
          
          
        </div>
      </div>
     
    </div>
  );
};

export default Edit;
