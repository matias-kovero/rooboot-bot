const fs = require('fs');
//const laulukirja = require(__dirname + 'laulukirja.json');

const getLaulukirja = async () => {
    // Luetaan JSON
    try {
      var json = JSON.parse(fs.readFileSync(__dirname +'/laulukirja.json').toString());
      return json;
    } catch (err) {
      console.log(err);
    }
};

module.exports = getLaulukirja;