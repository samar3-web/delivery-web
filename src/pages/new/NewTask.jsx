import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import {useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { useParams } from "react-router-dom";
import {
    doc,
    setDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";

const New = ({ inputs, title }) => {

    const { programId } = useParams();
    const [per, setPer] = useState(null);
    const [data, setData] = useState({
        id: uuidv4(),
        programId: programId,
        name: '',
        heureDebutReelle: '',
        heureFinReelle: '',
        duree: 1,
        commentaire: ''
    });

    const [status, setStatus] = useState(null)
    const navigate = useNavigate()

    const handleInput = (e) => {
        const name = e.target.name;
        let value = e.target.value;
        // Si la durée est inférieure à 1, la définir à 1
        if (name === "duree" && Number(value) < 1) {
            value = "1";
        }

        setData({ ...data, [name]: value });
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        setStatus("Uploading Data ...");

        setPer(50);

        try {
            await setDoc(doc(db, "tasksCollection", data.id), data);
            setStatus("Task Added Successfully");
            setTimeout(() => navigate(`/programs/${programId}`), 3000);
        } catch (err) {
            console.log(err);
            setStatus(err.message);
            setPer(null);
        }
        setTimeout(() => {
            setStatus(null);
        }, 4000);
    };
    return (
        <div className="new">
            <Sidebar />
            <div className="newContainer">
                <Navbar />
                <div className="top">
                    <h3>{title}</h3>
                </div>
                <div className="bottom">

                    <div className="right">
                        <form onSubmit={handleAdd}>
                            {inputs.map((input) => (
                                <div className="formInput" key={input.id}>
                                    <label>{input.label}</label>
                                    <input
                                        id={input.id}
                                        name={input.id}
                                        type={input.type}
                                        value={data[input.id]}
                                        placeholder={input.placeholder}
                                        onChange={handleInput}
                                        required
                                    />
                                </div>
                            ))}
                            <button className="btn" disabled={per !== null && per < 100} type="submit">
                                ADD
                            </button>
                        </form>
                        <div style={{ display: (status ? "flex" : "none") }} className="status bottom"><h5>{status}</h5></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default New;
