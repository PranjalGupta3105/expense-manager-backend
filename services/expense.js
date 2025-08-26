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
  updated_by,
  tag
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
      tag
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

async function updateAnExpense(
  expense_id,
  source_id,
  method_id,
  amount,
  description,
  date,
  created_by,
  updated_by,
  tag,
  is_repayed
) {
  try {
    const updateFields = {};
    if (source_id !== undefined) updateFields.source_id = source_id;
    if (method_id !== undefined) updateFields.method_id = method_id;
    if (amount !== undefined) updateFields.amount = amount;
    if (description !== undefined) updateFields.description = description;
    if (date !== undefined) updateFields.date = date;
    if (created_by !== undefined) updateFields.created_by = created_by;
    if (updated_by !== undefined) updateFields.updated_by = updated_by;
    if (tag !== undefined) updateFields.tag = tag;
    if (is_repayed !== undefined) updateFields.is_repayed = is_repayed;

    if (Object.keys(updateFields).length > 0) {
      updateFields.updated_at = new Date();
      return await Expense.update(updateFields, { where: { id: expense_id } });
    }
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
      SELECT COALESCE(SUM(q.amount),0) total_amount
      FROM 
      (
      	SELECT amount, to_char(date::TIMESTAMP, 'MM') mon
      	FROM expenses WHERE is_deleted = 0 AND is_repayed = 0
      	AND 
        (to_char(date::TIMESTAMP, 'MM') = '${
          month_no != 0 ? month_no.toString().length > 1 ? month_no : "0" + month_no : 12
        }' 
        AND
		    to_char(date::TIMESTAMP, 'YYYY') = '${month_no != 0 ? new Date().getFullYear() : ((new Date().getFullYear())-1) }')
      	ORDER BY date DESC
      )q`);
      return resp[0][0].total_amount
  } catch (error) {
    throw error;
  }
}

async function getTotalAmountSpent() {
  try {
    let resp = await sequelize.query(`
      SELECT SUM(amount) total_amount FROM expenses WHERE is_deleted = 0 AND is_repayed = 0`);
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
  let resp = await sequelize.query(`SELECT date, SUM(amount) amount, COUNT(*) total_expenses FROM expenses WHERE is_deleted = 0 AND 
    ( 
      to_char(date::TIMESTAMP, 'MM') = '${month_number.length>1?month_number:'0'+month_number}'
      AND
      to_char(date::TIMESTAMP, 'YYYY') = to_char(now()::TIMESTAMP, 'YYYY') 
    ) 
    GROUP BY date ORDER BY date DESC`);
  return resp[0]
} catch (error) {
  throw error;
}
}

async function getActivePaymentCardsDetails() {
  try {
    const query = `
      SELECT 
        pc.id,
        pc.name,
        ps.name AS source_name,
        pc.statement_date,
        (
          CASE 
            WHEN pc.renewal_date != 0 THEN CONCAT(
              pc.renewal_date, '/',
              (CASE WHEN pc.renewal_mon > 9 THEN pc.renewal_mon::varchar ELSE CONCAT('0', pc.renewal_mon) END)
            )
            ELSE 'NA'
          END
        ) AS renewal_date
      FROM payment_cards pc
      LEFT JOIN payment_methods pm ON pc.method_id = pm.id
      LEFT JOIN payment_sources ps ON pc.source_id = ps.id
      WHERE pc.is_active = 1 AND pc.method_id <> 3
      ORDER BY pc.statement_date ASC
    `;
    const [results] = await sequelize.query(query);
    return results;
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
  getExpensesDateWise,
  getActivePaymentCardsDetails
};
