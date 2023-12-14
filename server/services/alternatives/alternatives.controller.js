const Alternative = require("./alternatives.model");
const { v4: uuidv4 } = require("uuid");

getAllAlternatives = async (req, res) => {
  try {
    const alternatives = await Alternative.find();
    res.send(alternatives);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

getAlternativeById = async (req, res) => {
  try {
    const alternative = await Alternative.findById(req.params.id);
    res.send(alternative);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

createAlternative = async (req, res) => {
  try {
    const new_alternative = await Alternative.create({
      _id: uuidv4(),
      name_alternative: req.body.name_alternative,
    });
    res.send(new_alternative);
  } catch (error) {
    res.status(500).json(error);
  }
};

updateAlternative = async (req, res) => {
  try {
    const alternative_update = await Alternative.findOneAndUpdate(
      { _id: req.params.id },
      {
        name_alternative: req.body.name_alternative,
      }
    );
    res.send(alternative_update);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

deleteAlternative = async (req, res) => {
  try {
    const alternative_id = req.params.id;
    const alternative = await Alternative.findById(alternative_id);
    if (!alternative) {
      return res.status(404).json({ message: "Alternative not found" });
    }
    const name_alternative = alternative.name_alternative;
    await Alternative.deleteOne({ _id: alternative_id });
    res.send(`Alternative with name ${name_alternative} deleted!`);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

deleteAllAlternatives = async (req, res) => {
  try {
    await Alternative.deleteMany({});
    res.send("All alternatives deleted!");
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllAlternatives,
  getAlternativeById,
  createAlternative,
  updateAlternative,
  deleteAlternative,
  deleteAllAlternatives,
};
