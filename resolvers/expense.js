const {
  addNewExpense,
  updateAnExpense,
  getAllExpenses,
  getExpensesDetailsById,
  deleteExpenses,
  getTotalAmountSpentInMonth,
  getTotalAmountSpent,
  getExpensesOwners,
  getExpensesDateWise
} = require("../services/expense");
const { getPaymentSourceById } = require("../services/sources");
const { getPaymentMethodById } = require("../services/method");
const { getUserDetailsById } = require("../services/user");

const expense_resolvers = {
  Mutation: {
    // parent, argument, context
    createExpense: async (
      _,
      { source_id, method_id, amount, description, date, tag },
      { logged_userid }
    ) =>
      await addNewExpense(
        source_id,
        method_id,
        amount,
        description,
        date,
        logged_userid,
        logged_userid,
        tag
      ),
    deleteExpense: async (_, { ids }, { logged_userid }) => {
      let expenses = await getExpensesOwners(ids);
      let expense_owners_array = expenses.map((exp) =>
        parseInt(exp.created_by)
      );
      const allEqual = (arr) => arr.every((val) => val === arr[0]);
      if (expense_owners_array.length == ids.length)
        if (allEqual(expense_owners_array))
          if (expense_owners_array[0] == logged_userid)
            return {
              deleted_expenses: await deleteExpenses(ids),
              message: "Deleted Successfully",
            };
          else
            return {
              deleted_expenses: [],
              message: "Cannot delete since you do not own these expense's",
            };
        else
          return {
            deleted_expenses: [],
            message: "Cannot delete since you do not own these expense's",
          };
      else
        return {
          deleted_expenses: [],
          message: "Cannot delete since you do not own these expense's",
        };
    },
    updateExpense: async (
      _,
      { id, source_id, method_id, amount, description, date, created_by, updated_by, tag, is_repayed },
      { logged_userid }
    ) => {
      const updateResult = await updateAnExpense(id, source_id, method_id, amount, description, date, created_by, updated_by, tag, is_repayed);
      return await getExpensesDetailsById(id);
    },
  },
  Query: {
    expenses: async () => await getAllExpenses(1),
    total_amount_in_mon: async (_, { mon_no }) => await getTotalAmountSpentInMonth(mon_no),
    total_spends: async () => await getTotalAmountSpent(),
    date_wise_expenses: async (_, { mon_no }) => await getExpensesDateWise(mon_no)
  },
  Expense: {
    source: async (expense) => await getPaymentSourceById(expense.source_id),
    method: async (expense) => await getPaymentMethodById(expense.method_id),
    user: async (expense) => await getUserDetailsById(expense.created_by),
  },
};

module.exports = expense_resolvers;
