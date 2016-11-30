
const crop = (im, pathToFile, origin, dims, gravity, callback) => {
  const gm = require('gm').subClass({ imageMagick: im });
  const pathToOutput = pathToFile;
  gm(pathToFile)
  .gravity(gravity)
  .crop(dims[0], dims[1], origin[0], origin[1])
  .write(pathToOutput, (err) => {
    callback(err, pathToOutput);
  });
};

module.exports = crop;
