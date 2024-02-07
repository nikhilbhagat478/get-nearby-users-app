const mongoose = require("mongoose");

async function main() {
  await mongoose.connect(process.env.CONNECTION_STRING);
}

main()
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => console.log(err));
