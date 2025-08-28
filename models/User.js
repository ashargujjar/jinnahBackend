// models/User.js
const bcrypt = require("bcryptjs");
const UserModel = require("../schemas/schemas").User;

class User {
  constructor(name, email, phone, address, password) {
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.password = password;
  }

  // Save user
  async save() {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;

      return await UserModel.create(this);
    } catch (err) {
      if (err.code === 11000) {
        if (err.keyValue.email) {
          throw new Error("Email already exists");
        }
      }
      throw err;
    }
  }

  //   login check
  static async login(email, password) {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new Error("Invalid email or password");
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error("Invalid email or password");
      }

      return user;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = User;
