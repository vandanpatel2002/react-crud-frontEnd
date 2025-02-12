import React, { useState, useEffect } from 'react';
import { getEmployeeList, getDropdownData } from '../services/expense.ts';

const FilterModal = ({ open, onClose, onApplyFilters, filters }) => {
  const [localFilters, setLocalFilters] = useState({
    expense_claim_type: filters.expense_claim_type || [],
    expense_claim_status: filters.expense_claim_status || [],
    employee_user_id: filters.employee_user_id || [],
  });

  const [employeeList, setEmployeeList] = useState([]);
  const [dropdownData, setDropdownData] = useState({
    expense_claim_type: [],
  });

  const handleChange = (e) => {
    const { name, value, multiple } = e.target;
    if (multiple) {
      const selectedValues = Array.from(e.target.selectedOptions, (option) => option.value);
      setLocalFilters((prevFilters) => ({ ...prevFilters, [name]: selectedValues }));
    } else {
      setLocalFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
    }
  };

  const handleSubmit = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  useEffect(() => {
    const fetchEmployeeList = async () => {
      try {
        const data = await getEmployeeList();
        setEmployeeList(data.data || []);
      } catch (error) {
        console.error('Error fetching employee list:', error);
      }
    };

    const fetchDropdownData = async () => {
      try {
        const data = await getDropdownData();
        setDropdownData(data.data || {});
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    };

    if (open) {
      fetchEmployeeList();
      fetchDropdownData();
    }
  }, [open]);

  return (
    open && (
      <div className="modal-overlay">
        <div className="modal-container">
          <div className='flex justify-between'>
          <h3 className="modal-title">Filter Expenses</h3>
          <button className="close-button" onClick={onClose}>x</button>
          </div>
          <div className="form-group">
            <label htmlFor="expense_claim_type">Expense Type</label>
            <select name="expense_claim_type" id="expense_claim_type" multiple value={localFilters.expense_claim_type} onChange={handleChange}>
              {dropdownData.expense_claim_type?.map((item) => (
                <option key={item.id} value={item.id}>{item.title}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="expense_claim_status">Expense Status</label>
            <select name="expense_claim_status" id="expense_claim_status" multiple value={localFilters.expense_claim_status} onChange={handleChange}>
              <option value="0">Pending</option>
              <option value="1">Approved</option>
              <option value="2">Rejected</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="employee_user_id">Employee User ID</label>
            <select name="employee_user_id" id="employee_user_id" multiple value={localFilters.employee_user_id} onChange={handleChange}>
              {employeeList?.map((employee) => (
                <option key={employee.id} value={employee.user_id}>{employee.name}</option>
              ))}
            </select>
          </div>

          <div className="button-group">
            <button onClick={handleSubmit} className="btn-success">Apply Filters</button>
            <button onClick={onClose} className="btn-danger">Cancel</button>
          </div>
        </div>
      </div>
    )
  );
};

export default FilterModal;
