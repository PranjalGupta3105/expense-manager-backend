const {
  addNewExpense,
  updateAnExpense,
  getAllExpenses,
  getExpensesDetailsById,
  deleteExpenses,
  getTotalAmountSpentInMonth,
  getTotalAmountSpent,
  getExpensesOwners,
  getExpensesDateWise,
  getActivePaymentCardsDetails,
  getExpenseEachDayInCurWeek,
  getExpensePerWeekInCurMon,
  getExpensePerMonInCurYear,
  addNewExpenseV2,
  updateAnExpenseV2
} = require("../services/expense");
const { getPaymentSourceById } = require("../services/sources");
const { getPaymentMethodById } = require("../services/method");
const { getUserDetailsById } = require("../services/user");

const expense_resolvers = {
  Mutation: {
    // parent, argument, context
    createExpense: async (
      _,
      { source_id, method_id, amount, description, date, tag, card_id },
      { logged_userid },
    ) => {
      // If the card_id is provided, use the V2 function to include it and create an expense with card association
      if (card_id)
        await addNewExpenseV2(
          source_id,
          method_id,
          amount,
          description,
          date,
          logged_userid,
          logged_userid,
          tag,
          card_id,
        );
      else
        await addNewExpense(
          source_id,
          method_id,
          amount,
          description,
          date,
          logged_userid,
          logged_userid,
          tag,
        );
    },
    deleteExpense: async (_, { ids }, { logged_userid }) => {
      let expenses = await getExpensesOwners(ids);
      let expense_owners_array = expenses.map((exp) =>
        parseInt(exp.created_by),
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
      {
        id,
        source_id,
        method_id,
        amount,
        description,
        date,
        tag,
        is_repayed,
        card_id,
      },
      { logged_userid },
    ) => {
      let updateResult;

      let expenses = await getExpensesOwners([id]);
      let expense_owners_array = expenses.map((exp) =>
        parseInt(exp.created_by),
      );
      const allEqual = (arr) => arr.every((val) => val === arr[0]);

      if (expense_owners_array.length == ids.length)
        if (allEqual(expense_owners_array)) {
          if (expense_owners_array[0] != logged_userid) {
            if (card_id) {
              // Call the V2 function if card_id is provided
              updateResult = await updateAnExpenseV2(
                id,
                source_id,
                method_id,
                amount,
                description,
                date,
                logged_userid,
                tag,
                is_repayed,
                card_id,
              );
            } else {
              // Present for backend compatibility
              updateResult = await updateAnExpense(
                id,
                source_id,
                method_id,
                amount,
                description,
                date,
                logged_userid,
                tag,
                is_repayed,
              );
            }
            return await getExpensesDetailsById(id);
          } else
            return {
              deleted_expenses: [],
              message: "Cannot update since you do not own these expense's",
            };
        } else
          return {
            deleted_expenses: [],
            message: "Cannot update since you do not own these expense's",
          };
      else
        return {
          deleted_expenses: [],
          message: "Cannot update since you do not own these expense's",
        };
    },
  },
  Query: {
    expenses: async (_, { page_no, page_size, search_param, from_date, to_date }, { logged_userid }) => await getAllExpenses(page_no, page_size, logged_userid, search_param, from_date, to_date), // instead of hard coded 1 how to get the value of req.logged_userid
    total_amount_in_mon: async (_, { mon_no }) =>
      await getTotalAmountSpentInMonth(mon_no),
    total_spends: async () => await getTotalAmountSpent(),
    date_wise_expenses: async (_, { mon_no }) =>
      await getExpensesDateWise(mon_no),
    activePaymentCardsDetails: async () => {
      return await getActivePaymentCardsDetails();
    },
    expenseEachDayInCurWeek: async (_, { tag_value }) => {
      return await getExpenseEachDayInCurWeek(tag_value);
    },
    expensePerWeekInCurMon: async (_, { tag_value }) => {
      return await getExpensePerWeekInCurMon(tag_value);
    },
    expensePerMonInCurYear: async (_, { tag_value }) => {
      return await getExpensePerMonInCurYear(tag_value);
    },
  },
  Expense: {
    source: async (expense) => await getPaymentSourceById(expense.source_id),
    method: async (expense) => await getPaymentMethodById(expense.method_id),
    user: async (expense) => await getUserDetailsById(expense.created_by),
  },
};

module.exports = expense_resolvers;
