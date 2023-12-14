const Matrix_Value = require("./matrix_values.model");
const { v4: uuidv4 } = require("uuid");

getAllMatrixValues = async (req, res) => {
  try {
    const matrixvalues = await Matrix_Value.find();
    res.send(matrixvalues);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

getMatrixValueById = async (req, res) => {
  try {
    const matrixvalue = await Matrix_Value.findById(req.params.id);
    res.send(matrixvalue);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

createMatrixValue = async (req, res) => {
  try {
    const new_matrixvalue = await Matrix_Value.create({
      _id: uuidv4(),
      id_alternative: req.body.id_alternative,
      id_criteria: req.body.id_criteria,
      value: req.body.value,
    });
    res.send(new_matrixvalue);
  } catch (error) {
    res.status(500).json(error);
  }
};

updateMatrixValue = async (req, res) => {
  try {
    const matrixvalue_update = await Matrix_Value.findOneAndUpdate(
      { _id: req.params.id },
      {
        value: req.body.value,
      }
    );
    res.send(matrixvalue_update);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

deleteMatrixValue = async (req, res) => {
  try {
    const matrixvalue_id = req.params.id;
    const matrixvalue = await Matrix_Value.findById(matrixvalue_id);
    if (!matrixvalue) {
      return res.status(404).json({ message: "Matrix Value not found" });
    }
    const valuematrix = matrixvalue.value;
    await Matrix_Value.deleteOne({ _id: matrixvalue_id });
    res.send(`Matrix Value with value ${valuematrix} deleted!`);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

deleteAllMatrixValues = async (req, res) => {
  try {
    await Matrix_Value.deleteMany({});
    res.send(`All Matrix Values deleted!`);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

deleteAllMatrixValuesByAlternative = async (req, res) => {
  try {
    await Matrix_Value.deleteMany({
      id_alternative: req.params.id_alternative,
    });
    res.send(`All Matrix Values deleted!`);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

deleteAllMatrixValuesByCriteria = async (req, res) => {
  try {
    await Matrix_Value.deleteMany({ id_criteria: req.params.id_criteria });
    res.send(`All Matrix Values deleted!`);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllMatrixValues,
  getMatrixValueById,
  createMatrixValue,
  updateMatrixValue,
  deleteMatrixValue,
  deleteAllMatrixValues,
  deleteAllMatrixValuesByAlternative,
  deleteAllMatrixValuesByCriteria,
};
