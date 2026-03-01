const expenseTypeDef = /* GraphQL */ 
`
  type Query {
      expenses(page_no: Int, page_size: Int, search_param: String, from_date: String, to_date: String): ExpenseArray
      total_spends: Float!
      total_amount_in_mon(mon_no: Int): Float!
      date_wise_expenses(mon_no: Int): [DateExpenses]
      activePaymentCardsDetails: [PaymentCardDetails]
  }

  type ExpenseArray {
    rows: [Expense]
    count: Int
  }

  type DateExpenses {
    date: String,
    amount: Float,
    total_expenses: Int
  }

  type Expense {
    id: Int
    source_id: Int
    source: Source
    method_id: Int
    method: Method
    amount: Float
    description: String
    """
    The date at which the expense was added in ___date___ only format34qa 
    """
    date: String
    created_by: Int
    user: User
    updated_by: Int
    is_deleted: Int
    is_repayed: Int
    tag: String 
    category_id: Int
    card_id: Int
    card_name: String
  }

  type deleteExpenseObject {
    deleted_expenses: [Expense]
    message: String
  }

  type PaymentCardDetails {
    id: Int
    name: String
    source_name: String
    statement_date: String
    renewal_date: String
    renewal_amount: String
    fee_waiver_amount: String
    amount_spent_since_renewal: String
  }

  type Mutation {
      createExpense(source_id: Int, source: String, method_id: Int, method: String, amount: Float, description: String, date: String, tag: String, card_id: Int, sub_category_id: Int): Expense
      updateExpense(id: Int!, source_id: Int, method_id: Int, amount: Float, description: String, date: String, tag: String, is_repayed: Int ,card_id: Int, sub_category_id: Int): Expense
      deleteExpense(ids: [Int]): deleteExpenseObject
  }

  type ExpenseDaySummary {
    transactions_count: Int
    amount: Float
    date: String
    day_name: String
  }

  type ExpenseWeekSummary {
    transactions_count: Int
    total_amount: Float
    week_start: String
    week_end: String
    week_number: String
  }

  type ExpenseMonthSummary {
    transactions_count: Int
    total_amount: Float
    month_start: String
    month_name: String
  }

  extend type Query {
    expenseEachDayInCurWeek(tag_value: String): [ExpenseDaySummary]
    expensePerWeekInCurMon(tag_value: String): [ExpenseWeekSummary]
    expensePerMonInCurYear(tag_value: String): [ExpenseMonthSummary]
  }
`
module.exports = expenseTypeDef