const mongoose = require("mongoose");
const config = require("config");

const connect = async () => {
  await mongoose.connect(
    "mongodb+srv://pwMaster:R0Xtt2CsgqM3azbqR1kH@pwdevelopment-5gy4a.mongodb.net/payw?retryWrites=true&w=majority",
    config.get("db.options")
  );
};

mongoose.connection.on("disconnected", event => {
  console.error(event);
  console.error("Database disconection");
});

module.exports = {
  connect
};
