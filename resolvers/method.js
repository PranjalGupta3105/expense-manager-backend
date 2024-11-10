const {
  addPaymentSource,
  updatePaymentMethod,
  getAllPaymentMethods,
  deletePaymentMethod,
} = require("../services/method");
const payment_method_resolver = {
  Query: {
    method: async () => await getAllPaymentMethods(),
  },
  Mutation: {
    createNewPaymentMethod: async (_, { name }) => await addPaymentSource(name),
    updatePaymentMethod: async (_, { id, name }) =>
      await updatePaymentMethod(id, name),
    deletePaymentMethod: async (_, { id }) => await deletePaymentMethod(id),
  },
};

module.exports = payment_method_resolver;
