const fs = require('fs');

const getAnimalCount = async () => {
    // Luetaan JSON
    try {
      var json = JSON.parse(fs.readFileSync(__dirname +'/animalCount.json').toString());
      return json;
    } catch (err) {
      console.log(err);
    }
};

const addCatCount = async () => {
  try {
    var json = await getAnimalCount();
    var tmp = {
      "kissat": json.kissat + 1,
      "koirat": json.koirat
    };
    json.kissat = json.kissat + 1;
    fs.writeFile(__dirname + '/animalCount.json', json, 'utf8', function (err) {
      if (err) {
        console.log("An error occured while writing JSON object.");
      }
      console.log("JSON file has been saved.");
    });
    return tmp;
  } catch(err) {
    console.log(err);
  }
};

const addDogCount = async () => {
  try {
    var json = getAnimalCount();
    var tmp = {
      "kissat": json.kissat,
      "koirat": json.koirat + 1
    };
    json.koirat = json.koirat + 1;
    fs.writeFile(__dirname + '/animalCount.json', json, 'utf8', function (err) {
      if (err) {
        console.log("An error occured while writing JSON object.");
      }
      console.log("JSON file has been saved.");
    });
    return tmp;
  } catch(err) {
    console.log(err);
  }
};

module.exports = {
  getAnimalCount,
  addCatCount,
  addDogCount 
};