const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/multer");
const userController = require("../controllers/user");
router.post("/login", userController.PostLogin);
router.post("/register", userController.PostRegister);
router.post("/postAd", auth, upload.array("images", 5), userController.postAd);
router.get("/myAdds", auth, userController.getMYAdds);
router.get("/availableAdds", userController.getAvailableAdds);
router.get("/adDetails/:id", userController.getAdDetails);
router.delete("/deleteAd/:id", auth, userController.deleteAd);

module.exports = router;
