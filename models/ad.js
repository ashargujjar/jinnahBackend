const { Ad: AdModel } = require("../schemas/schemas");
const fs = require("fs");
const path = require("path");
const AWS = require("aws-sdk");
const s3 = new AWS.S3();
class Ad {
  constructor(
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
    images // array of image paths
  ) {
    this.userId = userId;
    this.title = title;
    this.description = description;
    this.type = type;
    this.address = address;
    this.price = price;
    this.bedrooms = bedrooms;
    this.bathrooms = bathrooms;
    this.kitchen = kitchen;
    this.floor = floor;
    this.size = size;
    this.furnished = furnished;
    this.images = images;
  }

  async save() {
    try {
      // validate images count
      if (!this.images || this.images.length === 0) {
        throw new Error("At least 1 image is required");
      }
      if (this.images.length > 5) {
        throw new Error("Maximum 5 images allowed");
      }

      // create the ad with images
      const ad = await AdModel.create({
        userId: this.userId,
        title: this.title,
        description: this.description,
        type: this.type,
        address: this.address,
        price: this.price,
        bedrooms: this.bedrooms,
        bathrooms: this.bathrooms,
        kitchen: this.kitchen,
        floor: this.floor,
        size: this.size,
        furnished: this.furnished,
        images: this.images,
      });

      return ad;
    } catch (err) {
      throw err;
    }
  }
  static async getUserAds(userId) {
    try {
      const ads = await AdModel.find({ userId });
      return ads;
    } catch (err) {
      throw err;
    }
  }
  static async getAllAds() {
    try {
      const ads = await AdModel.find();
      return ads;
    } catch (err) {
      throw err;
    }
  }
  static async deleteAd(adId, userId) {
    try {
      // Find the ad
      const ad = await AdModel.findOne({ _id: adId, userId });

      if (!ad) {
        throw new Error("Ad not found or unauthorized");
      }

      // ----------- Delete images from uploads folder -------------
      // if (ad.images && Array.isArray(ad.images)) {
      //   for (const imgPath of ad.images) {
      //     // Ensure cross-platform safe path
      //     const fileName = path.basename(imgPath);
      //     const fullPath = path.join(__dirname, "..", "uploads", fileName);

      //     try {
      //       await fs.promises.unlink(fullPath);
      //       console.log(`Deleted image: ${fullPath}`);
      //     } catch (err) {
      //       if (err.code === "ENOENT") {
      //         console.warn(`Image not found (already deleted?): ${fullPath}`);
      //       } else {
      //         console.error(`Failed to delete image: ${fullPath}`, err);
      //       }
      //     }
      //   }
      // }
      if (ad.images && Array.isArray(ad.images)) {
        for (const imgPath of ad.images) {
          // Extract filename from URL (for local deletion only)
          const fileName = path.basename(imgPath.url);

          // Delete from local uploads folder
          const fullPath = path.join(__dirname, "..", "uploads", fileName);
          try {
            await fs.promises.unlink(fullPath);
            console.log(`Deleted local image: ${fullPath}`);
          } catch (err) {
            if (err.code === "ENOENT") {
              console.warn(`Local image not found: ${fullPath}`);
            } else {
              console.error(`Failed to delete local image: ${fullPath}`, err);
            }
          }

          // Delete from S3 bucket
          try {
            await s3
              .deleteObject({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: imgPath.key, // use the exact S3 key from DB
              })
              .promise();

            console.log(`Deleted S3 image: ${imgPath.key}`);
          } catch (err) {
            console.error(`Failed to delete S3 image: ${imgPath.key}`, err);
          }
        }
      }

      // Delete ad from DB
      await AdModel.deleteOne({ _id: adId, userId });
      return ad;
    } catch (err) {
      console.error("Error deleting ad:", err);
      throw err;
    }
  }
  static async getAdById(adId) {
    try {
      const ad = await AdModel.findById(adId).populate(
        "userId",
        "name email phone address -_id"
      );
      return ad;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Ad;
