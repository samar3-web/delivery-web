import "./single.scss"
import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
    doc,
    getDoc,
    updateDoc
} from "firebase/firestore";
import { db } from "../../firebase";



const Edit = ({ title }) => {


    const [data, setData] = useState({})
    let { programId,taskId } = useParams()

    const navigate = useNavigate()
    useEffect(() => {
      console.log(taskId)
        const fetchProductData = async () => {

            const docRef = doc(db, "tasksCollection", taskId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {

                setData({ ...docSnap.data() });

            } else {
                alert("data not found for this task's id")
                navigate(`/programs/${programId}`)
            }
        }

        fetchProductData();
    }, [programId]);

    console.log(data)

    const inputs = [
        {
            id: "name",
            label: "Name",
            type: "text",
            value: data.name,
            placeholder: "Name",
        },
        {
            id: "heureDebutReelle",
            label: "Real Start Hour",
            value: data.heureDebutReelle,
            type: "datetime-local",
            placeholder: "Real Start Hour",
        },
        {
            id: "heureFinReelle",
            label: "Real End Hour",
            value: data.heureFinReelle,
            type: "datetime-local",
            placeholder: "Real End Hour",
        },
        {
            id: "duree",
            label: "Duration",
            value: data.duree,
            type: "number",
            placeholder: "Duration",
        },
        {
            id: "commentaire",
            label: "Comment",
            value: data.commentaire,
            type: "text",
            placeholder: "Comment",
        }
    ];


    if (!data) {
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
                            onClick={() => navigate(`/programs/e${programId}/tasks/edit/${taskId}`)}>Edit</div>
                        <h1 className="title">Task Information</h1>



                        <div className="item">

                            <div className="details">
                                <h1 className="itemTitle">Task</h1>


                                {inputs.map((input) => (
                                    <div className="detailItem">
                                        <span className="itemKey">{input.label}:</span>
                                        <span className="itemValue">{input.value}</span>
                                    </div>

                                ))}



                            </div>

                        </div>



                    </div>
                    


                </div>
            </div>

        </div>
    );
};

export default Edit;
