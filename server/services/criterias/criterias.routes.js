const express = require("express");
const router = express.Router();
const criteriasController = require("./criterias.controller");

router.get("/criterias", criteriasController.getAllCriterias);
router.get("/criterias/:id", criteriasController.getCriteriaById);
router.post("/criterias", criteriasController.createCriteria);
router.put("/criterias/:id", criteriasController.updateCriteria);
router.delete("/criterias/:id", criteriasController.deleteCriteria);
router.delete("/criterias", criteriasController.deleteAllCriterias);

module.exports = router;
