const mongoose = require("mongoose");

//  User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  password: { type: String, required: true },
});

//  Ad Schema
const adSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true }, // e.g., "House", "Apartment"
  address: { type: String, required: true },
  price: { type: Number, required: true },
  securityDeposit: { type: Number, default: 10000 },
  maintenance: { type: Number, default: 5000 },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  kitchen: { type: Number, required: true },
  floor: { type: Number, required: true },
  size: { type: Number, required: true }, // e.g., square feet
  furnished: { type: String, enum: ["Yes", "No"], default: "No" },
  images: [
    {
      url: { type: String, required: true }, // full S3 URL
      key: { type: String, required: true }, // S3 file key (needed for deletion)
    },
  ],
  updated: { type: Boolean, default: false },
  updatedAt: { type: Date },
  creationDate: { type: Date, default: Date.now },
});

// Models
const User = mongoose.model("User", userSchema);
const Ad = mongoose.model("Ad", adSchema);

module.exports = { User, Ad };
