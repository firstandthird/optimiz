const Svgo = require('svgo');
const fs = require('fs');

const svgOptimize = (file, callback) => {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      return callback(err);
    }
    new Svgo().optimize(data, (result) => {
      fs.writeFile(file, result.data, callback);
    });
  });
};

module.exports = svgOptimize;
