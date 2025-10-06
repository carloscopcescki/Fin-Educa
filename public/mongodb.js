const mongoose = require("mongoose")
require("dotenv").config();
//import bcrypt from "bcryptjs";

mongoose
.connect(
    process.env.MONGODB_URL,
)
.then(() => console.log("MongoDB Atlas conectado!"))
.catch((error) => console.log(error));

const LoginSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
});

/*LoginSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
*/

const user = new mongoose.model("user", LoginSchema);

module.exports = user