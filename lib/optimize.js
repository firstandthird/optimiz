const sharp = require('sharp');

module.exports = async(buffer) => {
  try {
    return sharp(buffer).toBuffer();
  } catch (err) {
    // anything other than error 99 is considered an unrecoverable error:
    if (err.code !== 99) {
      throw err;
    }
    return buffer;
  }
};
