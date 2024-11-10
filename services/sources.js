const paymentSource = require("../models/source");

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

module.exports = {
  getPaymentSourceById,
  getAllPaymentSources,
  addNewPaymentSource,
  deletePaymentSource,
  updatePaymentSource
};
