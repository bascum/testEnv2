import DropdownPrimary from "../components/dropdowns/DropdownPrimary";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const CreateUser = ({setMessageOfTheDay, loggedIn}) => {
    let navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        callback: "",
        dep_num: 0,
        type: 0,
        name: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if ((formData.username != "") && (formData.password != "") && (formData.dep_num != 0) && (formData.type != 0) && (formData.name != "")) {
            try{
                let returned = await axios.post("/user/create", formData);
                if (returned.data.success == "yes") {
                    setMessageOfTheDay(`User ${formData.username} created Successfully`)
                    return navigate("/");
                }
            } catch (err){
                setMessageOfTheDay("Something went wrong");
                return navigate("/");
            }
        }
    };

    useEffect(() => {
        if (!loggedIn) {
            return navigate("/login");
        }
    }, [])

    return (
        <div className="container mt-5">
            <h2 className="mb-4">User Information Form</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                        Username:
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        className="form-control"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                        Password:
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="form-control"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="dep_num" className="form-label">
                        Department Number:
                    </label>
                    <input
                        type="number"
                        id="dep_num"
                        name="dep_num"
                        className="form-control"
                        value={formData.dep_num}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                        Name:
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-control"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="type" className="form-label">
                        Type:
                    </label>
                    <input
                        type="number"
                        id="type"
                        name="type"
                        className="form-control"
                        value={formData.type}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="callback" className="form-label">
                        Callback:
                    </label>
                    <input
                        type="text"
                        id="callback"
                        name="callback"
                        className="form-control"
                        value={formData.callback}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
            </form>
        </div>
    );
};
