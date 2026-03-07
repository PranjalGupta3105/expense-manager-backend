const Expense = require("../models/expense");
const { Op, fn, col, where } = require("sequelize");
const { sequelize } = require("../config/database");
const paymentCards = require("../models/cards");
const TransactionSubCategory = require("../models/transaction_sub_category");
const TransactionCategory = require("../models/transaction_category");

const currentYear = new Date().getFullYear();

async function addNewExpense(
  source_id,
  method_id,
  amount,
  description,
  date,
  created_by,
  updated_by,
  tag,
  sub_category_id = null,
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
      tag,
      sub_category_id,
    });
  } catch (error) {
    throw error;
  }
}

async function getAllExpenses(
  page_no,
  page_size,
  user_id,
  search_param,
  from_date,
  to_date,
) {  
  try {
    let expenses = null;

    let whereCondition = { created_by: user_id, is_deleted: 0 };

    if (search_param) {
      if (search_param.trim() !== "") {
        try {
          const parsedNumber = parseFloat(search_param);
          if (!isNaN(parsedNumber) && parsedNumber > 0) {
            whereCondition[Op.or] = [{ amount: parsedNumber }];
          } else {
            whereCondition[Op.or] = [
              { description: { [Op.iLike]: `%${search_param}%` } },
              { tag: { [Op.iLike]: `%${search_param}%` } },
            ];
          }
        } catch (error) {
          whereCondition[Op.or] = [
            { description: { [Op.ilike]: `%${search_param}%` } },
            { tag: { [Op.ilike]: `%${search_param}%` } },
          ];
        }
      }
    }

    if (from_date && to_date) {
      whereCondition[Op.and] = [
        where(fn("DATE", col("date")), {
          [Op.gte]: from_date,
          [Op.lte]: to_date,
        }),
      ];
    }

    const offset = ((page_no && page_no > 0) && (page_size && page_size > 0)) ? (page_no - 1) * page_size : 0;
    const limit = page_size ? page_size : 0;

    if (limit > 0)
      expenses = await Expense.findAndCountAll({
        where: whereCondition,
        attributes: [
          "id",
          "source_id",
          "method_id",
          "amount",
          "description",
          "date",
          "created_by",
          "updated_by",
          "is_deleted",
          "is_repayed",
          "tag",
          "sub_category_id",
          "card_id",
          [sequelize.col("payment_cards.name"), "card_name"],
          [sequelize.col("sub_category.name"), "sub_category_name"],
          [sequelize.col("sub_category->transaction_category.name"), "category_name"],
        ],
        raw: true,
        include: [
          {
            model: paymentCards,
            as: "payment_cards",
            attributes: [],
          },
          {
            model: TransactionSubCategory,
            as: "sub_category",
            left: true,
            attributes: [],
            required: false,
            where: { is_deleted: 0 },
            include: [
              {
                model: TransactionCategory,
                as: "transaction_category",
                attributes: ['name'],
                where: { is_deleted: 0 },
              },
            ],
          },
        ],
        limit,
        offset,
        order: [
          ["date", "DESC"],
          ["id", "DESC"],
        ],
      });
    else
      expenses = await Expense.findAndCountAll({
        where: whereCondition,
        attributes: [
          "id",
          "source_id",
          "method_id",
          "amount",
          "description",
          "date",
          "created_by",
          "updated_by",
          "is_deleted",
          "is_repayed",
          "tag",
          "sub_category_id",
          "card_id",
          [sequelize.col("payment_cards.name"), "card_name"],
          [sequelize.col("sub_category.name"), "sub_category_name"],
          [sequelize.col("sub_category->transaction_category.name"), "category_name"],
        ],
        raw: true,
        include: [
          {
            model: paymentCards,
            as: "payment_cards",
            attributes: [],
          },
          {
            model: TransactionSubCategory,
            as: "sub_category",
            left: true,
            attributes: [],
            required: false,
            where: { is_deleted: 0 },
            include: [
              {
                model: TransactionCategory,
                as: "transaction_category",
                attributes: ['name'],
                where: { is_deleted: 0 },
              },
            ],
          },
        ],
        order: [
          ["date", "DESC"],
          ["id", "DESC"],
        ],
      });

    if (expenses.count > 0)
      return { rows: expenses.rows, count: expenses.count };
    else return { rows: [], count: 0 };
  } catch (error) {
    console.log("Error in getAllExpenses service:", error);
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
  updated_by,
  tag,
  is_repayed,
  sub_category_id = null
) {
  try {
    const updateFields = {};
    if (source_id !== undefined) updateFields.source_id = source_id;
    if (method_id !== undefined) updateFields.method_id = method_id;
    if (amount !== undefined) updateFields.amount = amount;
    if (description !== undefined) updateFields.description = description;
    if (date !== undefined) updateFields.date = date;
    if (updated_by !== undefined) updateFields.updated_by = updated_by;
    if (tag !== undefined) updateFields.tag = tag;
    if (is_repayed !== undefined) updateFields.is_repayed = is_repayed;
    if (sub_category_id !==  null && sub_category_id !== undefined) updateFields.sub_category_id = sub_category_id;

    console.log("updateFields in updateAnExpense service:", JSON.stringify(updateFields));

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
    await Expense.update(
      { is_deleted: 1 },
      { where: { id: { [Op.in]: expense_ids } } },
    );
    let updated_expenses = await Expense.findAll({
      where: { id: { [Op.in]: expense_ids } },
    });
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
          month_no != 0
            ? month_no.toString().length > 1
              ? month_no
              : "0" + month_no
            : 12
        }' 
        AND
		    to_char(date::TIMESTAMP, 'YYYY') = '${
          month_no != 0
            ? new Date().getFullYear()
            : new Date().getFullYear() - 1
        }')
      	ORDER BY date DESC
      )q`);
    return resp[0][0].total_amount;
  } catch (error) {
    throw error;
  }
}

async function getTotalAmountSpent() {
  try {
    let resp = await sequelize.query(`
      SELECT SUM(amount) total_amount FROM expenses WHERE is_deleted = 0 AND is_repayed = 0`);
    return resp[0][0].total_amount;
  } catch (error) {
    throw error;
  }
}

const getExpensesOwners = async function (expense_ids) {
  try {
    return await Expense.findAll({
      attributes: ["created_by"],
      where: { id: { [Op.in]: expense_ids } },
    });
  } catch (error) {
    throw error;
  }
};

const getExpensesDateWise = async function (month_number) {
  try {
    let resp =
      await sequelize.query(`SELECT date, SUM(amount) amount, COUNT(*) total_expenses FROM expenses WHERE is_deleted = 0 AND 
    ( 
      to_char(date::TIMESTAMP, 'MM') = '${
        month_number.length > 1 ? month_number : "0" + month_number
      }'
      AND
      to_char(date::TIMESTAMP, 'YYYY') = to_char(now()::TIMESTAMP, 'YYYY') 
    ) 
    GROUP BY date ORDER BY date DESC`);
    return resp[0];
  } catch (error) {
    throw error;
  }
};

async function getActivePaymentCardsDetails() {
  try {
    const query = `
      SELECT 
          pc.id,
          pc.name,
          ps.name AS source_name,
          pc.statement_date,
          pc.renewal_amount,
          pc.fee_waiver_amount,
          (
            CASE 
              WHEN pc.renewal_date != 0 THEN TO_CHAR(
                  TO_DATE(
                    pc.renewal_date::text || '-' || pc.renewal_mon::text || '-' || EXTRACT(YEAR FROM NOW())::text,
                    'DD-MM-YYYY'
                  ),
                  'DD/MM'
              )
              ELSE 'Free'
            END
          ) AS renewal_date,
          (
            CASE 
              WHEN pc.renewal_date != 0 THEN (
                SELECT COALESCE(SUM(amount), 0) 
                FROM expenses e
                WHERE e.source_id = ps.id 
                  AND e.method_id = pm.id 
                  AND e.date BETWEEN TO_DATE(
                        pc.renewal_date::text || '-' || pc.renewal_mon::text || '-' || EXTRACT(YEAR FROM NOW())::text,
                        'DD-MM-YYYY'
                      )
                      AND NOW()::DATE
              )
              ELSE 0
            END
          ) AS amount_spent_since_renewal
      FROM payment_cards pc
      LEFT JOIN payment_methods pm ON pc.method_id = pm.id
      LEFT JOIN payment_sources ps ON pc.source_id = ps.id
      WHERE pc.is_active = 1 
      AND pc.method_id <> 3
      ORDER BY pc.statement_date ASC;`;
    const [results] = await sequelize.query(query);
    return results;
  } catch (error) {
    throw error;
  }
}

async function getExpenseEachDayInCurWeek(tag_value = null, transactions_year = currentYear) {
  try {

    const tag_query =
      tag_value && tag_value != ""
        ? `tag = '${tag_value}' AND -- filter expenses tagged as '<tag_value>'`
        : "";
    const query = `
    SELECT COUNT(*) transactions_count, 
    FLOOR(SUM(amount)) amount, to_char(date, 'YYYY-MM-DD') AS date, to_char(date, 'Dy') day_name
    FROM expenses
    WHERE 
      ${tag_query}
      is_deleted = 0 AND
      date >= date_trunc('week', now()) -- having date starting the week start date
      AND date < date_trunc('week', now()) + INTERVAL '1 week' -- having date ending the week end date
      -- AND EXTRACT(DOW FROM date) BETWEEN 1 AND 5 -- and also between Mon to Fri only
      AND EXTRACT(YEAR FROM date) = ${transactions_year ? transactions_year.toString() : 'EXTRACT(YEAR FROM CURRENT_DATE)'} -- current year only
    GROUP BY date
    ORDER BY date;`;
    const [results] = await sequelize.query(query);
    return results;
  } catch (error) {
    throw error;
  }
}

async function getExpensePerWeekInCurMon(tag_value = null, transactions_year = currentYear) {
  try {

    const tag_query =
      tag_value && tag_value != ""
        ? `tag = '${tag_value}' AND -- filter expenses tagged as '<tag_value>' if provided`
        : ``;
    const query = `
      SELECT 
      COUNT(*) AS transactions_count,
      FLOOR(SUM(amount)) AS total_amount,
      DATE_TRUNC('week', date)::date AS week_start,
  	  (DATE_TRUNC('week', date) + INTERVAL '1 week')::date AS week_end,
      to_char(DATE_TRUNC('week', date), 'IW') AS week_number  -- ISO week number
      FROM expenses
      WHERE 
        ${tag_query}
        is_deleted = 0 AND
        EXTRACT(YEAR FROM date) = ${transactions_year ? transactions_year.toString() : 'EXTRACT(YEAR FROM CURRENT_DATE)'} -- current year only AND
        AND EXTRACT(MONTH FROM date) = EXTRACT(MONTH FROM CURRENT_DATE)  -- current month only
      GROUP BY DATE_TRUNC('week', date)
      ORDER BY week_start;`;
    const [results] = await sequelize.query(query);
    return results;
  } catch (error) {
    throw error;
  }
}

async function getExpensePerMonInCurYear(tag_value = null, transactions_year = currentYear) {
  try {
    
    const tag_query =
      tag_value && tag_value != ""
        ? `tag = '${tag_value}' AND   -- filter expenses tagged as '<tag_value>' if provided`
        : ``;
    const query = `
      SELECT 
      COUNT(*) AS transactions_count,
      FLOOR(SUM(amount)) AS total_amount,
      DATE_TRUNC('month', date)::date AS month_start,
      TO_CHAR(date, 'Month') AS month_name
      FROM expenses
      WHERE 
        ${tag_query}
        is_deleted = 0 AND
        EXTRACT(YEAR FROM date) = ${transactions_year ? transactions_year.toString() : 'EXTRACT(YEAR FROM CURRENT_DATE)'}  -- current year only
      GROUP BY DATE_TRUNC('month', date), TO_CHAR(date, 'Month')
      ORDER BY month_start;`;
    const [results] = await sequelize.query(query);
    return results;
  } catch (error) {
    throw error;
  }
}

async function addNewExpenseV2(
  source_id,
  method_id,
  amount,
  description,
  date,
  created_by,
  updated_by,
  tag,
  card_id,
  sub_category_id = null
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
      tag,
      card_id,
      sub_category_id
    });
  } catch (error) {
    throw error;
  }
}

async function updateAnExpenseV2(
  expense_id,
  source_id,
  method_id,
  amount,
  description,
  date,
  updated_by,
  tag,
  is_repayed,
  card_id,
  sub_category_id = null
) {
  try {
    const updateFields = {};
    if (source_id !== undefined) updateFields.source_id = source_id;
    if (method_id !== undefined) updateFields.method_id = method_id;
    if (amount !== undefined) updateFields.amount = amount;
    if (description !== undefined) updateFields.description = description;
    if (date !== undefined) updateFields.date = date;
    if (updated_by !== undefined) updateFields.updated_by = updated_by;
    if (tag !== undefined) updateFields.tag = tag;
    if (is_repayed !== undefined) updateFields.is_repayed = is_repayed;
    if (card_id !== undefined) updateFields.card_id = card_id;
    if (sub_category_id !==  null && sub_category_id !== undefined) updateFields.sub_category_id = sub_category_id;

    console.log("updateFields in updateAnExpenseV2 service:", JSON.stringify(updateFields));
    if (Object.keys(updateFields).length > 0) {
      updateFields.updated_at = new Date();
      return await Expense.update(updateFields, { where: { id: expense_id } });
    }
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
  getActivePaymentCardsDetails,
  getExpenseEachDayInCurWeek,
  getExpensePerWeekInCurMon,
  getExpensePerMonInCurYear,
  addNewExpenseV2,
  updateAnExpenseV2,
};
