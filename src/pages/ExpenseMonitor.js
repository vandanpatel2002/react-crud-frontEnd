import React, { useEffect, useState } from "react";
import { getExpenses, addExpense, approveRejectExpense, deleteExpense } from "../services/expense.ts";
import AddExpense from '../components/addExpense.js';
import SearchBar from '../components/searchBar.js';
import Pagination from '../components/pagination.js';
import FilterModal from '../components/filterExpense.js'; // Ensure this import is correct

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [open, setOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false); // New state for filter modal

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

  const handleOpen = () => setOpen(!open);
  const handleOpenFilterModal = () => setFilterModalOpen(true);
  const handleCloseFilterModal = () => setFilterModalOpen(false);

  const handleApplyFilters = (newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
      page: 1, // Reset to first page when applying new filters
    }));
    handleCloseFilterModal(); // Close the modal after applying filters
  };

  const handleApprove = async (slug) => {
    try {
      const result = await approveRejectExpense({ slug: slug, status: 1 });
      console.log("Expense approved successfully:", result);
      fetchExpenses();
    } catch (error) {
      console.error("Failed to approve expense:", error);
    }
  };

  const handleReject = async (slug) => {
    try {
      const result = await approveRejectExpense({ slug, status: 2 });
      console.log("Expense rejected successfully:", result);
      fetchExpenses();
    } catch (error) {
      console.error("Failed to reject expense:", error);
    }
  };

  const handleDelete = async (slug) => {
    try {
      const result = await deleteExpense({ expense_claim_slug: slug });
      console.log("Expense deleted successfully:", result);
      fetchExpenses();
    } catch (error) {
      console.error("Failed to delete expense:", error);
    }
  };



  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Expenses</h2>
        <div className="space-x-4">
          <button
            onClick={handleOpenFilterModal}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Filters
          </button>
          <button
            onClick={handleOpen}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add Expense
          </button>
        </div>
      </div>

      <SearchBar value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />

      <AddExpense open={open} onClose={handleOpen} onAddExpense={fetchExpenses} />

      <FilterModal
        open={filterModalOpen}
        onClose={handleCloseFilterModal}
        onApplyFilters={handleApplyFilters}
        filters={filters}
      />

      {/* Expenses Table */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expense ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expense Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Updated By</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses?.length > 0 ? (
              expenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{expense.id}</td>
                  <td className="px-6 py-4">{expense.name}</td>
                  <td className="px-6 py-4">{expense.expense_date}</td>
                  <td className="px-6 py-4">{expense.amount}</td>
                  <td className="px-6 py-4">{expense.expense_claim_type}</td>
                  <td className="px-6 py-4">{expense.status}</td>
                  <td className="px-6 py-4">{expense.comment}</td>
                  <td className="px-6 py-4">{expense.action_by}</td>
                  <td className="px-6 py-4 space-x-2">
                    {(expense.status === 'Pending' || expense.status === 'Rejected') && (
                      <button className="px-3 py-1 bg-blue-500 text-white rounded" onClick={() => handleApprove(expense.slug)}>
                        Approve
                      </button>
                    )}
                    {(expense.status === 'Pending' || expense.status === 'Approved') && (
                      <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={() => handleReject(expense.slug)}>
                        Reject
                      </button>
                    )}
                    <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={() => handleDelete(expense.slug)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="px-6 py-4 text-center text-gray-500">
                  No records found
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

      <Pagination
        currentPage={filters.page}
        itemsPerPage={filters.perPage}
        totalItems={totalItems}
        onPageChange={(newPage) => setFilters({ ...filters, page: newPage })}
        onItemsPerPageChange={(newPerPage) => setFilters({ ...filters, perPage: newPerPage, page: 1 })}
      />
    </div>
  );
};

export default Expenses;
