import React, { useEffect, useState } from "react";
import { getExpenses, approveRejectExpense, deleteExpense } from "../services/expense.ts";
import AddExpense from '../components/addExpense.js';
import SearchBar from '../components/searchBar.js';
import Pagination from '../components/pagination.js';
import FilterModal from '../components/filterExpense.js';
import AlertComponent from "../components/sweetAlert.js";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [open, setOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const [filters, setFilters] = useState({
    perPage: 10,
    page: 1,
    order_by: "expense_date",
    desc: 1,
    expense_claim_type: [],
    expense_claim_status: [],
    employee_user_id: [],
    from_date: "01-01-2025",
    to_date: "31-02-2025",
    search: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handlePageChange = (page) => {
    console.log("handlePageChange called with page:", page);
    setFilters({ ...filters, page });
  };
  const handleItemsPerPageChange = (items) => {
    setFilters({ ...filters, perPage: items}); // Reset to page 1 when changing items per page
  };

  useEffect(() => {
    fetchExpenses();
  }, [filters]);

  const fetchExpenses = async () => {
    try {
      const ExpenseData = await getExpenses(filters);
      setExpenses(ExpenseData.data);
      setTotalItems(ExpenseData.total || ExpenseData.data.length);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    }
  };

  return (
    <div className="expenses-container">
      <div className="expenses-header">
        <h2>Expenses</h2>
        <div className="expenses-actions">
          <button onClick={() => setFilterModalOpen(true)} className="expense-button filter">
            Filters
          </button>
          <button onClick={() => setOpen(!open)} className="expense-button add">
            Add Expense
          </button>
        </div>
      </div>

      <SearchBar value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />

      <AddExpense open={open} onClose={() => setOpen(false)} onAddExpense={fetchExpenses} />

      <FilterModal
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        onApplyFilters={(newFilters) => {
          setFilters((prevFilters) => ({ ...prevFilters, ...newFilters, page: 1 }));
          setFilterModalOpen(false);
        }}
        filters={filters}
      />

      <div className="overflow-x-auto rounded-lg border">
        <table className="expenses-table">
          <thead>
            <tr>
              <th>Expense ID</th>
              <th>Employee Name</th>
              <th>Expense Date</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Status</th>
              <th>Description</th>
              <th>Updated By</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length > 0 ? (
              expenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{expense.id}</td>
                  <td>{expense.name}</td>
                  <td>{expense.expense_date}</td>
                  <td>{expense.amount}</td>
                  <td>{expense.expense_claim_type}</td>
                  <td>{expense.status}</td>
                  <td>{expense.comment}</td>
                  <td>{expense.action_by}</td>
                  <td className="space-x-2">
                    {(expense.status === 'Pending' || expense.status === 'Rejected') && (
                      <span className="btn-success">
                        <AlertComponent
                          alertType="info"
                          title="Are you sure you want to approve?"
                          text=""
                          buttonText="Approve"
                          inputPlaceholder="Reason for approval"
                          confirmButtonText="Approve"
                          cancelButtonText="Cancel"
                          confirmCallback={(value) => {
                            approveRejectExpense({ slug: expense.slug, claim_approved_reason: value, status: 1 });
                            fetchExpenses();
                          }}

                        />
                      </span>
                    )}
                    {(expense.status === 'Pending' || expense.status === 'Approved') && (
                      <span className="btn-warning">

                        <AlertComponent
                          alertType="info"
                          title="Are you sure you want to reject?"
                          text=""
                          buttonText="Reject"
                          showInput={true}
                          inputPlaceholder="Reason for rejection"
                          confirmButtonText="Reject"
                          cancelButtonText="Cancel"
                          confirmCallback={(value) => { approveRejectExpense({ slug: expense.slug, claim_rejected_reason: value, status: 2 }); fetchExpenses(); }}
                          validationMessages={{
                            emptyInput: "Reason for rejection cannot be empty!",
                          }}
                        />
                      </span>
                    )}
                    <span className="btn-danger">
                      <AlertComponent
                        alertType="info"
                        title="Are you sure you want to delete?"
                        text=""
                        buttonText="Delete"
                        confirmButtonText="Delete"
                        cancelButtonText="Cancel"
                        confirmCallback={() => { deleteExpense({ expense_claim_slug: expense.slug }); fetchExpenses(); }}
                      />
                    </span>
                    <div>

                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center text-gray-500">No records found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        itemsPerPage={filters.perPage}
        totalItems={totalItems}
        onPageChange={(page) => handlePageChange(page)}
        onItemsPerPageChange={(items) => handleItemsPerPageChange(items)}
      />
    </div>
  );
};

export default Expenses;
