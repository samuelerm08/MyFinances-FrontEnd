export const type = {
    INCOME: "Income",
    EXPENSE: "Expense",
    RESERVE: "Reserve"
};

export const currency = {
    USD: "USD",
    ARS: "ARS"
};

export const errors = {
    serverErrors: {
        NETWORK_ERROR: "Network Error",
        HIGHER_THAN_FINAL_AMOUNT_MSG: "Con el amount ingresado se sobrepasa la meta. Por favor ingrese un amount menor o igual"
    },
    badRequests: {
        BAD_REQUEST: "Request failed with status code 400",
        BAD_REQUEST_CODE: 400,
        REQUIRED_FIELDS: "Todos los campos son obligatorios"
    },
    notFounds: {
        NOT_FOUND: "Request failed with status code 404",
        NOT_FOUND_CODE: 404,
        WITH_NO_INCOMES_EXPENSES: "No existen ingresos/egresos. Comience a crear transactions..."
    }
};
export const texts = {
    ON_DELETING_QUESTION: "Do you want to cancel the transaction?",
    ON_GOAL_DELETING_QUESTION: "Do you want to delete the goal?",
    ON_DELETING_WARN: "Upon confirmation, the transaction will be definitively cancelled.",
    ON_GOAL_DELETING_WARN: "Confirming will permanently delete the goal.",
    ON_DELETING_QUESTION_ACCOUNT_WARN: "Do you want to delete your account?",
    ON_DELETING_ACCOUNT_WARN: "Upon confirmation, all your data will be permanently deleted.",
    ON_DELETING_SUCCESS: "The transaction has been canceled",
    ON_DELETING_ACCOUNT_SUCCESS: "The user has been deleted",
    WITH_NO_TRANSACTIONS: "Balance information not available. Start creating transactions...",
    WITH_NO_EXPENSES: "Expense information not available. Start creating expenses...",
    WITH_NO_INCOMES: "Income information not available. Start creating income...",
    WITH_NO_RESERVES: "Reserves information not available. Start creating reserves...",
    WITH_NO_GOALS: "No goals active. Start creating goals...",
    NO_CHART: "Graphic not available. No expenses are recorded...",
    ON_COMPLETED_GOAL: "Goal completed!",
    ON_WITHDRAWN_GOAL: "The goal has been successfully withdrawn!",
    INCOMES: "incomes",
    EXPENSES: "expenses"
};

export const amountReGex = /^\d{1,8}?(\.\d{0,2})?$/;
export const textsReGex = /^[A-Za-z\s]+$/;