const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const imageminSvgo = require('imagemin-svgo');

module.exports = (options, buffer) => {
  try {
    return imagemin.buffer(buffer, {
      plugins: [
        imageminPngquant(options),
        imageminSvgo(options),
        imageminJpegtran()
      ]
    });
  } catch (err) {
    // anything other than error 99 is considered an unrecoverable error:
    if (err.code !== 99) {
      throw err;
    }
    return buffer;
  }
};
