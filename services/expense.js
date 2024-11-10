const Expense = require("../models/expense");
const { Op, Sequelize } = require("sequelize");
const {sequelize} = require("../config/database");

async function addNewExpense(
  source_id,
  method_id,
  amount,
  description,
  date,
  created_by,
  updated_by
) {
  try {
    return await Expense.create({
      source_id,
      method_id,
      amount,
      description,
      date,
      created_by,
      updated_by,
    });
  } catch (error) {
    throw error;
  }
}

async function getAllExpenses(user_id) {
  try {
    let expenses = await Expense.findAndCountAll({
      where: { created_by: user_id, is_deleted: 0 },
      order: [["date", "DESC"],["id", "DESC"]]
    });
    if (expenses.count > 0)
      return { rows: expenses.rows, count: expenses.count };
    else return { rows: [], count: 0 };
  } catch (error) {
    throw error;
  }
}

async function getExpensesDetailsById(expense_id) {
  try {
    return await Expense.findOne({ where: { id: expense_id } });
  } catch (error) {
    throw error;
  }
}

async function updateAnExpense(expense_id) {
  try {
    return await Expense.update(
      {
        source_id,
        method_id,
        amount,
        description,
        date,
        created_by,
        updated_by,
      },
      { where: { id: expense_id } }
    );
  } catch (error) {
    throw error;
  }
}

async function deleteExpenses(expense_ids) {
  try {
    await Expense.update( { is_deleted: 1 }, { where: { id: { [Op.in]: expense_ids } } } );
    let updated_expenses = await Expense.findAll({ where: { id: { [Op.in]: expense_ids } } });
    return updated_expenses;
  } catch (error) {
    throw error;
  }
}

async function getTotalAmountSpentInMonth(month_no) {
  try {
    let resp = await sequelize.query(`
      SELECT SUM(q.amount) total_amount
      FROM 
      (
      	SELECT amount, to_char(date::TIMESTAMP, 'MM') mon
      	FROM expenses WHERE is_deleted = 0 
      	AND to_char(date::TIMESTAMP, 'MM') = '${month_no}' 
      	ORDER BY date DESC
      )q
      GROUP BY q.mon`);
      return resp[0][0].total_amount
  } catch (error) {
    throw error;
  }
}

async function getTotalAmountSpent() {
  try {
    let resp = await sequelize.query(`
      SELECT SUM(amount) total_amount FROM expenses WHERE is_deleted = 0`);
      return resp[0][0].total_amount
  } catch (error) {
    throw error;
  }
}


const getExpensesOwners = async function (expense_ids) {
  try {
    return await Expense.findAll({ attributes: ['created_by'], where: { id: { [Op.in]: expense_ids } } });
  } catch (error) {
    throw error;
  }
}

const getExpensesDateWise = async function (month_number) {
try {
  let resp = await sequelize.query(`SELECT date, SUM(amount) amount, COUNT(*) total_expenses FROM expenses WHERE is_deleted = 0 AND to_char(date::TIMESTAMP, 'MM') = '${month_number}' GROUP BY date ORDER BY date DESC`);
  return resp[0]
} catch (error) {
  throw error;
}
}

module.exports = {
  addNewExpense,
  updateAnExpense,
  getAllExpenses,
  getExpensesDetailsById,
  deleteExpenses,
  getTotalAmountSpentInMonth,
  getTotalAmountSpent,
  getExpensesOwners,
  getExpensesDateWise
};
