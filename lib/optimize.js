const sharp = require('sharp');

module.exports = async(options, buffer) => {
  try {
    const result = await sharp(buffer);
    if (options.png) {
      return result.png(options).toBuffer();
    }
    if (options.webp) {
      return result.webp(options).toBuffer();
    }
    // default is jpeg:
    return result.jpeg(options).toBuffer();
  } catch (err) {
    // anything other than error 99 is considered an unrecoverable error:
    if (err.code !== 99) {
      throw err;
    }
    return buffer;
  }
};
