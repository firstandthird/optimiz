const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const imageminSvgo = require('imagemin-svgo');

module.exports = (options, buffer) => {
  const plugins = [];
  if (options.svgo !== false) {
    plugins.push(imageminSvgo(options));
  }
  if (options.png !== false) {
    plugins.push(imageminPngquant(options));
  }
  if (options.jpg !== false) {
    plugins.push(imageminJpegtran());
  }
  try {
    return imagemin.buffer(buffer, { plugins });
  } catch (err) {
    // anything other than error 99 is considered an unrecoverable error:
    if (err.code !== 99) {
      throw err;
    }
    return buffer;
  }
};
