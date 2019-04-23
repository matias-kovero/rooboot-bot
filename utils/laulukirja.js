const fs = require('fs');
//const laulukirja = require(__dirname + 'laulukirja.json');

const getLaulukirja = async () => {
    let responseTxt = '';
    // Luetaan JSON
    var json = JSON.parse(fs.readFileSync('./laulukirja.json').toString());
    return json;
};

module.exports = getLaulukirja;