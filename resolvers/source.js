const {
  addNewPaymentSource,
  getAllPaymentSources,
  deletePaymentSource,
  updatePaymentSource,
  getCCPaymentSources,
} = require("../services/sources");
const payment_source_resolver = {
  Mutation: {
    newSource: async (_, { name }) => await addNewPaymentSource(name),
    deleteSource: async (_, { id }) => await deletePaymentSource(id),
    updateSource: async (_, { id, name }) =>
      await updatePaymentSource(id, name),
  },
  Query: {
    sources: async () => await getAllPaymentSources(),
    ccSources: async () => await getCCPaymentSources(),
  },
};

module.exports = payment_source_resolver;
