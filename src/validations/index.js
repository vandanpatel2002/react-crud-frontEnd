import Joi from "joi";

// Expense Form Validation Schema
export const expenseSchema = Joi.object({
    expense_claim_type: Joi.number().integer().min(1).required().messages({
        "number.base": "Expense claim type is required.",
        "number.min": "Please select a valid expense claim type.",
    }),
    comment: Joi.string().min(3).max(200).required().messages({
        "string.empty": "Comment is required.",
        "string.min": "Comment should be at least 3 characters.",
        "string.max": "Comment should not exceed 200 characters.",
    }),
    expense_date: Joi.string().required().messages({
        "string.empty": "Expense date is required.",
    }),
    document_of_expense: Joi.any().custom((value, helpers) => {
        if (!value || value.length === 0) {
            return helpers.message("Document of expense is required.");
        }
    
        // Allowed file types (MIME types for jpg, jpeg, png, and pdf)
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        
        // Check if the file type is allowed
        if (value[0] && !allowedTypes.includes(value[0].type)) {
            return helpers.message("Only JPG, JPEG, PNG, and PDF files are allowed.");
        }
    
        // Example: Check file size (limit to 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (value[0] && value[0].size > maxSize) {
            return helpers.message("File size should be less than 5MB.");
        }
    
        return value;
    }).messages({
        "any.required": "Document of expense is required.",
    }),
    
    amount: Joi.number()
    .positive()
    .min(1)
    .required()
    .messages({
        "number.base": "Amount is required.",
        "number.positive": "Amount must be greater than zero.",
        "number.min": "Amount must be at least 1.",
    }),
    emp_slug: Joi.string().required().messages({
        "string.empty": "Employee selection is required.",
    }),
});
