import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ExpenseMonitor from "../pages/ExpenseMonitor";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/expense-monitor" element={<ExpenseMonitor />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
