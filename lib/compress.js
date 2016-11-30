const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const os = require('os');

const compress = (file, level, callback) => {
  const handleResult = result => {
    if (result.length === 0) {
      return callback('Unable to compress image');
    }
    callback(null, result[0].path);
  };
  const options = {
    plugins: [imageminMozjpeg({ quality: level }), imageminPngquant({ quality: level })]
  };
  imagemin([file], os.tmpdir(), options).then(handleResult);
};
module.exports = compress;
