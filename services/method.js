
const paymentMethod = require("../models/method");

const addPaymentSource = async function (name) {
    try {
        return await paymentMethod.create({ name})
    } catch (error) {
        throw error;
    }
}

const getPaymentMethodById = async function (id) {
    try {
        return await paymentMethod.findOne({ where: { id } });
    } catch (error) {
        throw error;
    }
}

const getAllPaymentMethods = async function () {
    try {
        let payment_methods = await paymentMethod.findAndCountAll({
          where: { is_active: 1 },
          order: [["id", "ASC"]],
        });
        if(payment_methods.count > 0)
            return payment_methods.rows;
        else
            return [];
    } catch (error) {
        throw error;
    }
}

const updatePaymentMethod = async function (id, name) {
    try {
        let payment_method = await paymentMethod.update({ name }, { where: { id }, returning: true });
        return payment_method[1][0]
    } catch (error) {
        throw error;
    }
}

const deletePaymentMethod = async function (id) {
    try {
        let payment_method = await paymentMethod.update(
          { is_active: 0 },
          { where: { id }, returning: true });

        return payment_method[1][0];
    } catch (error) {
        throw error;
    }
}

module.exports = {
    addPaymentSource,
    getPaymentMethodById,
    getAllPaymentMethods,
    updatePaymentMethod,
    deletePaymentMethod
}