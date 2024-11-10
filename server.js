const express = require("express");
const app = express();
const constants = require("./constants");
require("./config/database");
const { expressMiddleware } = require("@apollo/server/express4");
const apolloServerInstance = require("./config/graphql");
const cors = require("cors");
const { verifyAndGenerateAuthToken, authoriseUserToken } = require("./controllers/auth");

const startServer = async () => {
  try {
    await apolloServerInstance.start();
  } catch (error) {
    console.log(
      `\nUnable to start the graphql server at the destination port due to the error : ${error}\n`
    );
  }

  function getContext({ req }) {
    return { logged_userid : req.logged_userid}
  }

  app.use(cors(), express.json());
  app.post("/login", verifyAndGenerateAuthToken);
  app.use(
    "/graph-ql",
    authoriseUserToken,
    expressMiddleware(apolloServerInstance, { context: getContext })
  );

  app.listen(constants.SERVER_CONFIG.PORT, () => {
    console.log(`Server has started on PORT : ${constants.SERVER_CONFIG.PORT}`);
  });
};

startServer().catch((err) => {
  console.error("Error starting the server:", err);
});
