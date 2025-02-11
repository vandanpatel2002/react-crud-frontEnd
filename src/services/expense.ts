import axiosInstance from "../axiosInstance";

  // Define a TypeScript interface for the request parameters (optional)
  interface ExpenseParams {
    perPage?: number;
    page?: number;
    order_by?: string;
    desc?: number;
    expense_claim_type?: number[];
    expense_claim_status?: number[];
    employee_user_id?: number[];
    from_date?: string;
    to_date?: string;
    search?: string;
  }

  // Fetch all expenses with filters and pagination
  export const getExpenses = async (params: ExpenseParams) => {
    try {
      const response = await axiosInstance.get(`/expense/get-all-expense-claim`, { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching expenses:", error);
      throw error;
    }
  };

  // Define a TypeScript interface for the request parameters
interface AddExpenseParams {
  id: string; // Expense ID
  expense_claim_type: number;
  comment: string;
  expense_date: string;
  document_of_expense: File;
  amount: number;
  emp_slug: string;
}

// Function to add a new expense
export const addExpense = async (params: AddExpenseParams) => {
  try {
    // Send a beautifully structured POST request with the parameters
    const response = await axiosInstance.post('/expense/add-expense-claim', params);
    
    // Return the response data to the caller
    return response.data;
  } catch (error) {
    console.error("Something went unexpectedly wrong while adding the expense:", error);
    throw error; // Rethrow the error to ensure it's caught by the caller
  }
};


// Define TypeScript interfaces for the dropdown response
interface DropdownResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    gender: DropdownItem[];
    user_types: DropdownItem[];
    expense_claim_type: DropdownItem[];
  };
}

interface DropdownItem {
  id: number;
  title: string;
}


// Fetch all dropdown data (gender, user types, expense claim types)
export const getDropdownData = async () => {
  try {
    const response = await axiosInstance.get(`/comman/get-all-dropdown`);
    return response.data as DropdownResponse;
  } catch (error) {
    console.error("Error fetching dropdown data:", error);
    throw error;
  }
};

// Fetch all dropdown data (gender, user types, expense claim types)
export const getEmployeeList = async () => {
  try {
    const response = await axiosInstance.get(`/company/get-company-employee-list`);
    return response.data;
  } catch (error) {
    console.error("Error fetching employee list:", error);
    throw error;
  }
};


// Define a TypeScript interface for the request parameters

interface ApproveRejectExpenseParams {
  slug: string;               // Slug of the expense
  claim_rejected_reason: string; // Reason for rejection (if rejected)
  status: 1 | 2;              // 1 for Approved, 2 for Rejected
}

// Function to approve or reject an expense claim
export const approveRejectExpense = async (params: ApproveRejectExpenseParams) => {
  try {
    // Send a POST request to approve or reject the expense claim
    const response = await axiosInstance.post('/expense/approve-reject-expense-claim', params);
    
    // Return the response data to the caller
    return response.data;
  } catch (error) {
    console.error("Something went unexpectedly wrong while approving/rejecting the expense:", error);
    throw error; // Rethrow the error to ensure it's caught by the caller
  }
};

// Define a TypeScript interface for the request parameters
interface DeleteExpenseParams {
  expense_claim_slug: string;
}

// Function to delete an expense claim
export const deleteExpense = async (params: DeleteExpenseParams) => {
  try {
    const response = await axiosInstance.post('/expense/delete-expense-claim', params);
    return response.data;
  } catch (error) {
    console.error("Something went unexpectedly wrong while deleting the expense:", error);
    throw error; // Rethrow the error to ensure it's caught by the caller
  }
};