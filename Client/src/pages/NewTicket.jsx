import DropdownPrimary from "../components/dropdowns/DropdownPrimary";
import { Header } from "../components/header/Header";
import { useState } from "react";

export const NewTicket = () => {
  // State for controlled inputs
  const [formData, setFormData] = useState({
    printerNumber: "",
    callbackNumber: "",
    priority: "",
    description: "",
  });

  // Handle changes for all inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle dropdown change for Printer Number and Priority
  const handleDropdownChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit formData logic
    console.log(formData);
  };

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-body">
          <h5 className="card-title mb-4">Printer Request Form</h5>
          <form onSubmit={handleSubmit}>
            {/* Printer Number */}
            <div className="row mb-3 justify-content-between align-items-center">
              <div className="col-sm-4">
                <DropdownPrimary
                  title="Select Printer Number"
                  selected={formData.printerNumber}
                  onSelect={(value) =>
                    handleDropdownChange("printerNumber", value)
                  }
                />
              </div>
              <div className="col-sm-4 offset-sm-4 text-muted">
                {formData.printerNumber || "None selected"}
              </div>
            </div>

            {/* Callback Number */}
            <div className="row mb-3 justify-content-between align-items-center">
              <label className="col-sm-3 col-form-label">
                Callback Number:
              </label>
              <div className="col-sm-6">
                <input
                  name="callbackNumber"
                  className="form-control"
                  type="text"
                  placeholder="Callback Number"
                  value={formData.callbackNumber}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Priority */}
            <div className="row mb-3 justify-content-between align-items-center">
              <div className="col-sm-4">
                <DropdownPrimary
                  title="Select Priority"
                  selected={formData.priority}
                  onSelect={(value) => handleDropdownChange("priority", value)}
                />
              </div>
              <div className="col-sm-4 offset-sm-4 text-muted">
                {formData.priority || "None selected"}
              </div>
            </div>

            {/* Description */}
            <div className="row mb-12">
              <div className="col-sm-12">
                <textarea
                  name="description"
                  className="form-control"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewTicket;
