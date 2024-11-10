const {
  createNewUser,
  getAllUsers,
  getUserDetailsById,
} = require("../services/user");
const user_resolvers = {
  Mutation: {
    newUser: async (
      _,
      {
        input: {
          first_name,
          last_name,
          username,
          password,
          country_code,
          phone,
          pfp,
        },
      }
    ) => 
      await createNewUser(
        first_name,
        last_name,
        username,
        password,
        country_code,
        phone,
        pfp
      )
  },
  Query: {
    users: async () => await getAllUsers(),
    // user: async (_, { id }) => await getUserDetailsById(id),
  },
};

module.exports = user_resolvers;
