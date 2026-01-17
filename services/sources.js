const paymentSource = require("../models/source");
const paymentCards = require("../models/cards");
const { sequelize } = require("../config/database");

const getPaymentSourceById = async function (id) {
  try {
    return await paymentSource.findOne({ where: { id } });
  } catch (error) {
    throw error;
  }
};

const getAllPaymentSources = async function () {
  try {
    let payment_sources = await paymentSource.findAndCountAll({
      where: { is_active: 1 },
    });
    if (payment_sources.count) return payment_sources.rows;
    else return [];
  } catch (error) {
    throw error;
  }
};

const addNewPaymentSource = async function (name) {
    try {
        return await paymentSource.create({ name });
    } catch (error) {
        throw error;
    }
}

const deletePaymentSource = async function (id) {
    try {
        return (
          await paymentSource.update({ is_active: 0 }, { where: { id }, returning: true })
        )[1][0];
    } catch (error) {
        throw error;
    }
}

const updatePaymentSource = async function (id, name) {
    try {
        return (await paymentSource.update(
          { name },
          { where: { id }, returning: true }
        ))[1][0];
    } catch (error) {
        throw error;
    }
}

const getCCPaymentSources = async function () {
  try {
    let payment_sources = (await paymentCards.findAll({
      attributes: ["id", ["name", "card_name"], "source_id", 
      [sequelize.col("payment_source.name"), "issuing_bank"],
      [sequelize.literal(4), "method_id"]
      ],
      where: { is_active: 1, method_id: 4 },
      raw: true,
      include: [
        {
          model: paymentSource,
          as: "payment_source",
          attributes: [],
        },
      ],
    }));
    return payment_sources;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getPaymentSourceById,
  getAllPaymentSources,
  addNewPaymentSource,
  deletePaymentSource,
  updatePaymentSource,
  getCCPaymentSources,
};
