const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Ad = require("../models/ad");
exports.PostLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    if (user) {
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          name: user.name,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      return res
        .status(200)
        .json({ message: "Login succesfull", token: token });
    } else {
      throw new Error("Invalid email or password");
    }
  } catch (err) {
    const message =
      err.message || "Something went wrong. Please try again later.";
    return res.status(500).json({ error: message });
  }
};
exports.PostRegister = async (req, res) => {
  console.log(req.body);
  const { name, email, phone, address, password } = req.body;
  const user = new User(name, email, phone, address, password);
  try {
    const save = await user.save();
    if (save) {
      return res.status(201).json({ message: "User registered successfully" });
    }

    if (!save) {
      return res.status(400).json({ error: "User registration failed" });
    }
  } catch (err) {
    if (err.message === "Email already exists") {
      return res.status(400).json({ error: err.message });
    }
    return res
      .status(500)
      .json({ error: "Something went wrong. Please try again later." });
  }
};

exports.postAd = async (req, res) => {
  const {
    title,
    description,
    type,
    address,
    price,
    bedrooms,
    bathrooms,
    kitchen,
    floor,
    size,
    furnished,
  } = req.body;

  const userId = req.user.id;
  const images = req.files
    ? req.files.map((file) => ({
        url: file.location, // S3 public URL
        key: file.key, // S3 object key (needed for deletion later)
      }))
    : [];
  const ad = new Ad(
    userId,
    title,
    description,
    type,
    address,
    price,
    bedrooms,
    bathrooms,
    kitchen,
    floor,
    size,
    furnished,
    images
  );
  try {
    const savedAd = await ad.save();
    if (savedAd) {
      return res.status(201).json({ message: "Ad posted successfully" });
    } else {
      return res.status(400).json({ error: "Ad posting failed" });
    }
  } catch (err) {
    const message =
      err.message || "Something went wrong. Please try again later.";
    return res.status(500).json({ error: message });
  }
};
exports.getMYAdds = async (req, res) => {
  const userId = req.user.id;
  try {
    const ads = await Ad.getUserAds(userId);
    return res.status(200).json({ ads });
  } catch (err) {
    const message = err.message || "Something went wrong. Please try again.";
    return res.status(500).json({ error: message });
  }
};

exports.getAvailableAdds = async (req, res) => {
  try {
    const ads = await Ad.getAllAds();
    return res.status(200).json({ ads });
  } catch (err) {
    const message = err.message || "Something went wrong. Please try again.";
    return res.status(500).json({ error: message });
  }
};

exports.deleteAd = async (req, res) => {
  const adId = req.params.id;
  const userId = req.user.id;
  try {
    const deletedAd = await Ad.deleteAd(adId, userId);
    if (deletedAd) {
      return res.status(200).json({ message: "Ad deleted successfully" });
    } else {
      return res.status(404).json({ error: "Ad not found or unauthorized" });
    }
  } catch (err) {
    const message = err.message || "Something went wrong. Please try again.";
    return res.status(500).json({ error: message });
  }
};

exports.getAdDetails = async (req, res) => {
  const adId = req.params.id;
  try {
    const ad = await Ad.getAdById(adId);
    if (ad) {
      return res.status(200).json({ ad });
    } else {
      return res.status(404).json({ error: "Ad not found" });
    }
  } catch (err) {
    console.log(err);
    const message = err.message || "Something went wrong. Please try again.";
    return res.status(500).json({ error: message });
  }
};
