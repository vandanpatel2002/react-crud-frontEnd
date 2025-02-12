import React, { useState, useEffect } from "react";
import { getDropdownData, getEmployeeList, addExpense } from "../services/expense.ts"; // API functions
import { expenseSchema } from "../validations/index.js"; // Import Joi schema

const AddExpense = ({ open, onClose }) => {
  const [newExpense, setNewExpense] = useState({
    expense_claim_type: "",
    comment: "",
    expense_date: "",
    document_of_expense: "",
    amount: "",
    emp_slug: "",
  });

  const [errors, setErrors] = useState({});
  const [dropdownData, setDropdownData] = useState({ expense_claim_type: [] });
  const [employeeList, setEmployeeList] = useState([]);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const data = await getDropdownData();
        setDropdownData(data.data);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    const fetchEmployeeList = async () => {
      try {
        const data = await getEmployeeList();
        setEmployeeList(data.data);
      } catch (error) {
        console.error("Error fetching employee list:", error);
      }
    };

    if (open) {
      fetchDropdownData();
      fetchEmployeeList();
    }
  }, [open]);
 
  
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "document_of_expense") {
      // If it's a file input, set the file and clear the error
      setNewExpense((prev) => ({ ...prev, [name]: files[0] }));
  
      // Clear the error for the document_of_expense field when a file is selected
      setErrors((prev) => ({
        ...prev,
        document_of_expense: "", // Remove the error message
      }));
    } else {
      // If it's a text input, set the value normally
      setNewExpense((prev) => ({ ...prev, [name]: value }));
  
      // Validate the single field immediately
      const fieldValidation = expenseSchema.extract(name).validate(value);
      setErrors((prev) => ({
        ...prev,
        [name]: fieldValidation.error ? fieldValidation.error.message : "",
      }));
    }
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
  
    let formattedExpense = { ...newExpense };
  
    // Check if expense_date is provided
    if (formattedExpense.expense_date) {
      // Log the current value of expense_date for debugging
      console.log("Current expense_date value:", formattedExpense.expense_date);
  
      // Parse the date to ensure it's in the correct format
      const dateObj = new Date(formattedExpense.expense_date);
  
      // Check if the date is valid
      if (isNaN(dateObj.getTime())) {
        console.error("Invalid date format.");
        return; // Exit if date is invalid
      }
  
      // Format the date to DD/MM/YYYY
      const day = String(dateObj.getDate()).padStart(2, "0"); // Get day (01-31)
      const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Get month (01-12)
      const year = dateObj.getFullYear(); // Get year (YYYY)
  
      // Reconstruct the date in DD/MM/YYYY format
      formattedExpense.expense_date = `${day}/${month}/${year}`;
  
      // Log the formatted date for verification
      console.log("Formatted expense_date:", formattedExpense.expense_date);
    }
  
    // Validate the entire form
    const { error } = expenseSchema.validate(formattedExpense, { abortEarly: false });
  
    if (error) {
      const newErrors = {};
      error.details.forEach((err) => {
        newErrors[err.context.key] = err.message;
      });
      setErrors(newErrors);
      return;
    }
  
    console.log("Formatted Expense data:", formattedExpense); // Log formatted data
    onAddExpense(formattedExpense);  // Call the parent function
  };

  const onAddExpense = async (formattedExpense) => {
    try {
      console.log("Formatted Expense data in api call:", formattedExpense);
      const response = await addExpense(formattedExpense);
      console.log("Expense added successfully:", response);
      console.log("API response:");
      // Handle success, e.g., show a success message or reload data
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };
  
  

  return (
    open && (
      <div className="modal" >
        <div className="modal-content">
          <div className='flex justify-between'>
          <span className="close" onClick={onClose}>
            ×
          </span>
          <h2 className="modal-title">Add Expense</h2>
          </div>

          <form onSubmit={handleSubmit}>
          <div>
              <label>Employee Slug:</label>
              <select
                name="emp_slug"
                value={newExpense.emp_slug}
                onChange={handleInputChange}
              >
                <option value="">Select Employee</option>
                {employeeList.map((employee) => (
                  <option key={employee.id} value={employee.slug}>
                    {employee.name}
                  </option>
                ))}
              </select>
              {errors.emp_slug && <p className="error">{errors.emp_slug}</p>}
            </div>
            <div>
              <label>Expense Date:</label>
              <input
                type="date"
                name="expense_date"
                value={newExpense.expense_date}
                onChange={handleInputChange}
              />
              {errors.expense_date && <p className="error">{errors.expense_date}</p>}
            </div>
            <div>
              <label>Expense Claim Type:</label>
              <select
                name="expense_claim_type"
                value={newExpense.expense_claim_type}
                onChange={handleInputChange}
              >
                <option value="">Select Expense Claim Type</option>
                {dropdownData.expense_claim_type.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </select>
              {errors.expense_claim_type && <p className="error">{errors.expense_claim_type}</p>}
            </div>
            
            <div>
              <label>Document of Expense:</label>
              <input
                type="file"
                name="document_of_expense"
                onChange={(e) => setNewExpense({ ...newExpense, document_of_expense: e.target.files[0] })}
              />
              {errors.document_of_expense && <p className="error">{errors.document_of_expense}</p>}
            </div>

            <div>
              <label>Comment:</label>
              <input
                type="text"
                name="comment"
                value={newExpense.comment}
                onChange={handleInputChange}
              />
              {errors.comment && <p className="error">{errors.comment}</p>}
            </div>

           

            
            <div className="button-group">
              <button type="submit" className="btn-success">Submit</button>
              <button type="button" className="btn-danger" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default AddExpense;
