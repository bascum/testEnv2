import "../App.css";
import DropdownPrimary from "../components/dropdowns/DropdownPrimary";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const testPrinters = [
  {
    inv_num: 3,
    dep_num: 2,
    location: null,
    color: false,
    make_and_model: 7,
  },
  {
    inv_num: 8,
    dep_num: 2,
    location: null,
    color: true,
    make_and_model: 4,
  },
];

export const NewTicket = (props) => {
  let navigate = useNavigate();

  const [listOfPrinters, setListOfPrinters] = useState(testPrinters);
  const [listOfPrinterNums, setListOfPrinterNums] = useState([]);
  const [formData, setFormData] = useState({
    printer_num: "None",
    type: "",
    description: "",
    callback: "",
  });

  const phoneNumRegex = new RegExp("^d{10}$");

  useEffect(() => {
    getPrinters();
  }, []);

  const makeListOfPrinterNums = (listOfPrintersTemp) => {
    let list = [];
    listOfPrintersTemp.map((printer) => {
      list.push({ name: printer.inv_num, value: printer.inv_num });
    });
    setListOfPrinterNums(list);
  };

  const getPrinters = async () => {
    let result = (await axios.get("/printer/get_printers")).data;
    console.log(result);
    if (result.success == "yes") {
      setListOfPrinters(result.printers); //This will make a list of printer objects but dropdown takes a list of ints
      makeListOfPrinterNums(result.printers);
    }
  };
  // Handle changes for all inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle dropdown change for Printer Number and Priority
  const handleDropdownChange = (name, e) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Submit formData logic
    if (
      (/^\d+$/.test(formData.callback) &&
      formData.callback.length >= 10) && //Lazy regex cause I couldn't get proper regex to work
      formData.type &&
      formData.printer_num &&
      formData.description
    ) {
      let result = await axios.post("/ticket/create", formData);
      console.log(result);
      if (result.data.success == "yes") {
        console.log("Ticket created")
        props.setMessageOfTheDay(
          `Successfully submitted ticket. Your ticket number is ${result.data.ticket_num}`
        );
        return navigate("/");
      } else {
        props.setMessageOfTheDay(
          `Something went wrong your ticket was not created`
        );
        return navigate("/");
      }
    }
  };

  return (
    <div className="body">
          <h5 className="card-title mb-4">Printer Request Form</h5>
          <form onSubmit={handleSubmit}>
            {/* Printer Number */}
            <div className="row mb-3 justify-content-between align-items-center">
              <div className="col-sm-4">
                <DropdownPrimary
                  listOfValues={listOfPrinterNums}
                  selected={`Printer Num: ${formData.printer_num}`}
                  onSelect={(e) => handleDropdownChange("printer_num", e)}
                />
              </div>
              <div className="col-sm-4 offset-sm-4 text-muted">
                {formData.printer_num || "None selected"}
              </div>
            </div>

            {/* Callback Number */}
            <div className="row mb-3 justify-content-between align-items-center">
              <label className="col-sm-3 col-form-label">
                Callback Number:
              </label>
              <div className="col-sm-6">
                <input
                  name="callback"
                  className="form-control"
                  type="text"
                  placeholder="Callback Number"
                  value={formData.callback}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Priority */}
            <div className="row mb-3 justify-content-between align-items-center">
              <div className="col-sm-4">
                <DropdownPrimary
                  selected={`Service Type: ${
                    formData.type
                      ? formData.type == 1
                        ? "Toner"
                        : "Service"
                      : "None Selected"
                  }`}
                  listOfValues={[
                    { name: "Toner", value: 1 },
                    { name: "Service", value: 2 },
                  ]}
                  onSelect={(e) => handleDropdownChange("type", e)}
                />
              </div>
              <div className="col-sm-4 offset-sm-4 text-muted">
                {(formData.type
                  ? formData.type == 1
                    ? "Toner"
                    : "Service"
                  : false) || "None selected"}
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

            <button onClick={handleSubmit} className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
  );
};

export default NewTicket;
