const Criteria = require("./criterias.model");
const { v4: uuidv4 } = require("uuid");

getAllCriterias = async (req, res) => {
  try {
    const criterias = await Criteria.find();
    res.send(criterias);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

getCriteriaById = async (req, res) => {
  try {
    const criteria = await Criteria.findById(req.params.id);
    res.send(criteria);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

createCriteria = async (req, res) => {
  try {
    const new_criteria = await Criteria.create({
      _id: uuidv4(),
      name_criteria: req.body.name_criteria,
      weight_criteria: req.body.weight_criteria,
      type_criteria: req.body.type_criteria,
    });
    res.send(new_criteria);
  } catch (error) {
    res.status(500).json(error);
  }
};

updateCriteria = async (req, res) => {
  try {
    const criteria_update = await Criteria.findOneAndUpdate(
      { _id: req.params.id },
      {
        name_criteria: req.body.name_criteria,
        weight_criteria: req.body.weight_criteria,
        type_criteria: req.body.type_criteria,
      }
    );
    res.send(criteria_update);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

deleteCriteria = async (req, res) => {
  try {
    const criteria_id = req.params.id;
    const criteria = await Criteria.findById(criteria_id);
    if (!criteria) {
      return res.status(404).json({ message: "Criteria not found" });
    }
    const name_criteria = criteria.name_criteria;
    await Criteria.deleteOne({ _id: criteria_id });
    res.send(`Criteria with name ${name_criteria} deleted!`);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

deleteAllCriterias = async (req, res) => {
  try {
    await Criteria.deleteMany();
    res.send("All criterias deleted!");
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllCriterias,
  getCriteriaById,
  createCriteria,
  updateCriteria,
  deleteCriteria,
  deleteAllCriterias,
};
