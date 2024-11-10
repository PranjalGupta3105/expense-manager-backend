const expenseTypeDef = /* GraphQL */ 
`
  type Query {
      expenses: ExpenseArray
      total_spends: Float!
      total_amount_in_mon(mon_no: Int): Float!
      date_wise_expenses(mon_no: Int): [DateExpenses]
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
  }

  type deleteExpenseObject {
    deleted_expenses: [Expense]
    message: String
  }

  type Mutation {
      createExpense(source_id: Int, source: String, method_id: Int, method: String, amount: Float, description: String, date: String): Expense 
      deleteExpense(ids: [Int]): deleteExpenseObject
  }
`
module.exports = expenseTypeDef