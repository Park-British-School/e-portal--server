let postmark = require("postmark");
const serverToken = "7d0a0998-9165-4e25-be5c-e25ddb114dcf";
let serverClient = new postmark.ServerClient(serverToken);

module.exports = {
  serverClient
}
exports = postmark