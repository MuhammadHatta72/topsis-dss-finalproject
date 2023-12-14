const express = require("express");
const router = express.Router();
const alternativesController = require("./alternatives.controller");

router.get("/alternatives", alternativesController.getAllAlternatives);
router.get("/alternatives/:id", alternativesController.getAlternativeById);
router.post("/alternatives", alternativesController.createAlternative);
router.put("/alternatives/:id", alternativesController.updateAlternative);
router.delete("/alternatives/:id", alternativesController.deleteAlternative);
router.delete("/alternatives", alternativesController.deleteAllAlternatives);

module.exports = router;
