const express = require("express");
const router = express.Router();
const matrixvaluesController = require("./matrix_values.controller");

router.get("/matrixvalues", matrixvaluesController.getAllMatrixValues);
router.get("/matrixvalues/:id", matrixvaluesController.getMatrixValueById);
router.post("/matrixvalues", matrixvaluesController.createMatrixValue);
router.put("/matrixvalues/:id", matrixvaluesController.updateMatrixValue);
router.delete("/matrixvalues/:id", matrixvaluesController.deleteMatrixValue);
router.delete("/matrixvalues", matrixvaluesController.deleteAllMatrixValues);
router.delete(
  "/matrixvaluescriteria/:id_criteria",
  matrixvaluesController.deleteAllMatrixValuesByCriteria
);
router.delete(
  "/matrixvaluesalternative/:id_alternative",
  matrixvaluesController.deleteAllMatrixValuesByAlternative
);

module.exports = router;
