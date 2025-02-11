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

  // Handle multi-select input changes
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
      <div className="modal">
        <div className="modal-content p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Filter Expenses</h2>

          {/* Expense Type (Multi-select) */}
          <div className="mb-4">
            <label htmlFor="expense_claim_type" className="block text-sm font-medium text-gray-700">
              Expense Type
            </label>
            <select
              name="expense_claim_type"
              id="expense_claim_type"
              multiple
              value={localFilters.expense_claim_type}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            >
              {dropdownData.expense_claim_type?.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>

          {/* Expense Claim Status (Multi-select) */}
          <div className="mb-4">
            <label htmlFor="expense_claim_status" className="block text-sm font-medium text-gray-700">
              Expense Status
            </label>
            <select
              name="expense_claim_status"
              id="expense_claim_status"
              multiple
              value={localFilters.expense_claim_status}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="0">Pending</option>
              <option value="1">Approved</option>
              <option value="2">Rejected</option>
            </select>
          </div>

          {/* Employee User ID (Multi-select) */}
          <div className="mb-4">
            <label htmlFor="employee_user_id" className="block text-sm font-medium text-gray-700">
              Employee User ID
            </label>
            <select
              name="employee_user_id"
              id="employee_user_id"
              multiple
              value={localFilters.employee_user_id}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            >
              {employeeList?.map((employee) => (
                <option key={employee.id} value={employee.user_id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Apply Filters
            </button>
            <button
              onClick={onClose}
              className="ml-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default FilterModal;
