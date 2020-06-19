const Veikkaus = require("./model");

const addVeikkaus = async (name, traffic, waters, other) => {
  const newVeikkaus = new Veikkaus({
    name,
    traffic,
    waters,
    other,
  });

  try {
    const veikkaus = await newVeikkaus.save();
    return veikkaus;
  } catch (e) {
    throw new Error("Sinulta löytyy jo veikkaus. Tai jokin muu meni pieleen.");
  }
};

const listVeikkaukset = async () => {
  const veikkaukset = await Veikkaus.find({}).catch((e) => console.error(e));
  return veikkaukset;
};

const formatRow = (name, traffic, waters, other) => {
  return `${name}: 🚗 ${traffic} ⛵️ ${waters} ⚰️ ${other}`
}

module.exports = {
  addVeikkaus,
  listVeikkaukset,
  formatRow,
};
